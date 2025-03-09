'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';

const ResetPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || !password || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);

        try {
            const data = { otp, password, confirmPassword };
            const response = await axios.post(
                `${API_URL}/users/reset-password`,
                data,
                {
                    withCredentials: true
                }
            );

            dispatch(setAuthUser(response?.data?.data?.user));
            toast.success('Password reset successful');
            router.push('/auth/login');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(
                    error.response.data.message || 'Failed to reset password'
                );
            } else {
                toast.error('Failed to reset password');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="otp"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            OTP
                        </label>
                        <input
                            type="number"
                            id="otp"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {!loading && (
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                        >
                            Change Password
                        </button>
                    )}
                    {loading && (
                        <button
                            type="button"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex justify-center items-center cursor-not-allowed"
                            disabled
                            title="Loading"
                        >
                            <Loader className="animate-spin" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => router.push('/auth/forgetpassword')}
                        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300 mt-4 cursor-pointer"
                    >
                        Go Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
