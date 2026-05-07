// Minimal layout for public auth pages (login, etc.)
// Inherits html/body from the root layout but adds no nav or chrome.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
