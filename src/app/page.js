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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the App</h1>
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
}