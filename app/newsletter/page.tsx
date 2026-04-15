"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">You&apos;re in!</h2>
        <p className="text-gray-600">
          Check your inbox for a welcome email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8">
      {/* 🔧 CUSTOMIZE: Change the headline and description */}
      <h2 className="text-2xl font-bold mb-2">Join the Newsletter</h2>
      <p className="text-gray-600 mb-6">
        Get weekly tips and insights delivered straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "sending" ? "Subscribing..." : "Subscribe"}
        </button>

        {status === "error" && (
          <p className="text-red-500 text-sm">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
