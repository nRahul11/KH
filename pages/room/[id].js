/** @format */

import Layout from '../../components/Layout/Layout';
import RoomDetails from '../../components/room/RoomDetails';
import { getRoomDetails } from '../../redux/actions/roomsAction';
import { wrapper } from '../../redux/store';

export default function RoomDetailsPage() {
  return (
    <Layout>
      <RoomDetails title="Room details" />
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      await store.dispatch(getRoomDetails(params.id));
    }
);
