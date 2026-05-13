import Link from 'next/link';
import { getResults } from '@/lib/actions';
import {
  MdSearch, MdBiotech, MdBloodtype, MdAnalytics,
  MdOutlineImageSearch, MdFavorite, MdWarning, MdFilterList,
  MdSort, MdChevronRight,
} from 'react-icons/md';

function getCategoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c === 'blood')    return MdBloodtype;
  if (c === 'imaging')  return MdOutlineImageSearch;
  if (c === 'lipid')    return MdAnalytics;
  if (c === 'hormones') return MdFavorite;
  return MdBiotech;
}

function getCategoryColor(category: string) {
  const c = category.toLowerCase();
  if (c === 'blood')    return 'text-rose-600 bg-rose-50';
  if (c === 'imaging')  return 'text-teal-600 bg-teal-50';
  if (c === 'lipid')    return 'text-purple-600 bg-purple-50';
  if (c === 'hormones') return 'text-pink-600 bg-pink-50';
  if (c === 'urology')  return 'text-blue-600 bg-blue-50';
  return 'text-slate-600 bg-slate-50';
}

function getStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === 'stable')   return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'optimal')  return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s === 'critical') return 'bg-red-50 text-red-700 border-red-200';
  if (s === 'abnormal') return 'bg-orange-50 text-orange-700 border-orange-200';
  if (s === 'pending')  return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-300';
}

type SearchParamsMap = { [key: string]: string | string[] | undefined };

export default async function ResultsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParamsMap>;
}) {
  const params: SearchParamsMap = await (searchParams ?? Promise.resolve<SearchParamsMap>({}));
  const search   = (Array.isArray(params.search)   ? params.search[0]   : params.search)   ?? '';
  const status   = (Array.isArray(params.status)   ? params.status[0]   : params.status)   ?? '';
  const category = (Array.isArray(params.category) ? params.category[0] : params.category) ?? '';
  const sort     = (Array.isArray(params.sort)     ? params.sort[0]     : params.sort)     ?? 'newest';

  const results = await getResults({ search, status, category, sort });

  const categories = ['Blood', 'Lipid', 'Imaging', 'Hormones', 'Urology'];
  const statuses   = ['Stable', 'Optimal', 'Reviewed', 'Abnormal', 'Critical', 'Pending'];

  return (
    <main className="pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medical Records</h1>
          <p className="text-slate-500 mt-1 text-sm">All your lab results and diagnostic reports in one place.</p>
        </div>
        <div className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{results.length}</span> record{results.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Search + filters */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by test name, doctor, lab…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
          />
        </div>

        <div className="relative">
          <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          <select name="status" defaultValue={status}
            className="pl-9 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none min-w-[140px]">
            <option value="">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="relative">
          <MdBiotech className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          <select name="category" defaultValue={category}
            className="pl-9 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none min-w-[150px]">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="relative">
          <MdSort className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          <select name="sort" defaultValue={sort}
            className="pl-9 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none min-w-[140px]">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="critical">Critical First</option>
          </select>
        </div>

        <button type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95">
          Search
        </button>
      </form>

      {/* Active chips */}
      {(search || status || category) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1">
              🔍 &quot;{search}&quot;
              <Link href={`/results?status=${status}&category=${category}&sort=${sort}`} className="ml-1 opacity-60 hover:opacity-100">×</Link>
            </span>
          )}
          {status && (
            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold flex items-center gap-1">
              Status: {status}
              <Link href={`/results?search=${search}&category=${category}&sort=${sort}`} className="ml-1 opacity-60 hover:opacity-100">×</Link>
            </span>
          )}
          {category && (
            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold flex items-center gap-1">
              Category: {category}
              <Link href={`/results?search=${search}&status=${status}&sort=${sort}`} className="ml-1 opacity-60 hover:opacity-100">×</Link>
            </span>
          )}
          <Link href="/results" className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-bold">
            Clear all
          </Link>
        </div>
      )}

      {/* Grid */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <MdBiotech size={64} className="opacity-20 mb-4" />
          <p className="text-xl font-bold text-slate-500 mb-1">No results found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result: any) => {
            const IconEl = getCategoryIcon(result.category ?? '');
            const colorCls = getCategoryColor(result.category ?? '');
            const badgeCls = getStatusStyle(result.status ?? '');
            const isCritical = ['critical', 'abnormal'].includes((result.status ?? '').toLowerCase());
            const abnormalCount = (result.values ?? []).filter((v: any) => v.isAbnormal).length;

            return (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                className="group bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="px-5 pt-5 pb-4 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${colorCls} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconEl size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors truncate">{result.testName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{result.category}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border shrink-0 ${badgeCls}`}>
                    {isCritical && <MdWarning size={11} />}
                    {result.status}
                  </div>
                </div>

                <div className="border-t border-slate-100 mx-5" />

                <div className="px-5 py-3 flex-1">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{result.summary}</p>
                </div>

                <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-400">{result.doctorName}</p>
                    <p className="text-[11px] font-bold text-slate-600">
                      {new Date(result.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {abnormalCount > 0 && (
                      <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold">
                        {abnormalCount} abnormal
                      </span>
                    )}
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <MdChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
