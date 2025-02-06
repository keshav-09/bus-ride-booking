import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { constructMetadata } from '@/lib/utils';
import EditForm from '@/components/fare/EditForm';

export const metadata = constructMetadata({
  title: 'Location – Next Template',
  description: 'Location page for only manage management.',
});

export default async function AdminPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  // You can define pageIndex and pageSize if needed, but they're not used here
  const pageIndex = 1;
  const pageSize = 10;

  try {
    // Return the EditForm with the ID from the params
    return (
      <div className="flex flex-col gap-5">
        <EditForm />
      </div>
    );
  } catch (error) {
    console.error('Error fetching location data:', error);
    return (
      <div className="text-red-500 text-center">
        Failed to load data. Please try again later.
      </div>
    );
  }
}