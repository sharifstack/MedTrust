'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdClose, MdPerson, MdEvent, MdSettings, MdHome, MdLocalHospital, MdTrendingUp, MdHistory } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  url: string;
  icon: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  person: <MdPerson size={24} />,
  calendar: <MdEvent size={24} />,
  settings: <MdSettings size={24} />,
  search: <MdSearch size={24} />,
  medical: <MdLocalHospital size={24} />,
  home: <MdHome size={24} />,
};

export default function GlobalSearch({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle keyboard shortcut (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-surface dark:bg-surface-container rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col max-h-[80vh]"
          >
            {/* Input Header */}
            <div className="flex items-center p-4 border-b border-outline-variant/30 bg-surface">
              <MdSearch size={28} className="text-primary ml-2 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors, appointments, settings..."
                className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-on-surface-variant/50 text-on-surface"
              />
              {isSearching && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
              )}
              <button
                onClick={onClose}
                className="p-2 bg-surface-container-high hover:bg-error/10 hover:text-error text-on-surface-variant rounded-full transition-colors ml-2"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-surface">
              {!query.trim() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-3">
                      <MdHistory size={16} /> Recent
                    </h4>
                    <div className="space-y-1">
                      <button onClick={() => setQuery("Cardiologist")} className="w-full text-left p-2 rounded-lg hover:bg-surface-container text-sm transition-colors text-on-surface">Cardiologist near me</button>
                      <button onClick={() => setQuery("Dr. Sarah")} className="w-full text-left p-2 rounded-lg hover:bg-surface-container text-sm transition-colors text-on-surface">Dr. Sarah Jenkins</button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 mb-3">
                      <MdTrendingUp size={16} /> Trending
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Flu symptoms', 'Book appointment', 'Dermatology', 'Edit Profile'].map(t => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 pl-2">AI Suggestions</h4>
                  {results.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(result.url)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container transition-all group text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                        {iconMap[result.icon] || <MdSearch size={24} />}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-base group-hover:text-primary transition-colors text-on-surface">{result.title}</h5>
                        <p className="text-xs text-on-surface-variant">{result.subtitle}</p>
                      </div>
                      <div className="text-[10px] font-medium px-2 py-1 bg-surface-container-high rounded-md text-on-surface-variant uppercase tracking-wider">
                        {result.type}
                      </div>
                    </button>
                  ))}
                </div>
              ) : !isSearching ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <MdSearch size={40} className="text-on-surface-variant/50" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-on-surface">No exact matches found</h4>
                  <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
                    Try searching for specialties (e.g. "Cardiology"), doctor names, or platform features like "Profile".
                  </p>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="bg-surface-container-low p-3 border-t border-outline-variant/30 flex justify-between items-center text-xs text-on-surface-variant">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface rounded border border-outline-variant shadow-sm font-mono font-bold text-[10px]">esc</kbd> to close</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface rounded border border-outline-variant shadow-sm font-mono font-bold text-[10px]">↵</kbd> to select</span>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
