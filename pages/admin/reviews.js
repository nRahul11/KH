/** @format */

import { getSession } from 'next-auth/client';
import RoomReviews from '../../components/admin/RoomReviews';
import Layout from '../../components/Layout/Layout';

const RoomReviewsPage = () => {
  return (
    <Layout title="All Reviews">
      <RoomReviews />
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

export default RoomReviewsPage;
