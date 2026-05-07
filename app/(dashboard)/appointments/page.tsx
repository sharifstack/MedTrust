import { getAppointments, getDoctors } from '@/lib/actions';
import AppointmentCard from '@/components/AppointmentCard';
import Link from 'next/link';
import { MdEventAvailable, MdHistory } from 'react-icons/md';

export default async function Page() {
  const appointments = await getAppointments();
  const doctors = await getDoctors();

  const fullAppointments = appointments.map((appt: any) => ({
    ...appt,
    doctor: doctors.find((d: any) => d.id === appt.doctorId)
  }));

  const upcoming = fullAppointments.filter((a: any) => a.status === 'Upcoming' || a.status === 'Pending').reverse();
  const history = fullAppointments.filter((a: any) => a.status === 'Completed' || a.status === 'Cancelled').reverse();

  return (
    <main className="pt-[80px] pb-[100px] px-md md:px-lg max-w-container-max mx-auto space-y-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="font-h1 text-h1 text-primary">Your Appointments</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Manage and track your upcoming and past doctor visits.</p>
        </div>
        <Link href="/search" className="px-lg py-sm bg-secondary text-white font-label-sm font-bold rounded-xl shadow-md hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 w-max">
          <MdEventAvailable size={20} /> Book New
        </Link>
      </div>

      <div className="space-y-xl">
        {/* Upcoming Section */}
        {upcoming.length > 0 && (
          <section className="space-y-md">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-sm">
              <MdEventAvailable className="text-secondary" size={24} />
              <h2 className="font-h3 text-h3 text-primary">Upcoming Visits</h2>
              <span className="ml-2 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold">{upcoming.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-md">
              {upcoming.map((appt: any) => (
                <AppointmentCard key={appt.id} appt={appt} allDoctors={doctors} />
              ))}
            </div>
          </section>
        )}

        {/* History Section */}
        <section className="space-y-md">
          <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-sm">
            <MdHistory className="text-on-surface-variant" size={24} />
            <h2 className="font-h3 text-h3 text-on-surface-variant">Past Appointments</h2>
            <span className="ml-2 px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-bold">{history.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-md">
            {history.length > 0 ? (
              history.map((appt: any) => (
                <AppointmentCard key={appt.id} appt={appt} allDoctors={doctors} />
              ))
            ) : (
              <div className="bg-surface-container-lowest rounded-2xl p-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center opacity-60">
                <div className="p-4 bg-surface-container rounded-full mb-md">
                  <MdHistory size={40} className="text-on-surface-variant" />
                </div>
                <p className="font-body-lg font-bold text-on-surface">No past appointments yet.</p>
                <p className="font-caption text-on-surface-variant">Your completed and cancelled visits will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

