import { getUser, getAppointments, getDoctors } from '@/lib/actions';
import Link from 'next/link';
import MessageDoctorButton from '@/components/MessageDoctorButton';
import DynamicGreeting from '@/components/DynamicGreeting';
import { 
  MdEvent, 
  MdSchedule, 
  MdChevronRight, 
  MdFavorite, 
  MdBloodtype, 
  MdCheckCircle,
  MdBiotech,
  MdAnalytics,
  MdOutlineImageSearch
} from 'react-icons/md';

export default async function Page() {
  const user = await getUser();
  const appointments = await getAppointments();
  const doctors = await getDoctors();

  const upcomingAppointments = appointments.map((appt: any) => ({
    ...appt,
    doctor: doctors.find((d: any) => d.id === appt.doctorId)
  }));

  return (
<main className="pt-24 pb-20 px-md md:px-lg max-w-container-max mx-auto">
{/*  Welcoming Header  */}
<section className="mb-xl">
<DynamicGreeting userName={user.name} />
<p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Here is your health summary for today.</p>
</section>
{/*  Quick Actions Grid  */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
<Link href="/search" className="flex items-center justify-center space-x-md bg-secondary text-on-secondary px-lg py-xl rounded-xl shadow-[0px_4px_20px_rgba(30,41,59,0.05)] hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-95 group">
  <MdEvent size={28} />
  <span className="font-h3 text-h3">Book New Appointment</span>
</Link>
<MessageDoctorButton />
</section>
{/*  Main Dashboard Content (Bento Style)  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
{/*  Upcoming Appointments (7 columns)  */}
<div className="lg:col-span-7 flex flex-col space-y-lg">
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border-t-4 border-secondary">
<div className="flex items-center justify-between mb-lg">
<h2 className="font-h3 text-h3 text-primary">Upcoming Appointments</h2>
<Link className="text-secondary font-label-sm text-label-sm font-semibold" href="/appointments">View Calendar</Link>
</div>
<div className="space-y-md">
{upcomingAppointments.map((appt: any, idx: number) => {
  const [month, day] = appt.date.split(' ');
  const isPrimary = idx % 2 === 0;
  return (
    <div key={appt.id} className={`flex items-center p-md ${isPrimary ? 'bg-surface-container' : 'bg-surface-container-lowest'} rounded-lg border border-outline-variant hover:border-secondary transition-colors cursor-pointer group`}>
      <div className={`h-16 w-16 ${isPrimary ? 'bg-primary-fixed text-primary' : 'bg-secondary-fixed text-secondary'} rounded-xl flex flex-col items-center justify-center shrink-0`}>
        <span className="text-caption font-bold">{month}</span>
        <span className="text-h3 font-bold leading-none">{parseInt(day, 10)}</span>
      </div>
      <div className="ml-md flex-1">
        <p className="font-label-sm text-label-sm text-secondary font-bold uppercase">{appt.type}</p>
        <h3 className="font-body-lg text-body-lg font-semibold text-primary">Dr. {appt.doctor?.name}</h3>
        <p className="font-caption text-caption text-on-surface-variant flex items-center">
          <MdSchedule className="mr-xs text-secondary" /> {appt.time}
        </p>
      </div>
      <MdChevronRight className="text-outline group-hover:text-secondary transition-colors" size={24} />
    </div>
  );
})}
</div>
</div>
{/*  Recent Health Vitals (Mini Bento)  */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
<div className="bg-surface-container-lowest p-lg rounded-xl shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border-t-4 border-tertiary-fixed">
<div className="flex items-center justify-between mb-sm">
<MdFavorite className="text-error" size={24} />
<span className="text-caption font-bold text-on-surface-variant">Heart Rate</span>
</div>
<div className="flex items-baseline space-x-xs">
<span className="font-h1 text-h1">{user.vitals.heartRate}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">BPM</span>
</div>
<div className="mt-md h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-tertiary-fixed-dim w-[65%]"></div>
</div>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border-t-4 border-on-secondary-container">
<div className="flex items-center justify-between mb-sm">
<MdBloodtype className="text-secondary" size={24} />
<span className="text-caption font-bold text-on-surface-variant">Blood Pressure</span>
</div>
<div className="flex items-baseline space-x-xs">
<span className="font-h1 text-h1">{user.vitals.bloodPressure}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">mmHg</span>
</div>
<div className="mt-md flex items-center text-caption font-medium text-success">
<MdCheckCircle className="mr-xs" size={16} />
                            Within Optimal Range
                        </div>
</div>
</div>
</div>
{/*  Recent Test Results (5 columns)  */}
<div className="lg:col-span-5 flex flex-col">
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] h-full border-t-4 border-[#14B8A6]">
<div className="flex items-center justify-between mb-lg">
<h2 className="font-h3 text-h3 text-primary">Recent Results</h2>
<a className="text-secondary font-label-sm text-label-sm font-semibold" href="#">All Records</a>
</div>
<ul className="divide-y divide-outline-variant">
{/*  Result 1  */}
<li className="py-md flex items-center justify-between hover:bg-surface-container-low transition-colors px-md -mx-md rounded-lg cursor-pointer group">
<div className="flex items-center">
<div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mr-md group-hover:scale-110 transition-transform">
<MdBiotech size={20} />
</div>
<div>
<p className="font-label-sm font-bold text-primary">Full Blood Count</p>
<p className="font-caption text-on-surface-variant">Oct 05, 2023</p>
</div>
</div>
<div className="px-sm py-xs bg-[#DCFCE7] text-[#166534] font-label-sm font-bold rounded-lg">Stable</div>
</li>
{/*  Result 2  */}
<li className="py-md flex items-center justify-between hover:bg-surface-container-low transition-colors px-md -mx-md rounded-lg cursor-pointer group">
<div className="flex items-center">
<div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mr-md group-hover:scale-110 transition-transform">
<MdAnalytics size={20} />
</div>
<div>
<p className="font-label-sm font-bold text-primary">Cholesterol Panel</p>
<p className="font-caption text-on-surface-variant">Sep 28, 2023</p>
</div>
</div>
<div className="px-sm py-xs bg-[#DCFCE7] text-[#166534] font-label-sm font-bold rounded-lg">Optimal</div>
</li>
{/*  Result 3  */}
<li className="py-md flex items-center justify-between hover:bg-surface-container-low transition-colors px-md -mx-md rounded-lg cursor-pointer group">
<div className="flex items-center">
<div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mr-md group-hover:scale-110 transition-transform">
<MdOutlineImageSearch size={20} />
</div>
<div>
<p className="font-label-sm font-bold text-primary">Chest X-Ray</p>
<p className="font-caption text-on-surface-variant">Sep 15, 2023</p>
</div>
</div>
<div className="px-sm py-xs bg-surface-container text-on-surface-variant font-label-sm font-bold rounded-lg">Reviewed</div>
</li>
</ul>
<div className="mt-lg p-lg bg-primary rounded-xl text-on-primary">
<p className="font-body-md text-body-md font-semibold mb-sm">Health Tip of the Week</p>
<p className="font-caption text-caption opacity-80">Staying hydrated is key to healthy kidney function. Aim for at least 8 glasses of water daily.</p>
</div>
</div>
</div>
</div>
</main>
  );
}
