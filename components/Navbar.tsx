'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdDashboard, 
  MdEvent, 
  MdSearch, 
  MdPerson, 
  MdNotifications, 
  MdLogout, 
  MdMenu, 
  MdClose,
  MdSettings,
  MdOutlineSearch
} from 'react-icons/md';
import LogoutButton from './LogoutButton';
import { logout } from '@/lib/actions';
import { useUser } from '@/components/UserProvider';
import { useNotifications } from '@/components/NotificationProvider';
import NotificationDropdown from '@/components/NotificationDropdown';
import GlobalSearch from '@/components/GlobalSearch';
import { toast } from 'react-toastify';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: <MdDashboard size={20} /> },
  { href: '/appointments', label: 'Appointments', icon: <MdEvent size={20} /> },
  { href: '/search', label: 'Doctors', icon: <MdSearch size={20} /> },
  { href: '/profile', label: 'Profile', icon: <MdPerson size={20} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { unreadCount } = useNotifications();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-2.5 bg-white/85 backdrop-blur-lg shadow-sm border-b border-outline-variant/30' 
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-container-max mx-auto px-md md:px-lg flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14h-2v-4H7v-2h4V6h2v4h4v2h-4z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              MedTrust
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-label-sm font-bold transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'text-secondary' 
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <MdOutlineSearch size={24} />
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant relative"
              >
                <MdNotifications size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <NotificationDropdown 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            </div>

            <div className="relative h-10 w-[1px] bg-outline-variant/30 mx-1" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full hover:bg-surface-container transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant shadow-sm">
                  <img 
                    src={user.avatar} 
                    alt={user.fullName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[12px] font-bold text-primary leading-tight">{user.fullName}</p>
                  <p className="text-[10px] text-on-surface-variant leading-tight">Patient Account</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Fixed click-outside backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 overflow-hidden"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      {/* User info header */}
                      <div className="px-3 py-3 mb-1" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <p className="text-sm font-bold" style={{ color: '#091426' }}>{user.fullName}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium hover:bg-slate-100"
                        style={{ color: '#1b1b1d' }}
                      >
                        <MdPerson size={20} style={{ color: '#0058be' }} />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/appointments"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium hover:bg-slate-100"
                        style={{ color: '#1b1b1d' }}
                      >
                        <MdEvent size={20} style={{ color: '#0058be' }} />
                        <span>My Appointments</span>
                      </Link>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium hover:bg-slate-100"
                        style={{ color: '#1b1b1d' }}
                      >
                        <MdSettings size={20} style={{ color: '#0058be' }} />
                        <span>Settings</span>
                      </button>

                      <div className="my-1" style={{ height: '1px', backgroundColor: '#e5e7eb' }} />

                      {/* Sign out */}
                      <button
                        onClick={() => { setIsProfileOpen(false); toast.info('Logged out successfully'); logout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium hover:bg-red-50"
                        style={{ color: '#6b7280' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
                      >
                        <MdLogout size={20} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-on-surface-variant relative"
              >
                <MdNotifications size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <NotificationDropdown 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
              />
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-surface-container rounded-lg text-primary"
            >
              <MdMenu size={24} />
            </button>
          </div>
        </div>
      </header>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white dark:bg-slate-950 z-[70] shadow-2xl p-lg flex flex-col"
            >
              <div className="flex items-center justify-between mb-xl">
                <span className="text-xl font-bold text-primary">MedTrust</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-surface-container rounded-xl text-on-surface-variant"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="flex items-center gap-3 p-md bg-surface-container rounded-2xl mb-xl">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-primary">{user.fullName}</p>
                  <p className="text-[11px] text-on-surface-variant">{user.email}</p>
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                        isActive 
                          ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-4">
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
                  <MdSettings size={20} /> Settings
                </button>
                <div className="h-[1px] bg-outline-variant/30" />
                <LogoutButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
