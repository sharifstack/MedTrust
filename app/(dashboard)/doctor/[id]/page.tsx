import { getDoctor } from '@/lib/actions';
import EditDoctorModal from '@/components/EditDoctorModal';
import BookAppointmentForm from '@/components/BookAppointmentForm';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const doctor = await getDoctor(params.id);

  if (!doctor) {
    notFound();
  }

  return (
<main className="pt-[80px] pb-[100px] px-md md:px-lg max-w-container-max mx-auto">
{/*  Doctor Hero Section  */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter py-xl">
{/*  Profile Info Column  */}
<div className="lg:col-span-4 flex flex-col gap-lg">
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30 overflow-hidden relative">
<div className="absolute top-md right-md z-10">
  <EditDoctorModal doctor={doctor} />
</div>
<div className="relative w-full aspect-square rounded-xl overflow-hidden mb-md mt-md">
<img alt={`Dr. ${doctor.name}`} className="w-full h-full object-cover" src={doctor.image}/>
<div className="absolute top-sm right-sm bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full flex items-center gap-xs shadow-md">
<span className="material-symbols-outlined text-[16px]" data-icon="verified" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
<span className="font-label-sm text-[12px] font-bold">BOARD CERTIFIED</span>
</div>
</div>
<div>
<h2 className="font-h2 text-h2 text-primary mb-xs">Dr. {doctor.name}</h2>
<p className="font-body-md text-secondary font-semibold mb-sm">{doctor.title}</p>
<div className="flex items-center gap-sm mb-md">
<div className="flex items-center text-tertiary-fixed-dim">
<span className="material-symbols-outlined" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined" data-icon="star_half" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star_half</span>
</div>
<span className="font-body-md text-on-surface-variant">({doctor.reviews} reviews)</span>
</div>
<div className="flex flex-wrap gap-sm">
<span className="px-sm py-xs bg-surface-container rounded-full text-on-surface-variant font-label-sm">{doctor.specialty}</span>
</div>
</div>
</div>
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
<h3 className="font-h3 text-h3 text-primary mb-md">Contact &amp; Location</h3>
<div className="flex flex-col gap-md">
<div className="flex items-start gap-md">
<span className="material-symbols-outlined text-secondary" data-icon="location_on">location_on</span>
<div className="font-body-md text-on-surface-variant">
<p className="font-bold text-on-surface">MedTrust Health Center</p>
<p>123 Medical Center Drive</p>
<p>New York, NY 10001</p>
</div>
</div>
<div className="flex items-start gap-md">
<span className="material-symbols-outlined text-secondary" data-icon="phone">phone</span>
<p className="font-body-md text-on-surface-variant">(555) 123-4567</p>
</div>
</div>
</div>
</div>
{/*  Booking &amp; Details Column  */}
<div className="lg:col-span-8 flex flex-col gap-lg">
<BookAppointmentForm doctorId={doctor.id} />
{/*  Info Cards Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
{/*  Bio  */}
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
<h3 className="font-h3 text-h3 text-primary mb-md">About Dr. {doctor.name.split(' ')[1] || doctor.name}</h3>
<p className="font-body-md text-on-surface-variant leading-relaxed">
    {doctor.bio}
</p>
</div>
{/*  Education  */}
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
<h3 className="font-h3 text-h3 text-primary mb-md">Education &amp; Training</h3>
<ul className="flex flex-col gap-sm">
<li className="flex items-start gap-sm">
<span className="material-symbols-outlined text-secondary" data-icon="school">school</span>
<div className="font-body-md">
<p className="font-bold text-on-surface">Stanford University</p>
<p className="text-on-surface-variant font-caption">Residency, Cardiology</p>
</div>
</li>
<li className="flex items-start gap-sm">
<span className="material-symbols-outlined text-secondary" data-icon="school">school</span>
<div className="font-body-md">
<p className="font-bold text-on-surface">Johns Hopkins University</p>
<p className="text-on-surface-variant font-caption">Doctor of Medicine (M.D.)</p>
</div>
</li>
</ul>
</div>
</div>
{/*  Reviews Section  */}
<div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(30,41,59,0.05)] border border-outline-variant/30">
<div className="flex items-center justify-between mb-lg">
<h3 className="font-h3 text-h3 text-primary">Patient Reviews</h3>
<button className="text-secondary font-label-sm font-bold flex items-center gap-xs">View All <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span></button>
</div>
<div className="flex flex-col gap-lg">
<div className="pb-lg border-b border-outline-variant/20">
<div className="flex items-center justify-between mb-sm">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">EM</div>
<div>
<p className="font-label-sm font-bold text-on-surface">Elena Martinez</p>
<p className="font-caption text-on-surface-variant">Oct 12, 2023</p>
</div>
</div>
<div className="flex text-tertiary-fixed-dim">
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
</div>
<p className="font-body-md text-on-surface-variant italic">"Dr. Vance is exceptionally professional and took the time to explain my procedure in detail. I felt very safe and cared for throughout the entire process."</p>
</div>
<div>
<div className="flex items-center justify-between mb-sm">
<div className="flex items-center gap-sm">
<div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold">RB</div>
<div>
<p className="font-label-sm font-bold text-on-surface">Robert Bennett</p>
<p className="font-caption text-on-surface-variant">Sep 28, 2023</p>
</div>
</div>
<div className="flex text-tertiary-fixed-dim">
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[18px]" data-icon="star" data-weight="fill" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
</div>
<p className="font-body-md text-on-surface-variant italic">"Top-notch specialist. The clinic staff were efficient, and Dr. Vance's expertise is evident from the first minute of consultation."</p>
</div>
</div>
</div>
</div>
</section>
</main>
  );
}
