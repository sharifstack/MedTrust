// This layout overrides the root layout for the login page,
// hiding the navigation header and bottom nav since the user is not authenticated.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
