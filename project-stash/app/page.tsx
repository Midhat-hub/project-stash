// app/page.tsx
"use client";

import React from "react";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">Stash</h1>
        <div className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-blue-600">Log in</a>
          <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Sign up</a>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Save smarter. Spend wiser.</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10">Stash helps you stay in control of your money — effortlessly. Track spending, get real-time nudges, and build saving habits without thinking about it.</p>
        <p className="max-w-3xl mx-auto text-gray-700">Stash is an AI-powered financial guide designed to help students manage money with clarity. It detects overspending patterns, predicts when you might run out of money, and nudges you before you make a bad spending decision. With automated saving routines and simple insights, Stash makes saving effortless — even for first-time budgeters.</p>
      </main>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Feature Highlights</h3>
          <p className="text-center text-gray-600 mb-12">Everything you need to start saving without effort.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Realtime Overspending Alerts</h4>
              <p className="text-gray-600">Get notified the moment you’re about to break your weekly or monthly limit — before it becomes a problem.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Intelligent Predictions</h4>
              <p className="text-gray-600">Stash analyzes your habits and predicts how long your money will last so you don’t run out mid-month.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Smart Nudges</h4>
              <p className="text-gray-600">During checkout, Stash gently warns: “This purchase will put you over budget. Are you sure?”</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Automated Micro-Saving</h4>
              <p className="text-gray-600">Every time you receive money, Stash helps move a small portion to savings — automatically.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Simple Visual Insights</h4>
              <p className="text-gray-600">Clear breakdowns of food, travel, shopping, and subscriptions help you instantly see where your money is going.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Built for Students</h4>
              <p className="text-gray-600">No complicated charts. No financial jargon. Just clarity and confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 bg-blue-50 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Stash Today</h2>
          <h3 className="text-lg text-gray-600 mb-8">Start saving effortlessly</h3>

          <form
            className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-2xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input name="name" type="text" placeholder="Your first name" className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            <input name="email" type="email" placeholder="Your email address" className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full md:w-auto">Sign Up</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t mt-16">
        <div className="text-center text-gray-500 text-sm">
          <a href="#" className="hover:text-blue-600">Privacy Policy</a> •
          <a href="#" className="hover:text-blue-600"> Terms of Use</a>
        </div>
      </footer>
    </>
  );
}
