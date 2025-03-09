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

const Signup = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
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
                `${API_URL}/users/signup`,
                formData,
                {
                    withCredentials: true
                }
            );
            const user = response.data.data.user;
            toast.success('Sign up successful');
            dispatch(setAuthUser(user));
            router.push('/auth/verify');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto  mt-8 p-6 bg-white rounded-lg shadow-md ">
            <form onSubmit={handleSubmit} className="mb-4">
                <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">
                    Sign Up
                </h1>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        placeholder="Enter your username"
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
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
                <div className="mb-4">
                    <label
                        htmlFor="passwordConfirm"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
                        placeholder="Confirm your password"
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                {/* I agree term and condition========= */}

                {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            required
                        />
                        <span className="ml-2">
                            I agree to the{' '}
                            <Link
                                href="/terms"
                                className="text-indigo-600 hover:text-indigo-500"
                            >
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link
                                href="/privacy"
                                className="text-indigo-600 hover:text-indigo-500"
                            >
                                Privacy Policy
                            </Link>
                        </span>
                    </label>
                </div> */}

                {!loading && (
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none  cursor-pointer"
                    >
                        Sign Up
                    </button>
                )}
                {loading && (
                    <button
                        type="button"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none  cursor-not-allowed"
                        disabled
                        title="Loading"
                    >
                        <Loader className="animate-spin mx-auto" />
                    </button>
                )}
            </form>
            <p className="text-center text-sm text-gray-600">
                Already have an account?
                <Link
                    href="/auth/login"
                    className="text-indigo-600 hover:text-indigo-500"
                >
                    Log in
                </Link>
            </p>
        </div>
    );
};

export default Signup;
