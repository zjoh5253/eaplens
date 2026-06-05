import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

interface Category {
  benefitCategory: string;
  totalUtilization: number;
}

interface TopCategoriesProps {
  categories: Category[];
}

const RANK_COLORS = ["text-yellow-500", "text-gray-400", "text-amber-600"];
const RANK_LABELS = ["1st", "2nd", "3rd"];

export function TopCategories({ categories }: TopCategoriesProps) {
  const top3 = categories.slice(0, 3);
  const maxUtil = top3[0]?.totalUtilization ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-500" />
          Top Benefit Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {top3.map((cat, idx) => (
            <div key={cat.benefitCategory}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-6 ${RANK_COLORS[idx]}`}>
                    {RANK_LABELS[idx]}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{cat.benefitCategory}</span>
                </div>
                <span className="text-sm text-gray-500">{cat.totalUtilization.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(cat.totalUtilization / maxUtil) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {top3.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
