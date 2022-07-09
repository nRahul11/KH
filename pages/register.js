/** @format */

import Register from '../components/auth/Register';
import Layout from '../components/Layout/Layout';
import { getSession } from 'next-auth/client';

const RegsiterPage = () => {
  return (
    <Layout title="Register">
      <Register />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default RegsiterPage;
