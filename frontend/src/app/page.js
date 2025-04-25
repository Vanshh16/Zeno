"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(async () => {
    try {
      const response = await axios.get("http://localhost:9000/u/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success === false) {
        throw new Error();
      } 
      else {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
    setChecking(false);
  }, []);

  if (checking) return <div className="text-center mt-20">Loading...</div>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <h1 className="text-5xl font-bold mb-4">Deploy Anything, Anytime</h1>
      <p className="text-lg mb-8 text-gray-400">
        Fast, reliable deployments for your projects – like Vercel.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/signup")}
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200"
        >
          Get Started
        </button>
        <button
          onClick={() => router.push("/login")}
          className="border border-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-black"
        >
          Login
        </button>
      </div>
    </main>
  );
}
