import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="text-white font-sans min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
      
      {/* Inline styles for the animated gradient background */}
      <style>
        {`
          .bg-animated {
            background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #0f172a);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      
      {/* Animated Background Layer */}
      <div className="bg-animated absolute inset-0 z-0 pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className="w-full border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <svg className="w-8 h-8 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Nexora AI
              </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition duration-200">Features</a>
              <a href="#use-cases" className="text-gray-300 hover:text-white transition duration-200">Use Cases</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition duration-200">Pricing</a>
            </nav>

            {/* Login & Sign Up Buttons */}
            <div className="flex items-center space-x-4">
              <Link to={"/login"} className="text-gray-300 hover:text-white font-medium transition duration-200 hidden sm:block">
                Log in
              </Link>
              <Link to={"/signup"} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition duration-300 shadow-lg shadow-blue-500/30">
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Live Status Pill */}
          <div className="inline-flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 border border-gray-700 cursor-pointer hover:bg-gray-700 transition">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Nexora 2.0 is now live</span>
          </div>

          {/* Catchy Lines */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Think smarter, build faster with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Nexora AI</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your ultimate conversational partner. Whether you're writing code, drafting emails, or brainstorming your next big idea, Nexora is here to amplify your creativity and productivity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to={"/login"} className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1 shadow-xl">
              Start Chatting Now
            </Link>
          </div>

          {/* Trust / Social Proof */}
          <div className="mt-20 pt-8 border-t border-gray-800/60">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Trusted by innovative teams worldwide</p>
            <div className="flex justify-center gap-8 opacity-50 grayscale flex-wrap">
              <span className="text-xl font-bold">Acme Corp</span>
              <span className="text-xl font-bold">GlobalTech</span>
              <span className="text-xl font-bold">InnovateOS</span>
              <span className="text-xl font-bold">NexusFlow</span>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default LandingPage;