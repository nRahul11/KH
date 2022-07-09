/** @format */

import { getSession } from 'next-auth/client';
import AllBookings from '../../../components/admin/AllBooking';
import Layout from '../../../components/Layout/Layout';

const AllBookingsPage = () => {
  return (
    <Layout title="All Bookings">
      <AllBookings />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'Admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default AllBookingsPage;
