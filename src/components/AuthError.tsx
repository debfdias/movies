"use client";

interface AuthErrorProps {
  error: string | null;
}

export default function AuthError({ error }: AuthErrorProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
      {error}
    </div>
  );
}
