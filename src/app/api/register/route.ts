import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let attempt = slug;
  let i = 1;
  while (await prisma.organization.findUnique({ where: { slug: attempt } })) {
    attempt = `${slug}-${i++}`;
  }
  return attempt;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { name?: string; email?: string; password?: string; orgName?: string };
  const { name, email, password, orgName } = body;

  if (!email || !password || !orgName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const slug = await uniqueSlug(orgName);
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.organization.create({
    data: {
      name: orgName,
      slug,
      users: {
        create: {
          name: name ?? null,
          email,
          passwordHash,
          role: "HR_ADMIN",
        },
      },
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
