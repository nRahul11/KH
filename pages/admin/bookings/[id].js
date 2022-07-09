/** @format */

import { getSession } from 'next-auth/client';
import BookingDetails from '../../../components/booking/BookingDetails';
import Layout from '../../../components/Layout/Layout';
import { bookingDetails } from '../../../redux/actions/bookingAction';
import { wrapper } from '../../../redux/store';

const BookingDetailsPage = () => {
  return (
    <Layout title="Booking details">
      <BookingDetails />
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const session = await getSession({ req });

      if (!session || session.user !== 'Admin') {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      await store.dispatch(bookingDetails(req.headers.cookie, req, params.id));
    }
);

export default BookingDetailsPage;
