'use client';

import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/server';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(
                `${API_URL}/users/forget-password`,
                {
                    email
                },
                { withCredentials: true }
            );
            setLoading(false);
            toast.success('Password reset code sent to your email');
            router.push(
                `/auth/resetpassword?email=${encodeURIComponent(email)}`
            );
        } catch (error: unknown) {
            toast.error(
                (axios.isAxiosError(error) && error.response?.data?.message) ||
                    'Failed to reset password'
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">
                    Enter Your Email to reset password
                </h1>
                <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                {!loading && (
                    <button
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors cursor-pointer flex justify-center items-center"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Submit
                    </button>
                )}
                {loading && (
                    <button
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors cursor-pointer flex justify-center items-center"
                        disabled={loading}
                        title="Loading"
                    >
                        <Loader className="animate-spin" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
