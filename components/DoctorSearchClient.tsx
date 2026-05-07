'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdTune, MdRefresh, MdFavorite, MdMedicalServices, MdPsychology, MdChildCare, MdStraighten, MdStar, MdLocationOn, MdHistory, MdClose, MdSort, MdVerified, MdCheckCircle } from 'react-icons/md';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  title: string;
  rating: number;
  reviews: number;
  distance: number;
  experienceYears: number;
  nextAvailable: string;
  bio: string;
  image: string;
}

const specialtyIcons: Record<string, React.ReactNode> = {
  'Cardiology': <MdFavorite size={16} className="text-red-400" />,
  'Dermatology': <MdMedicalServices size={16} className="text-amber-400" />,
  'Neurology': <MdPsychology size={16} className="text-purple-400" />,
  'Pediatrics': <MdChildCare size={16} className="text-blue-400" />,
};

const sortOptions = [
  { id: 'recommended', label: 'Recommended', icon: <MdStar /> },
  { id: 'rating', label: 'Highest Rated', icon: <MdStar /> },
  { id: 'distance', label: 'Nearest', icon: <MdLocationOn /> },
  { id: 'experience', label: 'Most Experienced', icon: <MdHistory /> },
  { id: 'available', label: 'Earliest Available', icon: <MdCheckCircle /> },
];

