import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Popcorn Time 🍿",
  description: "Your favorite movies ever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="bg-[#093545]">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
