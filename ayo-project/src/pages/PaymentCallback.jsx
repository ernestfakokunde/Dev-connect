
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalContext } from '../context/context';
import { toast } from 'react-toastify';

const PaymentCallback = () => {
  const { token, setUser } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const reference = query.get('reference');

    if (reference && token) {
      axios
        .get(`/api/users/verify/${reference}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success('Payment verified successfully! You are now premium 🎉');
          setUser(res.data.user);
          navigate('/profilepage');
        })
        .catch(() => {
          toast.error('Verification failed.');
          navigate('/');
        });
    } else {
        navigate('/');
    }
  }, [token, location.search, navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verifying your payment...</h1>
        <p className="text-gray-500">Please wait while we confirm your transaction.</p>
      </div>
    </div>
  );
};

export default PaymentCallback;