export default function DoctorSearchClient({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [query, setQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(15);
  const [sortBy, setSortBy] = useState('recommended');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const specialtiesList = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'];

  const filteredDoctors = useMemo(() => {
    let result = [...initialDoctors];

    // Search Filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialty.toLowerCase().includes(q) || 
        d.bio.toLowerCase().includes(q)
      );
    }

    // Specialty Filter
    if (selectedSpecialties.length > 0) {
      result = result.filter(d => selectedSpecialties.includes(d.specialty));
    }

    // Distance Filter
    result = result.filter(d => d.distance <= maxDistance);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'available') {
        // Simple logic for available: Today > Tomorrow > Wednesday > ...
        const dayMap: Record<string, number> = { 'Today': 0, 'Tomorrow': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4 };
        const getDayScore = (str: string) => {
          const firstWord = str.split(',')[0];
          return dayMap[firstWord] ?? 10;
        };
        return getDayScore(a.nextAvailable) - getDayScore(b.nextAvailable);
      }
      return 0; // recommended stays as is
    });

    return result;
  }, [initialDoctors, query, selectedSpecialties, maxDistance, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedSpecialties([]);
    setMaxDistance(15);
    setSortBy('recommended');
  };

  const removeSpecialty = (s: string) => {
    setSelectedSpecialties(selectedSpecialties.filter(item => item !== s));
  };

  return (
    <div className="flex flex-col md:flex-row gap-lg">
      {/* Sidebar Filters */}
      <aside className={`w-full md:w-80 shrink-0`}>
        <div className="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant/30 sticky top-[100px] shadow-sm">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-h3 text-h3 font-bold text-primary flex items-center gap-2">
              <MdTune className="text-secondary" /> Filters
            </h2>
            <button 
              onClick={resetFilters}
              className="text-secondary font-label-sm font-bold flex items-center gap-1 hover:bg-secondary/10 px-2 py-1 rounded-lg transition-colors"
            >
              <MdRefresh size={16} /> Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-xl">
            <label className="block text-[10px] font-bold text-outline uppercase tracking-[1.5px] mb-md">Search Name / Keyword</label>
            <div className="relative group">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Doctor's name or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/50 rounded-xl pl-11 pr-4 py-3 font-body-md focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"
              />
            </div>
          </div>

          {/* Specialty Multi-select */}
          <div className="mb-xl">
            <label className="block text-[10px] font-bold text-outline uppercase tracking-[1.5px] mb-md">Specialty</label>
            <div className="space-y-sm">
              {specialtiesList.map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer group p-1 rounded-lg hover:bg-surface-container transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      checked={selectedSpecialties.includes(s)}
                      onChange={() => {
                        if (selectedSpecialties.includes(s)) removeSpecialty(s);
                        else setSelectedSpecialties([...selectedSpecialties, s]);
                      }}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-outline-variant checked:border-secondary checked:bg-secondary transition-all"
                    />
                    <MdCheckCircle className="absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="flex items-center gap-2 font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                    {specialtyIcons[s]}
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-md">
              <label className="text-[10px] font-bold text-outline uppercase tracking-[1.5px] flex items-center gap-1.5">
                <MdStraighten className="text-secondary" /> Distance
              </label>
              <span className="text-caption font-bold text-secondary">Under {maxDistance} miles</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="15" 
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-outline uppercase">
              <span>1mi</span>
              <span>15mi</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Results Section */}
      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg mb-lg">
          <div>
            <h1 className="font-h2 text-h2 text-primary flex items-baseline gap-2">
              Found {filteredDoctors.length} Doctors
              <span className="text-body-md font-medium text-on-surface-variant">in Manhattan, NY</span>
            </h1>
            
            {/* Active Chips */}
            <div className="flex flex-wrap gap-2 mt-md">
              {query && (
                <span className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-caption font-bold">
                  "{query}" <MdClose className="cursor-pointer" onClick={() => setQuery('')} />
                </span>
              )}
              {selectedSpecialties.map(s => (
                <span key={s} className="flex items-center gap-1 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-caption font-bold">
                  {s} <MdClose className="cursor-pointer" onClick={() => removeSpecialty(s)} />
                </span>
              ))}
              {maxDistance < 15 && (
                <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-caption font-bold">
                  &lt; {maxDistance} miles <MdClose className="cursor-pointer" onClick={() => setMaxDistance(15)} />
                </span>
              )}
            </div>
          </div>

          <div className="relative group min-w-[200px]">
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-md py-3 rounded-xl cursor-pointer hover:bg-surface-container-low transition-all">
              <MdSort className="text-secondary" size={20} />
              <span className="font-label-sm font-bold text-on-surface-variant">Sort by: {sortOptions.find(o => o.id === sortBy)?.label}</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {sortOptions.map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`w-full flex items-center gap-3 px-md py-3 font-label-sm hover:bg-surface-container transition-colors ${sortBy === opt.id ? 'text-secondary bg-secondary/5' : 'text-on-surface-variant'}`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor List with Animations */}
        <div className="grid grid-cols-1 gap-lg">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <motion.div 
                  key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant/30 shadow-sm flex flex-col lg:flex-row gap-lg group hover:border-secondary/30 transition-all"
                >
                  <div className="w-full lg:w-56 h-56 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/10 shadow-inner">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Portrait of Dr. ${doctor.name}`} src={doctor.image}/>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between gap-lg mb-lg">
                      <div className="space-y-sm">
                        <div className="flex items-center gap-2">
                          <h3 className="font-h3 text-h3 text-primary">Dr. {doctor.name}</h3>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                            <MdVerified size={12} /> verified
                          </span>
                        </div>
                        <p className="text-secondary font-label-sm font-bold uppercase tracking-tight">{doctor.specialty} • {doctor.title}</p>
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-600 rounded-full">
                            <MdStar size={18} />
                            <span className="font-label-sm font-bold">{doctor.rating.toFixed(1)} <span className="text-[10px] opacity-70">({doctor.reviews.toLocaleString()} reviews)</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-on-surface-variant font-caption font-medium">
                            <MdLocationOn size={18} className="text-secondary" />
                            <span>{doctor.distance} miles away</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-on-surface-variant font-caption font-medium">
                            <MdHistory size={18} className="text-secondary" />
                            <span>{doctor.experienceYears} yrs exp.</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center min-w-[160px] shadow-sm">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Next Available</span>
                        <span className="font-label-sm font-bold text-primary bg-white px-3 py-1 rounded-lg border border-outline-variant/30">{doctor.nextAvailable}</span>
                      </div>
                    </div>

                    <p className="text-on-surface-variant font-body-md leading-relaxed line-clamp-2 mb-xl">
                      {doctor.bio}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-md items-center justify-between pt-lg border-t border-outline-variant/20">
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-surface-container rounded-xl text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">In-Person</span>
                        <span className="px-3 py-1.5 bg-surface-container rounded-xl text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Video Visit</span>
                        <span className="px-3 py-1.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-xl uppercase tracking-tighter">Accepting Insurance</span>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/doctor/${doctor.id}`} className="px-lg py-sm border border-outline-variant text-primary font-label-sm font-bold rounded-xl hover:bg-surface-container transition-all">View Profile</Link>
                        <button className="px-lg py-sm bg-secondary text-white font-label-sm font-bold rounded-xl shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all">Book Appointment</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-lowest rounded-2xl p-xxl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-md text-outline">
                  <MdSearch size={40} />
                </div>
                <h3 className="font-h3 text-h3 text-primary mb-sm">No doctors found</h3>
                <p className="text-on-surface-variant font-body-md max-w-xs mb-lg">
                  We couldn't find any doctors matching your current filters. Try adjusting your search or resetting all filters.
                </p>
                <button 
                  onClick={resetFilters}
                  className="px-xl py-3 bg-secondary text-white font-label-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
