/** @format */

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  clearErrors,
  getRoomReviews,
  deleteReview,
} from '../../redux/actions/roomsAction';
import { MDBDataTable } from 'mdbreact';
import { DELETE_REVIEW_RESET } from '../../redux/constants/roomConstants';

const RoomReviews = () => {
  const dispatch = useDispatch();

  const [roomId, setRoomId] = useState('');

  const { loading, error, reviews } = useSelector((state) => state.roomReviews);
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.review
  );

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: 'Review ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Rating',
          field: 'rating',
          sort: 'asc',
        },
        {
          label: 'Comment',
          field: 'comment',
          sort: 'asc',
        },
        {
          label: 'User',
          field: 'user',
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

    reviews &&
      reviews.forEach((review) => {
        data.rows.push({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          user: review.name,
          actions: (
            <button
              className="btn btn-danger mx-2"
              onClick={() => deleteReviewHandler(review._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          ),
        });
      });

    return data;
  };

  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, roomId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (roomId !== '') {
      dispatch(getRoomReviews(roomId));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error('No room found with that id');
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success('Review deleted');
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, roomId, isDeleted, deleteError]);

  return (
    <div className="container container-fluid">
      <div className="row justify-content-center mt-5 mb-2">
        <div className="col-5">
          <form>
            <div className="form-group">
              <label htmlFor="room_id_field">Enter Room id</label>
              <input
                type="text"
                id="room_id_field"
                className="form-control"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="btn btn-block btn-primary mt-3"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {reviews && reviews.length <= 0 && (
        <div className="alert alert-danger mt-5 text-center">
          No reviews found for this room
        </div>
      )}
      {reviews && reviews.length > 0 && (
        <MDBDataTable
          data={setReviews()}
          className="px-3"
          bordered
          striped
          hover
        />
      )}
    </div>
  );
};

export default RoomReviews;
