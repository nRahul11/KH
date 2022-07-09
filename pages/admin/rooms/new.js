/** @format */

import { getSession } from 'next-auth/client';
import NewRoom from '../../../components/admin/NewRoom';
import Layout from '../../../components/Layout/Layout';

const NewRoomPage = () => {
  return (
    <Layout title="New Room">
      <NewRoom />
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

export default NewRoomPage;
