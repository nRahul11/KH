/** @format */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  clearErrors,
  getAdminBookings,
  deleteBooking,
} from '../../redux/actions/bookingAction';
import Link from 'next/link';
import { MDBDataTable } from 'mdbreact';
import easyInvoice from 'easyinvoice';
import { DELETE_BOOKING_RESET } from '../../redux/constants/bookingConstants';

const AllBookings = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { bookings, error, loading } = useSelector((state) => state.bookings);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.deleteBooking
  );

  const setBookings = () => {
    const data = {
      columns: [
        {
          label: 'Booking ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Check In',
          field: 'checkIn',
          sort: 'asc',
        },
        {
          label: 'Check out',
          field: 'checkOut',
          sort: 'asc',
        },
        {
          label: 'Amount paid',
          field: 'amount',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    bookings &&
      bookings.forEach((booking) => {
        data.rows.push({
          id: booking._id,
          checkIn: new Date(booking.checkInDate).toLocaleString('en-US'),
          checkOut: new Date(booking.checkOutDate).toLocaleString('en-US'),
          amount: `$${booking.amountPaid}`,
          actions: (
            <>
              <Link href={`/admin/bookings/${booking._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-eye"></i>
                </a>
              </Link>

              <button
                className="btn btn-success mx-2"
                onClick={() => downloadInvoice(booking)}
              >
                <i className="fa fa-download"></i>
              </button>

              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteBookingHandler(booking._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const downloadInvoice = async (booking) => {
    const data = {
      documentTitle: 'Booking INVOICE',
      currency: 'USD',
      taxNotation: 'vat',
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      logo: 'https://res.cloudinary.com/snazzycave/image/upload/v1643294618/scapes/logo_kfy6w3.png',
      sender: {
        company: 'Scapes',
        address: 'India',
        zip: '',
        city: '',
        country: '',
      },
      client: {
        company: booking.user.name,
        address: booking.user.email,
        zip: '',
        city: `Check In: ${new Date(booking.checkInDate).toLocaleString(
          'en-US'
        )}`,
        country: `Check In: ${new Date(booking.checkOutDate).toLocaleString(
          'en-US'
        )}`,
      },
      invoiceNumber: booking._id,
      invoiceDate: new Date(Date.now()).toLocaleString('en-US'),
      products: [
        {
          quantity: booking.daysOfStay,
          description: booking.room.name,
          tax: 0,
          price: booking.room.pricePerNight,
        },
      ],
      bottomNotice: 'This is auto generated Invoice of your booking on Scapes.',
    };

    const result = await easyInvoice.createInvoice(data);
    easyInvoice.download(`invoice_${booking._id}.pdf`, result.pdf);
  };

  const deleteBookingHandler = (id) => {
    dispatch(deleteBooking(id));
  };

  useEffect(() => {
    dispatch(getAdminBookings());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      router.push('/admin/bookings');
      dispatch({ type: DELETE_BOOKING_RESET });
    }
  }, [dispatch, error, deleteError, router, isDeleted]);

  return (
    <div className="container container-fluid">
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <>
          <h1 className="my-5">{`${bookings && bookings.length} bookings`}</h1>
          <MDBDataTable
            data={setBookings()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      )}
    </div>
  );
};

export default AllBookings;
