import Link from "next/link";

// 🔧 CUSTOMIZE: This is a minimal landing page.
// Replace with your actual website content or integrate the
// contact form and newsletter signup into your existing site.

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        {/* 🔧 CUSTOMIZE: Your business name */}
        Your Business Name
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {/* 🔧 CUSTOMIZE: Your tagline */}
        We help [your audience] achieve [their goal].
      </p>

      <div className="flex gap-4">
        <Link
          href="/contact"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Get in Touch
        </Link>
        <Link
          href="/newsletter"
          className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
        >
          Join Newsletter
        </Link>
      </div>
    </main>
  );
}
