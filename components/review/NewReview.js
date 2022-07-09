/** @format */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import {
  newReview,
  clearErrors,
  checkReview,
} from '../../redux/actions/roomsAction';
import { NEW_REVIEW_RESET } from '../../redux/constants/roomConstants';

const NewReview = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { id } = router.query;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { error, success } = useSelector((state) => state.newReview);
  const { reviewAvailable } = useSelector((state) => state.checkReview);

  const submitHandler = (e) => {
    e.preventDefault();

    const reviewData = {
      rating,
      comment,
      roomId: id,
    };

    dispatch(newReview(reviewData));
    window.location.reload();
  };

  function setUserRatings() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, idx) => {
      star.starValue = idx + 1;
      ['click', 'mouseover', 'mouseout'].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });

    function showRatings(e) {
      stars.forEach((star, idx) => {
        if (e.type === 'click') {
          if (idx < this.starValue) {
            star.classList.add('red');
            setRating(this.starValue);
          } else {
            star.classList.remove('red');
          }
        }

        if (e.type === 'mouseover') {
          if (idx < this.starValue) {
            star.classList.add('light-red');
          } else {
            star.classList.remove('light-red');
          }
        }

        if (e.type === 'mouseout') {
          star.classList.remove('light-red');
        }
      });
    }
  }

  useEffect(() => {
    if (id !== undefined) {
      dispatch(checkReview(id));
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success('Review posted');
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, error, success, id]);

  return (
    <div className="container">
      <div className="row d-flex justify-content-between">
        {reviewAvailable && (
          <button
            id="review_btn"
            type="button"
            className="btn btn-primary mt-4 mb-5"
            data-toggle="modal"
            data-target="#ratingModal"
            onClick={setUserRatings}
          >
            Submit Your Review
          </button>
        )}

        <div
          className="modal fade"
          id="ratingModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="ratingModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ratingModalLabel">
                  Submit Review
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="stars">
                  <li className="star">
                    <i className="fa fa-star"></i>
                  </li>
                  <li className="star">
                    <i className="fa fa-star"></i>
                  </li>
                  <li className="star">
                    <i className="fa fa-star"></i>
                  </li>
                  <li className="star">
                    <i className="fa fa-star"></i>
                  </li>
                  <li className="star">
                    <i className="fa fa-star"></i>
                  </li>
                </ul>

                <textarea
                  name="review"
                  id="review"
                  className="form-control mt-3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <button
                  className="btn my-3 float-right review-btn px-4 text-white"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={submitHandler}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReview;
