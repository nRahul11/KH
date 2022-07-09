/** @format */

import { useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { clearErrors } from '../redux/actions/roomsAction';
import RoomItem from './room/RoomItem';
import Link from 'next/link';

const Home = () => {
  const { roomCount, resultsPerPage, rooms, error, filteredRoomsCount } =
    useSelector((state) => state.allRooms);
  const dispatch = useDispatch();
  const router = useRouter();
  let { page = 1, location } = router.query;
  page = Number(page);

  let count = roomCount;
  if (location) {
    count = filteredRoomsCount;
  }

  const handlePagination = (pageNumber) => {
    window.location.href = `/?page=${pageNumber}`;
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section id="rooms" className="container mt-5">
        <h2 className="mb-3 ml-2 stays-heading">
          {location
            ? `Rooms is ${
                location.charAt(0).toUpperCase() +
                location.slice(1).toLowerCase()
              }`
            : ``}
        </h2>
        <Link href={'/search'}>
          <a className="ml-2 back-to-search">
            <i className="fa fa-arrow-left"></i> Back to Search
          </a>
        </Link>
        {rooms && rooms.length === 0 ? (
          <div className="alert alert-danger mt-5">
            <strong>No rooms found</strong>
          </div>
        ) : (
          <div className="row">
            {rooms.map((room) => (
              <div className="col-sm-12 col-md-6 col-lg-3 my-3" key={room._id}>
                <RoomItem room={room} key={room._id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {resultsPerPage < count && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={page}
            itemsCountPerPage={resultsPerPage}
            totalItemsCount={roomCount}
            onChange={handlePagination}
            nextPageText={'Next'}
            prevPageText={'Previous'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </>
  );
};

export default Home;
