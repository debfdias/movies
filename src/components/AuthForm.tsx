"use client";

import AuthFormFields from "./AuthFormFields";
import AuthFormToggle from "./AuthFormToggle";
import AuthError from "./AuthError";
import { useAuth } from "@/hooks/useAuth";

export default function AuthForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    isLogin,
    error,
    handleSubmit,
    toggleAuthMode,
  } = useAuth();

  return (
    <div className="min-h-screen bg-[#093545] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-10">
        {isLogin ? "Login" : "Register"}
      </h1>

      <div className="w-full max-w-md">
        <AuthError error={error} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-[#2BD17E] text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200 font-medium text-lg"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <AuthFormToggle isLogin={isLogin} toggleAuthMode={toggleAuthMode} />
      </div>
    </div>
  );
}
