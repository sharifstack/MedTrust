import { getUser, getVitalsHistory } from '@/lib/actions';
import EditProfileModal from '@/components/EditProfileModal';
import VitalsDashboard from '@/components/VitalsDashboard';
import ProfileCard from '@/components/ProfileCard';

export default async function Page() {
  const user = await getUser();
  const history = await getVitalsHistory();

  return (
    <main className="pt-[80px] pb-[100px] px-md md:px-lg max-w-container-max mx-auto">
      <div className="flex items-center justify-between mb-xl">
        <h1 className="font-h1 text-h1 text-primary">Patient Profile</h1>
        <EditProfileModal user={user} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Personal Details */}
        <div className="md:col-span-1 flex flex-col gap-lg">
          <ProfileCard />
          
          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-primary mb-md">Insurance</h3>
            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <div>
                  <p className="font-bold text-on-surface">{user.insurance}</p>
                  <p className="font-caption text-on-surface-variant">Member ID: {user.memberId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vitals and Settings */}
        <div className="md:col-span-2 flex flex-col gap-lg">
          <VitalsDashboard user={user} history={history} />

          <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-primary mb-md">Settings</h3>
            <ul className="divide-y divide-outline-variant/30">
              <li className="py-md flex items-center justify-between cursor-pointer group hover:bg-surface-container-low px-sm -mx-sm rounded-lg transition-colors">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-secondary">notifications</span>
                  <span className="font-body-md text-on-surface font-medium">Notification Preferences</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary">chevron_right</span>
              </li>
              <li className="py-md flex items-center justify-between cursor-pointer group hover:bg-surface-container-low px-sm -mx-sm rounded-lg transition-colors">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-secondary">lock</span>
                  <span className="font-body-md text-on-surface font-medium">Privacy & Security</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary">chevron_right</span>
              </li>
              <li className="py-md flex items-center justify-between cursor-pointer group hover:bg-surface-container-low px-sm -mx-sm rounded-lg transition-colors">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-secondary">payment</span>
                  <span className="font-body-md text-on-surface font-medium">Payment Methods</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary">chevron_right</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
