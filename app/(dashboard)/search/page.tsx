import { getDoctors } from '@/lib/actions';
import DoctorSearchClient from '@/components/DoctorSearchClient';

export default async function Page() {
  const doctors = await getDoctors();

  return (
    <main className="pt-[100px] pb-xxl px-md md:px-lg max-w-container-max mx-auto">
      <DoctorSearchClient initialDoctors={doctors} />
    </main>
  );
}

