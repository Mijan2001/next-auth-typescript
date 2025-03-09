import { Toaster } from 'react-hot-toast';
import ClientProvider from '@/hoc/ClientProvider';
import type { Metadata } from 'next';
// we can add just font name here, everything will be automatic download, no need to manually download, just font name=============
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

// Metadata is used for SEO purpose, and we can add title and description here================
export const metadata: Metadata = {
    title: 'Advanced Authentication',
    description: 'MERN stack authentication with Next.js and Passport.js'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                // here we can add font name more that one at a time=======
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ClientProvider>{children}</ClientProvider>
                <Toaster position="top-right" reverseOrder={false} />
            </body>
        </html>
    );
}
