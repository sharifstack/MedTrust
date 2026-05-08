'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCheck, MdDoneAll, MdSettings, MdClose } from 'react-icons/md';
import { useNotifications } from './NotificationProvider';
import Link from 'next/link';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  if (seconds < 30) return "Just now";
  return Math.floor(seconds) + " seconds ago";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: Props) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter(n => 
    activeTab === 'All' ? true : !n.read
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-[110%] mt-2 w-80 md:w-96 bg-surface dark:bg-surface-container rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-50 flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/50 backdrop-blur-md">
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-xs text-on-surface-variant">You have {unreadCount} unread messages</p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                  title="Mark all as read"
                >
                  <MdDoneAll size={20} />
                </button>
              )}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-on-surface-variant hover:bg-on-surface/10 rounded-full transition-colors"
              >
                <MdSettings size={20} />
              </button>
            </div>
          </div>

          {/* Settings View */}
          <AnimatePresence mode="wait">
            {showSettings ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 flex-1 overflow-y-auto bg-surface"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-sm text-on-surface-variant uppercase tracking-wider">Preferences</h4>
                  <button onClick={() => setShowSettings(false)} className="text-xs text-primary hover:underline font-medium">Back</button>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email Alerts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SMS Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col flex-1 overflow-hidden bg-surface"
              >
                {/* Tabs */}
                <div className="flex px-4 pt-2 gap-4 border-b border-outline-variant/20 bg-surface">
                  {['All', 'Unread'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`pb-2 text-sm font-medium transition-colors relative ${
                        activeTab === tab ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div 
                          layoutId="activeTab" 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 text-center text-on-surface-variant flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-3">
                        <MdDoneAll size={28} className="opacity-50" />
                      </div>
                      <p>You're all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 rounded-xl transition-all ${
                          notification.read ? 'opacity-70 hover:opacity-100 hover:bg-surface-container/50' : 'bg-primary/5 hover:bg-primary/10'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{notification.category}</span>
                              <span className="text-[10px] text-on-surface-variant">
                                {timeAgo(notification.date)}
                              </span>
                            </div>
                            <h4 className={`text-sm ${notification.read ? 'font-medium' : 'font-bold'}`}>{notification.title}</h4>
                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{notification.message}</p>
                            
                            {notification.link && (
                              <Link 
                                href={notification.link}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                className="inline-block mt-2 text-xs text-primary font-medium hover:underline"
                              >
                                View Details
                              </Link>
                            )}
                          </div>
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container text-primary transition-colors flex-shrink-0 border border-outline-variant/30"
                              title="Mark as read"
                            >
                              <MdCheck size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
