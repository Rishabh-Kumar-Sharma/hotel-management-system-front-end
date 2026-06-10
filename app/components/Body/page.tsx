import Link from "next/link";

export const Body = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_60%)]" />

        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 max-w-4xl shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Smart Hotel Management
            <span className="block text-indigo-300 mt-2">
              Simplified. Scalable. Powerful.
            </span>
          </h1>

          <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
            Manage rooms, bookings, and customers with a modern system designed
            for real-world hotel operations and future scalability.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/Rooms"
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Explore Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <GlassCard
            title="Room Management"
            desc="Track availability, pricing, and room categories in real-time."
          />
          <GlassCard
            title="Booking Lifecycle"
            desc="Handle check-ins, confirmations, cancellations, and expirations seamlessly."
          />
          <GlassCard
            title="Customer Records"
            desc="Maintain structured guest profiles with instant access."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-28">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Modernize Your Hotel Operations?
          </h2>
          <p className="text-gray-300 mb-8">
            Built with scalability in mind — evolve from a single-hotel setup to
            a multi-tenant SaaS platform.
          </p>
          <Link
            href="/Bookings"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

function GlassCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform">
      <h3 className="text-xl font-semibold mb-3 text-indigo-300">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
