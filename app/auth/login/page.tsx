'use client';
import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/users/login`,
                formData,
                {
                    withCredentials: true
                }
            );
            const user = response.data.data.user;
            toast.success('Login successful');
            dispatch(setAuthUser(user));
            router.push('/'); // Redirect to dashboard or home page
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Login failed');
            } else {
                toast.error('Login failed');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">
                    Login
                </h1>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {!loading ? (
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none cursor-pointer"
                    >
                        Login
                    </button>
                ) : (
                    <button
                        type="button"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none cursor-not-allowed"
                        disabled
                        title="Loading"
                    >
                        <Loader className="animate-spin mx-auto" />
                    </button>
                )}
            </form>

            <p className="text-center text-sm text-gray-600 mt-4 mb-1">
                Forgot your password?{' '}
                <Link
                    href="/auth/forgetpassword"
                    className="text-indigo-600 hover:text-indigo-500"
                >
                    Reset it
                </Link>
            </p>

            <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?
                <Link
                    href="/auth/signup"
                    className="text-indigo-600 hover:text-indigo-500"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default Login;
