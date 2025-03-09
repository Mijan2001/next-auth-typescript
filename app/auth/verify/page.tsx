'use client';

import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const Verify = () => {
    const [loading, setLoading] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (!user) {
            router.replace('/auth/signup');
        }
    }, [user, router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;

        if (!/^\d?$/.test(value)) return; // Allow only single digit numbers

        setOtp(prev => {
            const newOtp = [...prev];
            newOtp[index] = value;
            return newOtp;
        });

        // Auto-focus next input if a digit is entered
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (
            e.key === 'Backspace' &&
            !otp[index] &&
            inputRefs.current[index - 1]
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            toast.error('Please enter a 4-digit OTP');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/users/verify`,
                {
                    otp: otpValue
                },
                { withCredentials: true }
            );
            setLoading(false);
            const verifiedUser = response.data.data.user;
            dispatch(setAuthUser(verifiedUser));
            router.push('/auth/login');
            toast.success(response.data.message || 'OTP Verified Successfully');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data?.message || 'Invalid OTP');
            } else {
                toast.error('Invalid OTP');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoadingResend(true);
        try {
            await axios.post(`${API_URL}/users/resend-otp`, null, {
                withCredentials: true
            });
            setLoadingResend(false);
            toast.success('New OTP has been resent');
        } catch (error) {
            toast.error('Failed to resend OTP');
            console.error(error);
        } finally {
            setLoadingResend(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mx-auto flex flex-col gap-4 items-center">
                        <label className="block text-sm font-medium text-gray-700">
                            Enter 4-digit OTP:
                        </label>
                        <div className="flex gap-4 mt-1">
                            {[0, 1, 2, 3].map(index => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder="0"
                                    title={`OTP digit ${index + 1}`}
                                    value={otp[index]}
                                    onChange={e => handleChange(e, index)}
                                    ref={el => {
                                        inputRefs.current[index] = el;
                                    }}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    className="w-16 h-16 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center flex-col gap-4">
                        {!loading && (
                            <button
                                type="submit"
                                title="Submit OTP"
                                className="px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                Submit
                            </button>
                        )}

                        {loading && (
                            <button
                                type="button"
                                className="px-4 py-2 font-medium text-white bg-indigo-600 rounded cursor-not-allowed flex items-center justify-center"
                                disabled
                                title="Loading"
                            >
                                <Loader className="animate-spin" />
                            </button>
                        )}

                        {!loadingResend && (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="px-4 py-2 font-medium text-indigo-600 bg-white border border-indigo-600 rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                Resend OTP
                            </button>
                        )}
                        {loadingResend && (
                            <button
                                type="button"
                                className="px-4 py-2 font-medium text-indigo-600 bg-white border border-indigo-600 rounded cursor-not-allowed flex items-center justify-center"
                                disabled
                                title="Loading"
                            >
                                <Loader className="animate-spin" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verify;
