import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login; 