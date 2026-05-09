'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const dbPath = path.join(process.cwd(), 'lib', 'db.json');

function getDb() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function saveDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function getUser() {
  return getDb().user;
}

export async function updateUser(userData: any) {
  const db = getDb();
  db.user = { ...db.user, ...userData };
  saveDb(db);
  revalidatePath('/');
  revalidatePath('/profile');
}

export async function getDoctors() {
  return getDb().doctors;
}

export async function getDoctor(id: string) {
  return getDb().doctors.find((d: any) => d.id === id);
}

export async function getRelatedDoctors(specialty: string, currentDoctorId: string) {
  const db = getDb();
  return db.doctors
    .filter((d: any) => d.specialty === specialty && d.id !== currentDoctorId)
    .slice(0, 3);
}

export async function updateDoctor(id: string, doctorData: any) {
  const db = getDb();
  const index = db.doctors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    db.doctors[index] = { ...db.doctors[index], ...doctorData };
    saveDb(db);
    revalidatePath('/');
    revalidatePath(`/doctor/${id}`);
    revalidatePath('/search');
  }
}

export async function getAppointments() {
  return getDb().appointments;
}

export async function rescheduleAppointment(id: string, date: string, time: string) {
  const db = getDb();
  const index = db.appointments.findIndex((a: any) => a.id === id);
  if (index !== -1) {
    db.appointments[index].date = date;
    db.appointments[index].time = time;
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/appointments');
  }
}

export async function bookAppointment(doctorId: string, date: string, time: string, type: string = 'General Consultation', location?: string, notes?: string) {
  const db = getDb();
  const newAppointment = {
    id: `a${Date.now()}`,
    doctorId,
    date,
    time,
    status: 'Pending',
    type,
    location,
    notes
  };
  db.appointments.push(newAppointment);
  saveDb(db);
  revalidatePath('/');
  revalidatePath('/appointments');
  revalidatePath(`/doctor/${doctorId}`);
}

export async function cancelAppointment(id: string) {
  const db = getDb();
  const index = db.appointments.findIndex((a: any) => a.id === id);
  if (index !== -1) {
    db.appointments[index].status = 'Cancelled';
    saveDb(db);
    revalidatePath('/');
    revalidatePath('/appointments');
  }
}

export async function getVitalsHistory() {
  return getDb().vitalsHistory || [];
}

export async function addVitalsReading(heartRate: number, bloodPressure: string) {
  const db = getDb();
  
  // Format current date as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Check limit
  let dailyChecks = db.user.vitals?.dailyChecks || 0;
  let lastCheckedDate = db.user.vitals?.lastCheckedDate || '';
  
  if (lastCheckedDate !== today) {
    dailyChecks = 0;
    lastCheckedDate = today;
  }
  
  if (dailyChecks >= 3) {
    throw new Error('Daily check limit reached. Please try again tomorrow.');
  }
  
  // Add to history
  if (!db.vitalsHistory) {
    db.vitalsHistory = [];
  }
  
  const newReading = {
    id: `vh${Date.now()}`,
    date: new Date().toISOString(),
    heartRate,
    bloodPressure
  };
  
  db.vitalsHistory.unshift(newReading); // Add to top of list
  
  // Update user vitals
  db.user.vitals = {
    ...db.user.vitals,
    heartRate,
    bloodPressure,
    lastCheckedDate,
    dailyChecks: dailyChecks + 1
  };
  
  saveDb(db);
  revalidatePath('/profile');
  return newReading;
}


export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const db = getDb();
  const user = db.user;

  if (user.email === email && user.password === password) {
    const cookieStore = await cookies();
    cookieStore.set('medtrust_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    redirect('/');
  }

  return { error: 'Invalid email or password. Please try again.' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('medtrust_session');
  redirect('/login');
}

export async function changeDoctor(apptId: string, newDoctorId: string) {
  const db = getDb();
  const index = db.appointments.findIndex((a: any) => a.id === apptId);
  if (index !== -1) {
    db.appointments[index].doctorId = newDoctorId;
    saveDb(db);
    revalidatePath('/appointments');
  }
}

export async function updateAppointmentDetails(apptId: string, details: { notes?: string, location?: string }) {
  const db = getDb();
  const index = db.appointments.findIndex((a: any) => a.id === apptId);
  if (index !== -1) {
    db.appointments[index] = { ...db.appointments[index], ...details };
    saveDb(db);
    revalidatePath('/appointments');
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('medtrust_session');
  return session?.value === 'authenticated';
}

export async function getNotifications() {
  const db = getDb();
  return db.notifications || [];
}

export async function markNotificationAsRead(id: string) {
  const db = getDb();
  if (!db.notifications) return;
  const index = db.notifications.findIndex((n: any) => n.id === id);
  if (index !== -1) {
    db.notifications[index].read = true;
    saveDb(db);
  }
}

export async function markAllNotificationsAsRead() {
  const db = getDb();
  if (!db.notifications) return;
  db.notifications.forEach((n: any) => {
    n.read = true;
  });
  saveDb(db);
}

export async function resetPassword(newPassword: string) {
  const db = getDb();
  if (db.user) {
    db.user.password = newPassword;
    saveDb(db);
  }
}
