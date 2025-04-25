'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   // Fetch user from protected endpoint
  //   fetch('http://localhost:9000/api/me', {
  //     credentials: 'include',
  //   })
  //     .then(res => {
  //       if (!res.ok) throw new Error('Unauthorized');
  //       return res.json();
  //     })
  //     .then(data => setUser(data.user))
  //     .catch(() => router.push('/login'));
  // }, []);

  if (!user) return <div className="min-h-screen flex justify-center items-center"><p>Loading...</p></div>;

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} 👋</h1>

        <div className="flex gap-6 mb-10">
          <button
            className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200"
            onClick={() => router.push('/new-project')}
          >
            + New Project
          </button>
          <button
            className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
            onClick={() => router.push('/deployments')}
          >
            View Deployments
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-400">You don't have any projects yet.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
