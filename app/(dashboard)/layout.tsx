import Navbar from "@/components/Navbar";
import { UserProvider } from "@/components/UserProvider";
import { NotificationProvider } from "@/components/NotificationProvider";
import { getUser, getNotifications } from "@/lib/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const notifications = await getNotifications();

  return (
    <UserProvider initialUser={user}>
      <NotificationProvider initialNotifications={notifications}>
        <Navbar />
        <div className="pt-2">
          {children}
        </div>
      </NotificationProvider>
    </UserProvider>
  );
}
