import Link from "next/link";
import { BarChart3, TrendingUp, Shield, Upload } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">EAPLens</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <TrendingUp className="h-4 w-4" />
          Built for HR teams at 200–2,000 person companies
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
          Know your EAP ROI.
          <br />
          <span className="text-blue-600">Finally.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          EAPLens turns your EAP utilization data into clear dashboards your leadership
          team can actually act on. Upload a CSV, see instant insights.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            Start free trial
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-base font-semibold hover:bg-gray-50 transition-colors"
          >
            Sign in to dashboard
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-4">No credit card required · 14-day free trial</p>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
            title="Department-level utilization"
            description="See which teams use your EAP most — and least — broken down by benefit category."
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
            title="Month-over-month trends"
            description="Spot seasonal patterns and track whether your EAP investment is gaining traction."
          />
          <FeatureCard
            icon={<Upload className="h-6 w-6 text-blue-600" />}
            title="One-click CSV import"
            description="Upload your EAP provider's utilization export and get a live dashboard in seconds."
          />
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500 mb-12">One plan per company size. No per-seat surprises.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <PricingCard name="Starter" price="$299" description="Up to 500 employees" />
            <PricingCard name="Professional" price="$499" description="Up to 1,000 employees" featured />
            <PricingCard name="Enterprise" price="$799" description="Up to 2,000 employees" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">EAPLens</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 EAPLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  featured,
}: {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 text-left ${
        featured
          ? "bg-blue-600 border-blue-600 text-white ring-2 ring-blue-600 ring-offset-2"
          : "bg-white border-gray-200"
      }`}
    >
      <p className={`text-sm font-medium mb-1 ${featured ? "text-blue-200" : "text-gray-500"}`}>
        {name}
      </p>
      <p className={`text-3xl font-bold mb-1 ${featured ? "text-white" : "text-gray-900"}`}>
        {price}
        <span className={`text-sm font-normal ml-1 ${featured ? "text-blue-200" : "text-gray-400"}`}>
          /mo
        </span>
      </p>
      <p className={`text-sm ${featured ? "text-blue-100" : "text-gray-500"}`}>{description}</p>
      <Link
        href="/register"
        className={`mt-6 block text-center text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
          featured
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Get started
      </Link>
    </div>
  );
}
