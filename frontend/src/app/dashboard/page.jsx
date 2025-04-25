"use client";
import { useEffect, useState } from "react";
import projects from "../../../data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   fetch('http://localhost:9000/api/me', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setUser(data.user));
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <main className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
