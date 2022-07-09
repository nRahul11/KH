/** @format */

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  clearErrors,
  updateUser,
  getUserDetails,
} from '../../redux/actions/userAction';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UPDATE_USER_RESET } from '../../redux/constants/userConstants';

const UpdateUser = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = router.query.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const { error, isUpdated } = useSelector((state) => state.user);
  const { user, loading } = useSelector((state) => state.userDetails);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = { name, email, role };
    dispatch(updateUser(user._id, userData));
  };

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      router.push('/admin/users');
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, isUpdated, user, router, userId]);

  return (
    <>
      {loading ? (
        <h1 className="d-flex justify-content-center align-item-center">
          loading
        </h1>
      ) : (
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mt-2 mb-5">Update User</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="name"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role_field">Role</label>

                  <select
                    id="role_field"
                    className="form-control"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn update-btn btn-block mt-4 mb-3"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUser;
