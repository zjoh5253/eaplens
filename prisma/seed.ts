import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "People Ops",
  "Finance",
  "Customer Success",
  "Operations",
  "Legal",
];

const benefitCategories = [
  "Mental Health",
  "Financial Counseling",
  "Work-Life Balance",
  "Substance Use",
  "Legal Assistance",
  "Nutritional Coaching",
  "Career Coaching",
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function main() {
  console.log("Seeding database…");

  const org = await prisma.organization.upsert({
    where: { slug: "acme-corp" },
    update: {},
    create: {
      name: "Acme Corp",
      slug: "acme-corp",
      plan: "PROFESSIONAL",
    },
  });

  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "admin@acme-corp.com" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "admin@acme-corp.com",
      passwordHash,
      role: "HR_ADMIN",
      organizationId: org.id,
    },
  });

  // Generate 12 months of utilization data
  const startDate = new Date("2024-01-01");

  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const month = addMonths(startDate, monthOffset);

    for (const department of departments) {
      // Not all departments use all categories every month
      const activeCategories = benefitCategories.filter(() => Math.random() > 0.2);

      for (const benefitCategory of activeCategories) {
        // Mental health trends up over the year; others are flatter
        const trend = benefitCategory === "Mental Health" ? 1 + monthOffset * 0.05 : 1;
        const base = benefitCategory === "Mental Health" ? 15 : 5;

        await prisma.utilizationRecord.create({
          data: {
            department,
            benefitCategory,
            utilizationCount: Math.round(randomBetween(base, base + 20) * trend),
            month,
            organizationId: org.id,
          },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
