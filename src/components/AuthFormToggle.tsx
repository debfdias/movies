"use client";

interface AuthFormToggleProps {
  isLogin: boolean;
  toggleAuthMode: () => void;
}

export default function AuthFormToggle({
  isLogin,
  toggleAuthMode,
}: AuthFormToggleProps) {
  return (
    <p className="text-center mt-8">
      {isLogin ? "Don't have an account? " : "Already have an account? "}
      <button
        onClick={toggleAuthMode}
        className="cursor-pointer text-[#2BD17E] hover:underline focus:outline-none"
      >
        {isLogin ? "Register" : "Login"}
      </button>
    </p>
  );
}
