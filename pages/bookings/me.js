/** @format */

import { getSession } from 'next-auth/client';
import MyBookings from '../../components/booking/myBookings';
import Layout from '../../components/Layout/Layout';
import { myBookings } from '../../redux/actions/bookingAction';
import { wrapper } from '../../redux/store';

const MyBookingsPage = () => {
  return (
    <Layout title="My Bookings">
      <MyBookings />
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const session = await getSession({ req });

      if (!session) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      await store.dispatch(myBookings(req.headers.cookie, req));
    }
);

export default MyBookingsPage;
