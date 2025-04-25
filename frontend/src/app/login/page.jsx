'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:9000/auth/login', { email: form.email, password: form.password});
        console.log(response.data);
        const {token} = response.data;
        localStorage.setItem('token', token);
        router.push('/dashboard');
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center">Welcome back 👋</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            value={form.email}
            className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            value={form.password}
            className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
