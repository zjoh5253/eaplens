import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopCategories } from "@/components/dashboard/TopCategories";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UtilizationBarChart } from "@/components/charts/UtilizationBarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import Link from "next/link";
import { Upload } from "lucide-react";

interface SessionUser {
  organizationId?: string;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const orgId = (session.user as SessionUser).organizationId;
  if (!orgId) redirect("/login");

  const [records, org] = await Promise.all([
    prisma.utilizationRecord.findMany({
      where: { organizationId: orgId },
      orderBy: { month: "asc" },
    }),
    prisma.organization.findUnique({ where: { id: orgId } }),
  ]);

  // Department aggregation
  const byDepartment = new Map<string, number>();
  for (const r of records) {
    byDepartment.set(r.department, (byDepartment.get(r.department) ?? 0) + r.utilizationCount);
  }
  const departmentData = Array.from(byDepartment.entries())
    .map(([department, totalUtilization]) => ({ department, totalUtilization }))
    .sort((a, b) => b.totalUtilization - a.totalUtilization);

  // Monthly trend
  const byMonth = new Map<string, number>();
  for (const r of records) {
    const key = r.month.toISOString().slice(0, 7); // YYYY-MM
    byMonth.set(key, (byMonth.get(key) ?? 0) + r.utilizationCount);
  }
  const monthlyData = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, totalUtilization]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      totalUtilization,
    }));

  // Category aggregation
  const byCategory = new Map<string, number>();
  for (const r of records) {
    byCategory.set(r.benefitCategory, (byCategory.get(r.benefitCategory) ?? 0) + r.utilizationCount);
  }
  const categoryData = Array.from(byCategory.entries())
    .map(([benefitCategory, totalUtilization]) => ({ benefitCategory, totalUtilization }))
    .sort((a, b) => b.totalUtilization - a.totalUtilization);

  const totalUtilization = records.reduce((sum, r) => sum + r.utilizationCount, 0);
  const uniqueDepts = new Set(records.map((r) => r.department)).size;

  // Month-over-month change
  let momChange: string | undefined;
  let momTrend: "up" | "down" | "neutral" = "neutral";
  if (monthlyData.length >= 2) {
    const lastTwo = monthlyData.slice(-2);
    const prev = lastTwo[0].totalUtilization;
    const curr = lastTwo[1].totalUtilization;
    if (prev > 0) {
      const pct = Math.round(((curr - prev) / prev) * 100);
      momChange = `${pct >= 0 ? "+" : ""}${pct}% vs prior month`;
      momTrend = pct >= 0 ? "up" : "down";
    }
  }

  const hasData = records.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {org?.name ?? "Your"} EAP Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Utilization data at a glance
            </p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload data
          </Link>
        </div>

        {!hasData ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-16 text-center">
            <Upload className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No data yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              Upload a CSV of your EAP utilization data to see department breakdowns and trends.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload your first CSV
            </Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard
                label="Total Utilization Events"
                value={totalUtilization.toLocaleString()}
                subtext={momChange}
                trend={momTrend}
              />
              <StatCard
                label="Departments Tracked"
                value={uniqueDepts}
                subtext="across your organization"
              />
              <StatCard
                label="Benefit Categories"
                value={categoryData.length}
                subtext="active in the period"
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilization by Department</CardTitle>
                  <CardDescription>Total events per department across all months</CardDescription>
                </CardHeader>
                <CardContent>
                  <UtilizationBarChart data={departmentData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Month-over-Month Trend</CardTitle>
                  <CardDescription>Total utilization events per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendLineChart data={monthlyData} />
                </CardContent>
              </Card>
            </div>

            {/* Top categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TopCategories categories={categoryData} />

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Department Breakdown</CardTitle>
                  <CardDescription>Ranked by total utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-gray-100">
                    {departmentData.map((d, i) => (
                      <div key={d.department} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 w-5 text-right">{i + 1}</span>
                          <span className="text-sm font-medium text-gray-900">{d.department}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${(d.totalUtilization / (departmentData[0]?.totalUtilization ?? 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-16 text-right">
                            {d.totalUtilization.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
