'use client'; 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Authentication App</h1>
        <p className="text-lg text-white">Checking authentication...</p>
      </div>
    </div>
  );
}