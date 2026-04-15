"use client";

import { useState } from "react";
import { config } from "../../lib/config";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    budget: "",
    challenge: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Thanks for reaching out!</h2>
        <p className="text-gray-600">
          We received your message and will follow up within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
      <p className="text-gray-600 mb-8">
        {/* 🔧 CUSTOMIZE: Change this tagline for your niche */}
        Tell us about your project and we&apos;ll get back to you within 24
        hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="you@example.com"
          />
        </div>

        {/* Interest — 🔧 CUSTOMIZE the options in lib/config.ts */}
        <div>
          <label htmlFor="interest" className="block text-sm font-medium mb-1">
            {/* 🔧 CUSTOMIZE: Change this label for your niche */}
            What are you looking for?
          </label>
          <select
            id="interest"
            value={formData.interest}
            onChange={(e) => updateField("interest", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select an option</option>
            {config.interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            Budget Range
          </label>
          <select
            id="budget"
            value={formData.budget}
            onChange={(e) => updateField("budget", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select a range</option>
            {config.budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Challenge */}
        <div>
          <label
            htmlFor="challenge"
            className="block text-sm font-medium mb-1"
          >
            {/* 🔧 CUSTOMIZE: Change this question for your niche */}
            What&apos;s your biggest challenge right now?
          </label>
          <textarea
            id="challenge"
            value={formData.challenge}
            onChange={(e) => updateField("challenge", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            rows={3}
            placeholder="Tell us what you're struggling with..."
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Anything else you&apos;d like us to know?
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            rows={4}
            placeholder="Project details, timeline, questions..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {status === "error" && (
          <p className="text-red-500 text-sm">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </form>
    </div>
  );
}
