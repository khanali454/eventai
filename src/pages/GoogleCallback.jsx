// src/pages/GoogleCallback.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState('');
  const { login } = useAuth(); // ⬅️ Using AuthContext

  useEffect(() => {
    const code = params.get('code');
    const oauthError = params.get('error');

    if (oauthError) {
      setStatus('error');
      setError(`Google authentication error: ${oauthError}`);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setStatus('error');
      setError('No authorization code received from Google');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const authenticateWithGoogle = async () => {
      setStatus('authenticating');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate with Google');
        }

        const data = await response.json();

        if (!data?.token || !data?.user) {
          throw new Error(data?.message || 'No user or token returned');
        }

        // AuthContext login
        const result = await login(data.user, data.token);

        if (result.success) {
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          throw new Error(result.error || 'Login failed');
        }
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        setStatus('error');
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    authenticateWithGoogle();
  }, [params, login, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'initializing':
        return (
          <StatusCard
            title="Initializing"
            message="Preparing authentication process..."
          />
        );

      case 'authenticating':
        return (
          <StatusCard
            title="Authenticating"
            message="Signing you in with Google..."
            loadingBar
          />
        );

      case 'success':
        return (
          <StatusCard
            title="Success!"
            message="You have been successfully signed in."
            status="success"
            redirect="Redirecting to dashboard..."
          />
        );

      case 'error':
        return (
          <StatusCard
            title="Authentication Failed"
            message={error}
            status="error"
            redirect="Redirecting to login..."
          />
        );

      default:
        return (
          <StatusCard
            title="Processing"
            message="Please wait..."
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        {renderContent()}
      </div>
    </div>
  );
}

// 🔧 Reusable component
function StatusCard({ title, message, status = 'loading', redirect, loadingBar }) {
  const statusIcons = {
    loading: (
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
    ),
    success: (
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="text-center">
      {statusIcons[status]}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">{message}</p>
      {loadingBar && (
        <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto mt-4">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
        </div>
      )}
      {redirect && <p className="text-sm text-gray-500 mt-4">{redirect}</p>}
    </div>
  );
}
