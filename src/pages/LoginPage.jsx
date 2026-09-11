import {
    GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/dataStoring";
import NexoraLogo from "../components/NexoraLogo";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      console.log("Logged in:", userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "auth/invalid-credential") {
        console.log("Invalid email or password");
      } else if (error.code === "auth/network-request-failed") {
        console.log("Network error — check connection or Firebase config");
      }
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in:", result.user);
      navigate("/home");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const githubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("Logged in:", result.user);
      navigate("/home");
    } catch (error) {
      console.error("GitHub login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Top Logo & Title */}
        <div className="text-center mb-8">
          <a href="#" className="inline-flex items-center space-x-2 mb-4 group">
            <NexoraLogo className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
          </a>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">
            Log in to continue chatting with Nexora
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={googleLogin}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-800/80 hover:bg-gray-800 border border-gray-700/80 rounded-xl text-sm font-medium transition duration-200 hover:border-gray-600"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.6-.7-.9-1.5-.9-2.3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={githubLogin}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-800/80 hover:bg-gray-800 border border-gray-700/80 rounded-xl text-sm font-medium transition duration-200 hover:border-gray-600"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-800 w-full"></div>
          <span className="bg-gray-900 px-3 text-xs text-gray-500 uppercase tracking-widest relative z-10">
            or
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1.5"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs text-blue-400 hover:text-blue-300 transition duration-200"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-gray-950/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.016 10.016 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.165-3.693a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-700 bg-gray-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-400 cursor-pointer">
              Remember me for 30 days
            </label>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition duration-300 transform active:scale-[0.98]"
          >
            Sign in to Nexora
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Don't have an account?{" "}
          <Link
            to={"/login/signup"}
            className="text-blue-400 font-medium hover:text-blue-300 transition duration-200"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
