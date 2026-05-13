import { getUser, getAppointments, getDoctors, getRecentResults } from '@/lib/actions';
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
  MdOutlineImageSearch,
  MdWarning,
} from 'react-icons/md';

export default async function Page() {
  const user = await getUser();
  const appointments = await getAppointments();
  const doctors = await getDoctors();
  const recentResults = await getRecentResults(3);

  const upcomingAppointments = appointments.map((appt: any) => ({
    ...appt,
    doctor: doctors.find((d: any) => d.id === appt.doctorId)
  }));

  return (
    <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/*  Hero / Welcome Banner  */}
      <section className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50 border border-blue-100/80 shadow-sm">
        <div className="absolute top-0 right-64 w-96 h-96 -translate-y-1/2 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Use explicit CSS grid so columns never collapse */}
        <div
          className="relative z-10"
          style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'stretch' }}
        >
          {/* ── Left column ── */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between gap-6" style={{ minWidth: 0 }}>

            {/* Greeting + description + buttons */}
            <div className="flex flex-col gap-3">
              <DynamicGreeting userName={user.name} />

              <p className="text-sm text-slate-500 leading-relaxed" style={{ maxWidth: '420px' }}>
                Here&apos;s your health summary for today. Manage your appointments, track your health, and stay connected with your care team.
              </p>

              {/* CTA Buttons — always side by side */}
              <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                <Link
                  href="/search"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/25 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                  style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
                >
                  <MdEvent size={18} className="shrink-0" />
                  Book New Appointment
                </Link>
                <MessageDoctorButton />
              </div>
            </div>

            {/* Stat strip */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              {/* Next Visit */}
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ width: 36, height: 36, background: '#EFF6FF', color: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MdEvent size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next Visit</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                    {upcomingAppointments.length > 0 ? upcomingAppointments[0].date : 'No visit'}
                  </p>
                  {upcomingAppointments.length > 0 && (
                    <p style={{ fontSize: '11px', color: '#64748B' }}>{upcomingAppointments[0].time}</p>
                  )}
                </div>
              </div>

              {/* Heart Rate */}
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ width: 36, height: 36, background: '#FFF1F2', color: '#F43F5E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MdFavorite size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Heart Rate</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{user.vitals.heartRate} BPM</p>
                  <p style={{ fontSize: '11px', color: '#64748B' }}>Normal</p>
                </div>
              </div>

              {/* Blood Pressure */}
              <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 36, height: 36, background: '#F0FDFA', color: '#0D9488', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MdBloodtype size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Blood Pressure</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{user.vitals.bloodPressure} <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748B' }}>mmHg</span></p>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optimal</span>
                </div>
              </div>
            </div>
          </div>



        </div>
      </section>

      {/*  Main Dashboard Content  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Left Column: Upcoming Appointments & Vitals */}
        <div className="flex flex-col space-y-8 w-full min-w-0">

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col w-full h-[500px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MdEvent size={24} /></div>
                Appointments
              </h2>
              <Link className="text-blue-600 text-sm font-bold hover:text-blue-700 hover:underline transition-colors" href="/appointments">View Calendar</Link>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {upcomingAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <MdSchedule size={48} className="opacity-20 mb-4" />
                  <p className="text-lg">No upcoming appointments</p>
                </div>
              ) : (
                upcomingAppointments.map((appt: any) => {
                  const [month, day] = appt.date.split(' ');
                  const isPending = appt.status === 'Pending';
                  const isCancelled = appt.status === 'Cancelled';

                  return (
                    <div key={appt.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-200/50 hover:shadow-md hover:bg-white hover:border-blue-200 transition-all duration-300 cursor-pointer group">
                      <div className="h-[68px] w-16 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 w-full text-center py-1 border-b border-slate-200">{month}</span>
                        <span className="text-xl font-extrabold text-blue-900 flex-1 flex items-center justify-center">{parseInt(day, 10)}</span>
                      </div>

                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest truncate mr-2">
                            {appt.type}
                          </p>

                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {appt.doctor?.image && (
                              <img src={appt.doctor.image} alt={appt.doctor.name} className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0" />
                            )}
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">Dr. {appt.doctor?.name}</h3>
                          </div>

                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${isPending ? 'bg-amber-50 text-amber-600 border-amber-200' : isCancelled ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                            {appt.status}
                          </span>

                        </div>

                        <p className="text-xs text-slate-500 flex items-center font-medium">
                          <MdSchedule className="mr-1.5 opacity-70" size={14} /> {appt.time}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shrink-0 ml-3 text-slate-400">
                        <MdChevronRight size={20} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Health Vitals (Mini Bento) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full shrink-0">
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[160px]">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-red-500">
                  <MdFavorite size={24} />
                </div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-white/60 px-2.5 py-1 rounded-lg">Heart Rate</span>
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-display text-4xl font-extrabold text-red-950">{user.vitals.heartRate}</span>
                  <span className="text-sm font-bold text-red-800">BPM</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/60 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-3xl shadow-sm border border-green-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[160px]">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-emerald-600">
                  <MdBloodtype size={24} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-white/60 px-2.5 py-1 rounded-lg">Blood Pressure</span>
              </div>
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-display text-4xl font-extrabold text-emerald-950">{user.vitals.bloodPressure}</span>
                  <span className="text-sm font-bold text-emerald-800">mmHg</span>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 bg-white/60 px-2.5 py-1 rounded-lg w-fit">
                  <MdCheckCircle className="mr-1.5" size={14} />
                  Optimal Range
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Results & Health Tip */}
        <div className="flex flex-col space-y-8 w-full min-w-0">

          {/* Recent Results */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col w-full flex-1">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><MdAnalytics size={24} /></div>
                Recent Results
              </h2>
              <Link className="text-blue-600 text-sm font-bold hover:text-blue-700 hover:underline transition-colors" href="/results">
                All Records
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {recentResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <MdBiotech size={48} className="opacity-20 mb-4" />
                  <p className="text-lg">No results yet</p>
                </div>
              ) : (
                recentResults.map((result: any) => {
                  // ── Category icon ──────────────────────────────────────────
                  const cat = (result.category ?? '').toLowerCase();
                  const IconEl =
                    cat === 'blood' ? MdBloodtype :
                    cat === 'imaging' ? MdOutlineImageSearch :
                    cat === 'lipid' ? MdAnalytics :
                    cat === 'hormones' ? MdFavorite :
                    MdBiotech;

                  const iconColor =
                    cat === 'blood' ? 'text-rose-600 bg-rose-50' :
                    cat === 'imaging' ? 'text-teal-600 bg-teal-50' :
                    cat === 'lipid' ? 'text-purple-600 bg-purple-50' :
                    cat === 'hormones' ? 'text-pink-600 bg-pink-50' :
                    'text-blue-600 bg-blue-50';

                  // ── Status badge ───────────────────────────────────────────
                  const s = (result.status ?? '').toLowerCase();
                  const badgeStyle =
                    s === 'stable' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    s === 'optimal' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    s === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                    s === 'abnormal' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    s === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-300'; // reviewed / default

                  const isCritical = s === 'critical' || s === 'abnormal';

                  return (
                    <Link
                      key={result.id}
                      href={`/results/${result.id}`}
                      className="p-4 flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-200/50 hover:shadow-md hover:bg-white hover:border-blue-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`h-12 w-12 ${iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner shrink-0`}>
                          <IconEl size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {result.testName}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </p>
                          {result.summary && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{result.summary}</p>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border shrink-0 ml-2 ${badgeStyle}`}>
                        {isCritical && <MdWarning size={12} />}
                        {result.status}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Health Tip enclosed inside Results for balance */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white shadow-lg relative overflow-hidden shrink-0">
              <MdFavorite className="absolute right-[-10px] bottom-[-20px] text-white/5" size={120} />
              <div className="relative z-10">
                <p className="text-xs font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Health Tip of the Week
                </p>
                <p className="text-sm opacity-95 leading-relaxed font-medium">Staying hydrated is key to healthy kidney function. Aim for at least 8 glasses of water daily.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
