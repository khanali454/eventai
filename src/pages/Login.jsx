// src/components/GoogleAuth.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL;

export default function Login() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
   useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Sign in with Google</h2>

                <a
                    href={GOOGLE_AUTH_URL}
                    className="w-full inline-flex items-center justify-center bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition duration-200"
                >
                    <svg
                        className="h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                        fill="currentColor"
                    >
                        <path d="M488 261.8c0-17.8-1.6-35-4.6-51.8H249v98h135.8c-5.9 32-23.8 59-50.8 77l82.1 63.9c47.9-44.2 74.9-109.2 74.9-187.1z" />
                        <path d="M249 492c67 0 123.2-22.1 164.2-60.1l-82.1-63.9c-22.8 15.3-52 24.3-82.1 24.3-63 0-116.5-42.4-135.7-99.3H28.4v62.2C69.5 444.8 152.3 492 249 492z" />
                        <path d="M113.3 292.9c-4.8-14.3-7.5-29.6-7.5-45s2.7-30.7 7.5-45V140.7H28.4C10.1 173.5 0 209.1 0 247.9s10.1 74.4 28.4 107.2l84.9-62.2z" />
                        <path d="M249 97.9c35.6 0 67.5 12.3 92.6 32.6l69.6-69.6C374.8 23.1 317.6 0 249 0 152.3 0 69.5 47.2 28.4 120.7l84.9 62.2c19.2-56.9 72.7-99.3 135.7-99.3z" />
                    </svg>
                    Sign in with Google
                </a>
            </div>
        </div>
    );
}
