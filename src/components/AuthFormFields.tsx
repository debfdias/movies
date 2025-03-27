"use client";

interface AuthFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export default function AuthFormFields({
  email,
  setEmail,
  password,
  setPassword,
}: AuthFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="email"
          className="absolute text-white duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] left-4 peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          Email
        </label>
      </div>
      <div className="relative">
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block p-4 w-full text-white bg-[#224957] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent peer"
          placeholder=" "
          required
          minLength={6}
        />
        <label
          htmlFor="password"
          className="absolute text-white duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] left-4 peer-focus:left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          Password
        </label>
      </div>
    </div>
  );
}
