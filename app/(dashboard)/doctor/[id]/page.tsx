import { getDoctor, getRelatedDoctors } from '@/lib/actions';
import EditDoctorModal from '@/components/EditDoctorModal';
import BookAppointmentForm from '@/components/BookAppointmentForm';
import MessageDoctorButton from '@/components/MessageDoctorButton';
import { notFound } from 'next/navigation';
import { MdVerified, MdStar, MdLocationOn, MdPhone, MdSchool, MdMedicalServices, MdGroups, MdTimeline, MdEmergency, MdVideocam, MdArrowForward } from 'react-icons/md';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = await getDoctor(id);

  if (!doctor) {
    notFound();
  }

  const relatedDoctors = await getRelatedDoctors(doctor.specialty, doctor.id);

  return (
    <main className="pt-[80px] pb-[100px] px-md md:px-lg max-w-container-max mx-auto bg-surface-container-lowest/50">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter py-xl">
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-elevation-1 border border-outline-variant/30 overflow-hidden relative group">
            <div className="absolute top-md right-md z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditDoctorModal doctor={doctor} />
            </div>
            
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-lg shadow-inner bg-surface-container-high">
              <img 
                alt={`Dr. ${doctor.name}`} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                src={doctor.image}
              />
              <div className="absolute top-sm right-sm bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container px-md py-xs rounded-full flex items-center gap-xs shadow-lg border border-white/20">
                <MdVerified className="text-[18px] text-secondary" />
                <span className="font-label-sm text-[12px] font-bold tracking-wide uppercase">Verified</span>
              </div>
              {doctor.videoConsultation && (
                <div className="absolute bottom-sm left-sm bg-primary-container/90 backdrop-blur-sm text-on-primary-container px-md py-xs rounded-full flex items-center gap-xs shadow-lg border border-white/20">
                  <MdVideocam className="text-[18px] text-primary" />
                  <span className="font-label-sm text-[12px] font-bold tracking-wide uppercase">Video Available</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-h2 text-h2 text-primary mb-xs">Dr. {doctor.name}</h2>
              <p className="font-body-md text-secondary font-bold mb-md flex items-center gap-sm">
                {doctor.title} <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> {doctor.qualifications}
              </p>
              
              <div className="flex items-center justify-between mb-lg bg-surface-container-low p-md rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-tertiary-fixed-dim">
                    <MdStar className="text-xl" />
                    <span className="font-h3 text-h3 text-on-surface ml-xs">{doctor.rating}</span>
                  </div>
                  <span className="font-caption text-on-surface-variant uppercase tracking-tighter">Rating</span>
                </div>
                <div className="w-[1px] h-10 bg-outline-variant/30"></div>
                <div className="flex flex-col items-center">
                  <span className="font-h3 text-h3 text-on-surface">{doctor.reviews}</span>
                  <span className="font-caption text-on-surface-variant uppercase tracking-tighter">Reviews</span>
                </div>
                <div className="w-[1px] h-10 bg-outline-variant/30"></div>
                <div className="flex flex-col items-center">
                  <span className="font-h3 text-h3 text-on-surface">{doctor.experienceYears}+</span>
                  <span className="font-caption text-on-surface-variant uppercase tracking-tighter">Years Exp.</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-sm">
                <span className="px-md py-sm bg-secondary/10 border border-secondary/20 rounded-xl text-secondary font-label-md font-bold">{doctor.specialty}</span>
              </div>
            </div>
          </div>

          {/* Location & Hospital Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-elevation-1 border border-outline-variant/30">
            <h3 className="font-h3 text-h3 text-primary mb-lg flex items-center gap-sm">
              <MdLocationOn className="text-secondary" /> Clinic & Location
            </h3>
            <div className="flex flex-col gap-lg">
              <div className="bg-surface-container-low p-md rounded-xl">
                <p className="font-bold text-on-surface font-body-md mb-xs">{doctor.hospitalInfo?.name || "MedTrust Health Center"}</p>
                <div className="space-y-1">
                  <p className="font-body-sm text-on-surface-variant">{doctor.hospitalInfo?.address}</p>
                  <p className="font-body-sm text-on-surface-variant">{doctor.hospitalInfo?.suite}</p>
                </div>
                <div className="mt-md flex items-center gap-xs text-secondary font-label-sm font-bold">
                   <MdLocationOn /> {doctor.hospitalInfo?.distance} away
                </div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                  <MdPhone size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-caption text-on-surface-variant">Emergency Contact</span>
                  <p className="font-body-md font-bold text-on-surface">{doctor.hospitalInfo?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <MessageDoctorButton />
        </div>

        {/* Right Column: Booking & Details */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Appointment Booking Sidebar/Top Card */}
          <BookAppointmentForm doctorId={doctor.id} doctorName={doctor.name} fee={doctor.fee || 150} />

          {/* Stats Bento Grid Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-lg flex flex-col items-center text-center">
              <MdGroups className="text-primary text-3xl mb-sm" />
              <span className="font-h2 text-h2 text-primary">{doctor.statistics?.patientsTreated || "5,000+"}</span>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">Patients Treated</p>
            </div>
            <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-lg flex flex-col items-center text-center">
              <MdTimeline className="text-secondary text-3xl mb-sm" />
              <span className="font-h2 text-h2 text-secondary">{doctor.statistics?.successRate || "98%"}</span>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">Success Rate</p>
            </div>
            <div className="bg-tertiary-fixed-dim/5 border border-tertiary-fixed-dim/10 rounded-2xl p-lg flex flex-col items-center text-center">
              <MdEmergency className="text-tertiary-fixed-dim text-3xl mb-sm" />
              <span className="font-h2 text-h2 text-tertiary-fixed-dim">${doctor.fee || 150}</span>
              <p className="font-label-sm text-on-surface-variant uppercase tracking-wide">Consultation Fee</p>
            </div>
          </div>

          {/* Detailed Info Tabs/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Bio */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-elevation-1 border border-outline-variant/30 flex flex-col">
              <h3 className="font-h3 text-h3 text-primary mb-lg pb-md border-b border-outline-variant/20">Biography</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed flex-grow">
                {doctor.bio}
              </p>
            </div>

            {/* Services */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-elevation-1 border border-outline-variant/30">
              <h3 className="font-h3 text-h3 text-primary mb-lg pb-md border-b border-outline-variant/20">Services & Treatments</h3>
              <ul className="grid grid-cols-1 gap-sm">
                {doctor.services?.map((service: string, i: number) => (
                  <li key={i} className="flex items-center gap-md group">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <MdMedicalServices size={16} />
                    </div>
                    <span className="font-body-md text-on-surface-variant font-medium">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-elevation-1 border border-outline-variant/30 md:col-span-2">
              <h3 className="font-h3 text-h3 text-primary mb-lg pb-md border-b border-outline-variant/20">Education & Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                <ul className="flex flex-col gap-lg">
                  {doctor.education?.map((edu: any, i: number) => (
                    <li key={i} className="flex items-start gap-md relative">
                      {i < (doctor.education.length - 1) && <div className="absolute left-5 top-10 w-0.5 h-full bg-outline-variant/20"></div>}
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary z-10">
                        <MdSchool size={20} />
                      </div>
                      <div className="font-body-md pt-1">
                        <p className="font-bold text-on-surface">{edu.school}</p>
                        <p className="text-secondary font-label-md font-bold">{edu.year}</p>
                        <p className="text-on-surface-variant font-caption italic mt-1">{edu.degree}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="bg-surface-container-high/30 rounded-2xl p-lg border border-outline-variant/20 flex flex-col justify-center">
                  <h4 className="font-h4 text-primary mb-sm">Emergency Support</h4>
                  <p className="font-body-md text-on-surface-variant mb-md">For immediate assistance, please contact our 24/7 hospital support line or visit the emergency department.</p>
                  <div className="flex items-center gap-md text-tertiary-fixed-dim">
                    <MdPhone />
                    <span className="font-h3 text-h3">{doctor.emergencyContact?.phone || "(555) 000-0000"}</span>
                  </div>
                  <p className="font-caption text-on-surface-variant mt-xs ml-8">{doctor.emergencyContact?.hospital || "Main Medical Center"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-elevation-1 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-lg pb-md border-b border-outline-variant/20">
              <h3 className="font-h3 text-h3 text-primary flex items-center gap-sm">
                Patient Reviews <span className="px-sm py-xs bg-surface-container rounded-lg text-on-surface-variant text-[14px]">{doctor.reviews}</span>
              </h3>
              <button className="text-secondary font-label-sm font-bold flex items-center gap-xs hover:underline decoration-2 underline-offset-4">
                View All <MdArrowForward />
              </button>
            </div>
            <div className="flex flex-col gap-lg">
              {doctor.patientReviews?.map((review: any, i: number) => (
                <div key={i} className={`pb-lg ${i < (doctor.patientReviews.length - 1) ? 'border-b border-outline-variant/10' : ''}`}>
                  <div className="flex items-center justify-between mb-md">
                    <div className="flex items-center gap-sm">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}>
                        {review.author.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-label-md font-bold text-on-surface">{review.author}</p>
                        <p className="font-caption text-on-surface-variant">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex text-tertiary-fixed-dim bg-surface-container-high px-md py-sm rounded-xl">
                      {[...Array(5)].map((_, idx) => (
                        <MdStar key={idx} className={idx < review.rating ? "text-tertiary-fixed-dim" : "text-outline-variant"} />
                      ))}
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant leading-relaxed relative pl-md italic">
                    <span className="absolute left-0 top-0 text-3xl text-outline-variant/50 leading-none">"</span>
                    {review.comment}
                    <span className="text-3xl text-outline-variant/50 leading-none inline-block align-bottom ml-1">"</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Doctors */}
          {relatedDoctors.length > 0 && (
            <div className="mt-xl">
              <h3 className="font-h3 text-h2 text-primary mb-lg">Recommended Specialists</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {relatedDoctors.map((relDoc: any) => (
                  <Link href={`/doctor/${relDoc.id}`} key={relDoc.id} className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-elevation-1 border border-outline-variant/30 hover:shadow-elevation-3 transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={relDoc.image} alt={relDoc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-md">
                      <p className="font-label-md font-bold text-primary mb-xs">Dr. {relDoc.name}</p>
                      <p className="font-caption text-secondary font-bold uppercase tracking-wide">{relDoc.specialty}</p>
                      <div className="flex items-center gap-xs mt-sm">
                        <MdStar className="text-tertiary-fixed-dim" />
                        <span className="font-body-sm font-bold text-on-surface">{relDoc.rating}</span>
                        <span className="text-on-surface-variant font-caption ml-1">({relDoc.reviews})</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
