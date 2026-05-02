import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardMetrics,
  getGetDashboardMetricsQueryKey,
  useGetUpcomingObligations,
  getGetUpcomingObligationsQueryKey,
} from "@workspace/api-client-react";
import { StatusBadge, DueDateBadge } from "@/components/ObligationBadge";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  Plus,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value?: number;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  isLoading?: boolean;
  href?: string;
  urgency?: "critical" | "warning" | "normal";
};

function MetricCard({ title, value, icon: Icon, accentColor, bgColor, borderColor, isLoading, href, urgency }: MetricCardProps) {
  const content = (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        borderColor,
      )}
      data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Top accent bar */}
      <div className={cn("h-1 w-full", accentColor)} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bgColor)}>
            <Icon className={cn("w-4 h-4", accentColor.replace("bg-", "text-"))} />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-9 w-16 mt-1" />
        ) : (
          <div className="flex items-end justify-between">
            <p className={cn("text-4xl font-black tracking-tight leading-none", urgency === "critical" && (value ?? 0) > 0 ? "text-red-600" : urgency === "warning" && (value ?? 0) > 0 ? "text-amber-600" : "text-slate-900")}>
              {value ?? 0}
            </p>
            {href && (
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mb-1" />
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

const CATEGORY_COLORS: Record<string, string> = {
  Licensing: "bg-blue-500",
  Insurance: "bg-purple-500",
  Contracts: "bg-indigo-500",
  Software: "bg-sky-500",
  "HR & Compliance": "bg-emerald-500",
  "Real Estate": "bg-orange-500",
  Other: "bg-slate-400",
};

export default function DashboardPage() {
  const { user } = useUser();
  const [workspaceId, setWorkspaceId] = useState<number | undefined>();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!user || seeded) return;
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;
    setSeeded(true);
    fetch("/api/me/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        name: user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : undefined,
      }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.workspaceId) setWorkspaceId(data.workspaceId); })
      .catch(() => {});
  }, [user, seeded]);

  const metricsQuery = useGetDashboardMetrics(
    workspaceId !== undefined ? { workspaceId } : {},
    { query: { queryKey: getGetDashboardMetricsQueryKey(workspaceId !== undefined ? { workspaceId } : {}), enabled: true } },
  );

  const upcomingQuery = useGetUpcomingObligations(
    workspaceId !== undefined ? { workspaceId, days: 30 } : { days: 30 },
    { query: { queryKey: getGetUpcomingObligationsQueryKey(workspaceId !== undefined ? { workspaceId, days: 30 } : { days: 30 }), enabled: true } },
  );

  const metrics = metricsQuery.data;
  const upcoming = upcomingQuery.data ?? [];

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              {user?.firstName ? `Welcome back, ${user.firstName}.` : "Welcome back."}{" "}
              Here's what needs your attention.
            </p>
          </div>
          <Link href="/obligations/new">
            <Button
              className="gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-sm rounded-xl"
              data-testid="button-new-obligation"
            >
              <Plus className="w-4 h-4" />
              New Obligation
            </Button>
          </Link>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="Total Active"
            value={metrics?.totalActive}
            icon={Clock}
            accentColor="bg-blue-500"
            bgColor="bg-blue-50"
            borderColor="border-slate-200"
            isLoading={metricsQuery.isLoading}
            href="/obligations?status=active"
          />
          <MetricCard
            title="Overdue"
            value={metrics?.overdue}
            icon={AlertTriangle}
            accentColor="bg-red-500"
            bgColor="bg-red-50"
            borderColor="border-slate-200"
            isLoading={metricsQuery.isLoading}
            urgency="critical"
            href="/obligations?status=expired"
          />
          <MetricCard
            title="Due Soon"
            value={metrics?.dueSoon}
            icon={Clock}
            accentColor="bg-amber-500"
            bgColor="bg-amber-50"
            borderColor="border-slate-200"
            isLoading={metricsQuery.isLoading}
            urgency="warning"
          />
          <MetricCard
            title="Completed"
            value={metrics?.completed}
            icon={CheckCircle2}
            accentColor="bg-emerald-500"
            bgColor="bg-emerald-50"
            borderColor="border-slate-200"
            isLoading={metricsQuery.isLoading}
          />
          <MetricCard
            title="Expired"
            value={metrics?.expired}
            icon={XCircle}
            accentColor="bg-slate-400"
            bgColor="bg-slate-100"
            borderColor="border-slate-200"
            isLoading={metricsQuery.isLoading}
          />
          <MetricCard
            title="Reminders (30d)"
            value={metrics?.remindersSentLast30Days}
            icon={Bell}
            accentColor="bg-violet-500"
            bgColor="bg-violet-50"
            borderColor="border-slate-200"
            isLoading={metricsQuery.isLoading}
            href="/delivery"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming table — 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-slate-900">Upcoming Deadlines</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Next 30 days</p>
                </div>
                <Link href="/obligations?status=active">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-slate-500 hover:text-slate-900"
                    data-testid="link-view-all-obligations"
                  >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              {upcomingQuery.isLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                </div>
              ) : upcoming.length === 0 ? (
                <div className="py-16 px-6 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-600 mb-1">You're all caught up</p>
                  <p className="text-sm text-slate-400">No obligations due in the next 30 days.</p>
                </div>
              ) : (
                <div>
                  {upcoming.map((o, idx) => (
                    <Link key={o.id} href={`/obligations/${o.id}`}>
                      <div
                        className={cn(
                          "flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group",
                          idx < upcoming.length - 1 ? "border-b border-slate-100" : "",
                        )}
                        data-testid={`row-obligation-${o.id}`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={cn("w-2 h-2 rounded-full flex-shrink-0", CATEGORY_COLORS[o.category] ?? "bg-slate-400")} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900">
                              {o.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {o.category}{o.ownerEmail ? ` · ${o.ownerEmail}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                          <DueDateBadge dueDate={o.dueDate} status={o.status} />
                          <span className="text-xs text-slate-400 hidden sm:block">
                            {format(parseISO(o.dueDate), "MMM d")}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* By category */}
            {metrics?.byCategory && metrics.byCategory.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900">By Category</h2>
                </div>
                <div className="p-4 space-y-2">
                  {metrics.byCategory.map((item) => (
                    <Link
                      key={item.category}
                      href={`/obligations?category=${encodeURIComponent(item.category)}`}
                    >
                      <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                        data-testid={`card-category-${item.category}`}
                      >
                        <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", CATEGORY_COLORS[item.category] ?? "bg-slate-400")} />
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{item.category}</span>
                        <span className="text-sm font-bold text-slate-900 ml-2">{item.count}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { label: "Add obligation", href: "/obligations/new", icon: Plus, desc: "Track a new deadline" },
                  { label: "Import CSV", href: "/import", icon: TrendingUp, desc: "Bulk import from spreadsheet" },
                  { label: "View audit log", href: "/audit", icon: CheckCircle2, desc: "See recent changes" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.href} href={action.href}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{action.label}</p>
                          <p className="text-xs text-slate-400">{action.desc}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 ml-auto transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
