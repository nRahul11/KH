/** @format */

import React, { useState } from 'react';
import { signIn } from 'next-auth/client';
import { toast } from 'react-toastify';
import ButtonLoaderComponent from '../Layout/ButtonLoaderComponent';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoginLoading, setGuestLoginLoading] = useState(false);

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    setGuestLoginLoading(true);

    const res = await signIn('credentials', {
      email: 'guest@gmail.com',
      password: '12345678',
      redirect: false,
    });

    setGuestLoginLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      window.location.href = '/';
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="container container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Link href={'/password/forgot'}>
              <a className="float-right mb-4">Forgot Password?</a>
            </Link>
            <button
              id="login_button"
              type="submit"
              className="btn btn-block "
              disabled={loading}
            >
              {loading ? <ButtonLoaderComponent /> : 'LOGIN'}
            </button>
            <button onClick={handleGuestLogin} className="btn btn-block mt-2">
              {guestLoginLoading ? <ButtonLoaderComponent /> : 'LOGIN AS GUEST'}
            </button>

            <Link href={'/register'}>
              <a className="float-right mt-3">New User?</a>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
