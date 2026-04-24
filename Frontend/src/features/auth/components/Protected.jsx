import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import Loading from '../../shared/components/Loading';

const Protected = ({ children }) => {

  const { user, loading } = useSelector((state) => state.auth);
  console.log(user);

  if(loading) {
    return <Loading fullScreen={true} size="lg" message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }



  return children
}

export default Protected
