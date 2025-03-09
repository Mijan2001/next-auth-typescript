'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { AvatarFallback } from '@radix-ui/react-avatar';
import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const HomePage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const logoutHandler = async () => {
        try {
            await axios.post(`${API_URL}/users/logout`, {
                withCredentials: true
            });
            dispatch(setAuthUser(null));
            toast.success('Logged out successfully');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred');
            }
            console.error(error);
        }
    };

    return (
        <div className="h-[12vh] shadow-md">
            <div className="w-[80%] mx-auto flex justify-between items-center h-full">
                <h1 className="text-3xl font-bold uppercase">Logo</h1>
                {!user && (
                    <Link href="/auth/signup">
                        <Button size={'lg'} className="cursor-pointer">
                            Register
                        </Button>
                    </Link>
                )}
                {user && (
                    <div className="flex items-center space-x-2">
                        <Avatar
                            onClick={logoutHandler}
                            className="cursor-pointer"
                        >
                            <AvatarFallback className="font-bold text-md uppercase">
                                {user.username.split('')[0]}
                            </AvatarFallback>
                        </Avatar>
                        <Button>Dashboard</Button>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            className="cursor-pointer"
                        >
                            {user.isVerified ? 'Verified' : 'Not Verified'}
                        </Button>
                    </div>
                )}
            </div>
            <h1 className="flex justify-center items-center h-[80vh] text-5xl font-bold">
                HomePage
            </h1>
        </div>
    );
};

export default HomePage;
