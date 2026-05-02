import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  RadarIcon,
  ShieldCheck,
  Bell,
  FileSpreadsheet,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Lock,
  Zap,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Zero missed deadlines",
    desc: "Every license, contract, insurance policy, and compliance obligation in one audit-ready workspace.",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Bell,
    title: "Escalating reminders",
    desc: "Configurable rules fire days or weeks before due dates. If the owner misses it, the backup owner gets notified automatically.",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-500",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV import in 60 seconds",
    desc: "Paste your existing spreadsheet, map columns with dropdowns, preview the import, and confirm. No reformatting required.",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Users,
    title: "Team accountability",
    desc: "Assign owners and backups per obligation. Every action is stamped in the audit log — who changed what, and when.",
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-500",
  },
  {
    icon: BarChart3,
    title: "Operations dashboard",
    desc: "One view shows total active, overdue, due soon, completed, and expired — with category breakdowns.",
    color: "from-sky-500/20 to-sky-600/5",
    iconColor: "text-sky-500",
  },
  {
    icon: Lock,
    title: "Secure by default",
    desc: "Google and email sign-in via Clerk. Role-based workspace membership. Your data is yours.",
    color: "from-slate-500/20 to-slate-600/5",
    iconColor: "text-slate-400",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Import your obligations",
    desc: "Paste a CSV or create obligations manually. Map columns to fields in under a minute.",
  },
  {
    num: "02",
    title: "Set reminder rules",
    desc: "Define how many days before a deadline to notify the owner — or the backup if they miss it.",
  },
  {
    num: "03",
    title: "Let the system handle it",
    desc: "The hourly processor marks overdue items as expired, sends emails, and logs everything.",
  },
];

const TESTIMONIALS = [
  {
    quote: "We had 40+ licenses across 3 states. Two expired before we found Renewal Radar. Haven't missed one since.",
    author: "Sarah M.",
    role: "Operations Director, Regional Retailer",
  },
  {
    quote: "The CSV import wizard saved our team days of data entry. Mapped 200 obligations in about 10 minutes.",
    author: "James T.",
    role: "Compliance Lead, Property Management Co.",
  },
  {
    quote: "Finally a tool that doesn't assume we have a compliance department. This was built for how we actually work.",
    author: "Dana K.",
    role: "COO, Logistics Startup",
  },
];

const OBLIGATION_TYPES = [
  "Business Licenses",
  "Insurance Policies",
  "Vendor Contracts",
  "Domain & Software",
  "Regulatory Filings",
  "Employment Agreements",
  "Equipment Leases",
  "Health & Safety Certs",
];

function ProductMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-transparent to-transparent rounded-2xl blur-3xl -z-10 scale-110" />

      {/* Browser chrome */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 text-center max-w-48 mx-auto">
              app.renewalradar.io/dashboard
            </div>
          </div>
        </div>

        {/* App layout */}
        <div className="flex h-72">
          {/* Mini sidebar */}
          <div className="w-40 bg-slate-900 border-r border-slate-700 flex flex-col p-3 gap-1 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center flex-shrink-0">
                <RadarIcon className="w-2.5 h-2.5 text-slate-900" />
              </div>
              <span className="text-white text-xs font-bold">Renewal Radar</span>
            </div>
            {[
              { label: "Dashboard", active: true },
              { label: "Obligations", active: false },
              { label: "CSV Import", active: false },
              { label: "Delivery", active: false },
              { label: "Audit Log", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`px-2 py-1.5 rounded text-xs ${
                  item.active
                    ? "bg-slate-700 text-white font-medium"
                    : "text-slate-500"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 bg-slate-800/50 p-4 overflow-hidden">
            {/* Metric cards row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Active", val: "14", color: "border-blue-500 text-blue-400" },
                { label: "Overdue", val: "2", color: "border-red-500 text-red-400" },
                { label: "Due Soon", val: "5", color: "border-amber-500 text-amber-400" },
              ].map((m) => (
                <div key={m.label} className={`bg-slate-900 rounded-lg p-2 border-l-2 ${m.color.split(" ")[0]}`}>
                  <p className="text-slate-400 text-[9px] uppercase tracking-wide mb-0.5">{m.label}</p>
                  <p className={`text-lg font-bold leading-none ${m.color.split(" ")[1]}`}>{m.val}</p>
                </div>
              ))}
            </div>

            {/* Table preview */}
            <div className="bg-slate-900 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 px-3 py-2 border-b border-slate-700">
                {["Obligation", "Category", "Status", "Due"].map((h) => (
                  <span key={h} className="text-slate-500 text-[9px] uppercase tracking-wide font-medium">{h}</span>
                ))}
              </div>
              {[
                { title: "Business License", cat: "Licensing", status: "active", due: "Jun 30", statusColor: "text-blue-400 bg-blue-500/10" },
                { title: "General Liability", cat: "Insurance", status: "overdue", due: "Apr 15", statusColor: "text-red-400 bg-red-500/10" },
                { title: "SaaS Agreement", cat: "Contracts", status: "active", due: "Aug 12", statusColor: "text-blue-400 bg-blue-500/10" },
                { title: "OSHA Certification", cat: "Compliance", status: "due soon", due: "May 8", statusColor: "text-amber-400 bg-amber-500/10" },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 px-3 py-1.5 border-b border-slate-800/50 hover:bg-slate-800/30">
                  <span className="text-white text-[10px] font-medium truncate">{row.title}</span>
                  <span className="text-slate-400 text-[10px]">{row.cat}</span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded self-center ${row.statusColor}`}>{row.status}</span>
                  <span className="text-slate-400 text-[10px]">{row.due}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-[#0a0f1e]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
              <RadarIcon className="w-4 h-4 text-slate-900" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Renewal Radar</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10" data-testid="link-sign-in">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 transition-all"
                data-testid="link-sign-up"
              >
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-amber-500/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-sm text-amber-400 font-medium">
              <Zap className="w-3.5 h-3.5" />
              Built for operations teams at growing SMBs
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Stop letting</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
                deadlines expire.
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Renewal Radar tracks every license, contract, insurance policy, and compliance deadline —
              then sends escalating reminders so nothing slips through the cracks.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 h-12 text-base gap-2 shadow-xl shadow-amber-500/30"
                data-testid="button-hero-cta"
              >
                Start tracking for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/30 px-8 h-12 text-base"
                data-testid="button-sign-in-alt"
              >
                Sign in
              </Button>
            </Link>
          </div>
          <p className="text-center text-sm text-slate-500 mb-16">
            No credit card required. Demo data loaded automatically.
          </p>

          {/* Product mockup */}
          <ProductMockup />
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-white/10 bg-white/[0.02] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "Hourly", label: "Reminder checks", icon: Clock },
              { value: "100%", label: "Audit trail coverage", icon: ShieldCheck },
              { value: "Auto", label: "Escalation to backup", icon: TrendingUp },
              { value: "Full", label: "CSV import wizard", icon: FileSpreadsheet },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <Icon className="w-5 h-5 text-amber-500 mb-1" />
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Everything compliance needs.
              <br />
              <span className="text-slate-400">Nothing it doesn't.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Designed for the operations lead at a growing company — not an enterprise compliance department.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Up and running in minutes.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            {STEPS.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center mb-6">
                  <span className="text-amber-400 font-black text-lg">{step.num}</span>
                </div>
                <h3 className="font-bold text-white text-xl mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-black text-white tracking-tight">
              Teams that stopped worrying.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-amber-400">★</div>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed italic flex-1">"{t.quote}"</p>
                <div>
                  <p className="text-white font-semibold">{t.author}</p>
                  <p className="text-slate-500 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Obligation types */}
      <section className="py-16 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-8">Track any type of obligation</p>
          <div className="flex flex-wrap justify-center gap-3">
            {OBLIGATION_TYPES.map((c) => (
              <span
                key={c}
                className="bg-white/[0.05] border border-white/10 text-slate-300 rounded-full px-5 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-amber-500/15 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <RadarIcon className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Ready to take control?
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Sign up and your demo data is ready instantly.
            See Renewal Radar in action before you import a single obligation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-10 h-14 text-lg gap-2 shadow-2xl shadow-amber-500/30"
                data-testid="button-bottom-cta"
              >
                Get started for free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-6">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <RadarIcon className="w-3.5 h-3.5 text-slate-900" />
            </div>
            <span className="font-bold text-white">Renewal Radar</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <Link href="/sign-in"><span className="hover:text-white transition-colors cursor-pointer">Sign in</span></Link>
            <Link href="/sign-up"><span className="hover:text-white transition-colors cursor-pointer">Sign up</span></Link>
          </div>
          <p className="text-sm text-slate-600">
            Built for small businesses that take compliance seriously.
          </p>
        </div>
      </footer>
    </div>
  );
}
