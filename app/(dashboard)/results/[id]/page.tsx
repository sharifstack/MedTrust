import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResult } from '@/lib/actions';
import {
  MdBloodtype, MdAnalytics, MdOutlineImageSearch, MdFavorite, MdBiotech,
  MdWarning, MdCheckCircle, MdSchedule, MdLocalHospital, MdPerson,
  MdChevronLeft, MdDownload, MdPrint, MdEvent, MdNotes,
} from 'react-icons/md';

function statusConfig(status: string) {
  const s = status.toLowerCase();
  if (s === 'stable')   return { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <MdCheckCircle size={14}/> };
  if (s === 'optimal')  return { cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: <MdCheckCircle size={14}/> };
  if (s === 'critical') return { cls: 'bg-red-50 text-red-700 border-red-200', icon: <MdWarning size={14}/> };
  if (s === 'abnormal') return { cls: 'bg-orange-50 text-orange-700 border-orange-200', icon: <MdWarning size={14}/> };
  if (s === 'pending')  return { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <MdSchedule size={14}/> };
  return { cls: 'bg-slate-100 text-slate-600 border-slate-300', icon: null };
}

function categoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c === 'blood')    return <MdBloodtype size={28} />;
  if (c === 'imaging')  return <MdOutlineImageSearch size={28} />;
  if (c === 'lipid')    return <MdAnalytics size={28} />;
  if (c === 'hormones') return <MdFavorite size={28} />;
  return <MdBiotech size={28} />;
}

export default async function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const { cls: badgeCls, icon: badgeIcon } = statusConfig(result.status ?? '');
  const abnormal = (result.values ?? []).filter((v: any) => v.isAbnormal);

  return (
    <main className="pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto w-full">

      {/* Back */}
      <Link href="/results" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-bold mb-6 group">
        <MdChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        All Records
      </Link>

      {/* Header card */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 md:p-8 text-white mb-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 50%, #3b82f6 0%, transparent 60%)'}}/>
        <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white">
            {categoryIcon(result.category ?? '')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">{result.category}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{result.testName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><MdPerson size={15}/> {result.doctorName}</span>
              <span className="opacity-40">·</span>
              <span className="flex items-center gap-1.5"><MdLocalHospital size={15}/> {result.labName}</span>
              <span className="opacity-40">·</span>
              <span className="flex items-center gap-1.5"><MdSchedule size={15}/>
                {new Date(result.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-bold shrink-0 ${badgeCls}`}>
            {badgeIcon}{result.status}
          </div>
        </div>

        {/* Summary */}
        {result.summary && (
          <p className="relative z-10 mt-5 text-sm text-blue-100 leading-relaxed border-t border-white/10 pt-4">
            {result.summary}
          </p>
        )}

        {/* Critical warning */}
        {abnormal.length > 0 && (
          <div className="relative z-10 mt-4 flex items-start gap-2 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
            <MdWarning size={18} className="text-red-300 shrink-0 mt-0.5"/>
            <p className="text-red-200 text-sm"><strong>{abnormal.length} abnormal value{abnormal.length>1?'s':''}</strong> detected. Review results carefully.</p>
          </div>
        )}
      </div>

      {/* Measured Values */}
      {(result.values ?? []).length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><MdAnalytics size={20} className="text-blue-600"/> Measured Values</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-bold text-slate-500 text-xs uppercase tracking-widest">Test</th>
                  <th className="text-left px-6 py-3 font-bold text-slate-500 text-xs uppercase tracking-widest">Result</th>
                  <th className="text-left px-6 py-3 font-bold text-slate-500 text-xs uppercase tracking-widest">Unit</th>
                  <th className="text-left px-6 py-3 font-bold text-slate-500 text-xs uppercase tracking-widest">Normal Range</th>
                  <th className="text-left px-6 py-3 font-bold text-slate-500 text-xs uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.values.map((v: any, i: number) => (
                  <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${v.isAbnormal ? 'bg-red-50/40' : ''}`}>
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{v.name}</td>
                    <td className={`px-6 py-3.5 font-black text-base ${v.isAbnormal ? 'text-red-600' : 'text-slate-900'}`}>{v.value}</td>
                    <td className="px-6 py-3.5 text-slate-500">{v.unit || '—'}</td>
                    <td className="px-6 py-3.5 text-slate-500">{v.normalRange || '—'}</td>
                    <td className="px-6 py-3.5">
                      {v.isAbnormal
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold"><MdWarning size={11}/>Abnormal</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold"><MdCheckCircle size={11}/>Normal</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor Notes */}
      {result.notes && (
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2"><MdNotes size={20} className="text-indigo-600"/> Doctor&apos;s Notes</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-slate-700 leading-relaxed text-sm">{result.notes}</p>
            {result.recommendations && (
              <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Recommendations</p>
                <p className="text-slate-700 text-sm leading-relaxed">{result.recommendations}</p>
              </div>
            )}
            {result.followUp && (
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                <MdEvent size={16}/> Follow-up appointment recommended
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a href={result.reportUrl ?? '#'} className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95">
          <MdDownload size={18}/> Download Report
        </a>
        <button onClick={undefined} className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95">
          <MdPrint size={18}/> Print
        </button>
        {result.followUp && (
          <Link href="/search" className="flex items-center gap-2 px-5 py-3 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95">
            <MdEvent size={18}/> Book Follow-Up
          </Link>
        )}
      </div>
    </main>
  );
}
