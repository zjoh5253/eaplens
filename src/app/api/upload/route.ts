import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

interface CsvRow {
  department?: string;
  benefit_category?: string;
  utilization_count?: string;
  month?: string;
  [key: string]: string | undefined;
}

interface SessionUser {
  organizationId?: string;
}

const REQUIRED_COLUMNS = ["department", "benefit_category", "utilization_count", "month"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = (session.user as SessionUser).organizationId;
  if (!orgId) {
    return NextResponse.json({ error: "No organization found" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.endsWith(".csv")) {
    return NextResponse.json({ error: "File must be a CSV" }, { status: 400 });
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const text = await file.text();

  let rows: CsvRow[];
  try {
    rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[];
  } catch {
    return NextResponse.json({ error: "Could not parse CSV — check the file format." }, { status: 400 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV is empty" }, { status: 400 });
  }

  const headers = Object.keys(rows[0]);
  const missing = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required columns: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const batchId = crypto.randomUUID();
  const records: {
    department: string;
    benefitCategory: string;
    utilizationCount: number;
    month: Date;
    organizationId: string;
    uploadBatchId: string;
  }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lineNum = i + 2; // account for header row

    const department = row.department?.trim();
    const benefitCategory = row.benefit_category?.trim();
    const countStr = row.utilization_count?.trim();
    const monthStr = row.month?.trim();

    if (!department || !benefitCategory || !countStr || !monthStr) {
      errors.push(`Row ${lineNum}: missing required value`);
      continue;
    }

    const utilizationCount = parseInt(countStr, 10);
    if (isNaN(utilizationCount) || utilizationCount < 0) {
      errors.push(`Row ${lineNum}: utilization_count must be a non-negative integer`);
      continue;
    }

    const month = new Date(monthStr);
    if (isNaN(month.getTime())) {
      errors.push(`Row ${lineNum}: invalid date "${monthStr}" — use YYYY-MM-DD`);
      continue;
    }

    records.push({
      department,
      benefitCategory,
      utilizationCount,
      month,
      organizationId: orgId,
      uploadBatchId: batchId,
    });
  }

  if (errors.length > 0 && records.length === 0) {
    return NextResponse.json(
      { error: `All rows had errors:\n${errors.slice(0, 5).join("\n")}` },
      { status: 400 }
    );
  }

  await prisma.utilizationRecord.createMany({ data: records });

  return NextResponse.json({
    message: `Imported ${records.length} records.`,
    count: records.length,
    skipped: errors.length,
    batchId,
  });
}
