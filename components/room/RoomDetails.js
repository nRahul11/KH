/** @format */

import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors } from '../../redux/actions/roomsAction';
import RoomFeatures from './RoomFeatures';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  checkBooking,
  getBookedDates,
} from '../../redux/actions/bookingAction';
import { CHECK_BOOKING_RESET } from '../../redux/constants/bookingConstants';
import { getStripe } from '../../utils/getStripe';
import NewReview from '../review/NewReview';
import ListReviews from '../review/ListReviews';

const RoomDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [daysOfStay, setDaysOfStay] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { room, error } = useSelector((state) => state.roomDetail);
  const { dates } = useSelector((state) => state.bookedDates);
  const { user } = useSelector((state) => state.auth);
  const { available, loading: bookingLoading } = useSelector(
    (state) => state.checkBooking
  );
  const { id } = router.query;

  const excludedDates = [];
  dates.forEach((date) => {
    excludedDates.push(new Date(date));
  });

  const handleChange = (dates) => {
    const [checkInDate, checkOutDate] = dates;

    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if (checkInDate && checkOutDate) {
      const days = Math.floor(
        (new Date(checkOutDate) - new Date(checkInDate)) / 86400000 + 1
      );
      setDaysOfStay(days);
      dispatch(
        checkBooking(id, checkInDate.toISOString(), checkOutDate.toISOString())
      );
    }
  };

  const newBookingHandler = async () => {
    const bookingData = {
      room: router.query.id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: 90,
      paymentInfo: {
        id: 'PAYMENT ID',
        status: 'Paid',
      },
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/bookings', bookingData, config);
    } catch (error) {
      console.log(error.response);
    }
  };

  const bookRoom = async (id, pricePerNight) => {
    setPaymentLoading(true);

    const amount = pricePerNight * daysOfStay;
    try {
      const link = `/api/checkout_session/${id}?checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&daysOfStay=${daysOfStay}`;

      const { data } = await axios.get(link, { params: { amount } });

      const stripe = await getStripe();

      stripe.redirectToCheckout({ sessionId: data.id });
      setPaymentLoading(false);
    } catch (error) {
      setPaymentLoading(false);
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    dispatch(getBookedDates(id));
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    () => {
      dispatch({ type: CHECK_BOOKING_RESET });
    };
  }, [dispatch, error, id, room]);

  return (
    <>
      <Head>
        <title>{room.name} - Scapes</title>
      </Head>
      <div className="container container-fluid">
        <h2 className="mt-5">{room.name}</h2>
        <p>{room.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(room.ratings / 5) * 100}% ` }}
            ></div>
          </div>
          <span id="no_of_reviews">({room.numOfReviews} Reviews)</span>
        </div>

        <Carousel
          pause="hover"
          nextLabel=""
          prevLabel=""
          fade={true}
          interval={2000}
          indicators={false}
        >
          {room.images &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div style={{ width: '100%', height: '440px' }}>
                  <Image
                    className="d-block m-auto"
                    src={image.url}
                    layout="fill"
                  />
                </div>
              </Carousel.Item>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{room.description}</p>

            <div className="features mt-5">
              <h3 className="mb-4">Features:</h3>
              <RoomFeatures room={room} />
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <p className="price-per-night">
                <b>Rs {room.pricePerNight}</b> / night
              </p>
              <hr />
              <p className="mt-5 mb-3">Pick Check In & Check Out Date</p>

              <DatePicker
                className="w-100"
                selected={checkInDate}
                onChange={handleChange}
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                excludeDates={excludedDates}
                selectsRange
                inline
              />

              {available === true && (
                <div className="alert alert-success my-3 font-weight-bold">
                  Room is available.Book now!!
                </div>
              )}

              {available === false && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Room not available.Please try a different date.
                </div>
              )}

              {available && !user && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Please login to book a room
                </div>
              )}

              {available && user && (
                <button
                  className="btn btn-block py-3 booking-btn"
                  onClick={() => {
                    bookRoom(room._id, room.pricePerNight);
                  }}
                  disabled={bookingLoading || paymentLoading}
                >
                  Pay -Rs {daysOfStay * room.pricePerNight}
                </button>
              )}
            </div>
          </div>
        </div>

        <NewReview />
        {room.reviews && room.reviews.length > 0 ? (
          <ListReviews reviews={room.reviews} />
        ) : (
          <p>
            <b>No Reviews on this room</b>
          </p>
        )}
      </div>
    </>
  );
};

export default RoomDetails;
