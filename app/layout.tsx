import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedTrust - Medical Appointment Scheduler",
  description: "Medical Appointment Scheduler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
