"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import projects from "../../../../data/projects";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  console.log(useParams());

  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(async () => {
  //   try {
  //       const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `http://localhost:9000/p/project-details/${id[0]}`, 
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     if (response.status === 200) {
        
  //       setProject(response.data.project);
  //       console.log(response.data.project);

  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching project from API:", error);
  //   }
  // }, [id]);
  useEffect(() => {
    const p = projects.filter(project =>{
      if(project.id === id[0]) {
        return project;
      }
    } );
    
    setProject(p[0]);
    setLoading(false);

  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <p className="text-purple-400">Loading Project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-red-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-32 pb-8 text-white px-8">
      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
        {/* Left: Screenshot and deployment box */}
        <div className="flex-1 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-md">
        <h1 className="text-3xl font-semibold mb-4">{project.name}</h1>

          <h2 className="text-xl font-medium text-gray-200 mb-4">Production Deployment</h2>

          <div className="w-full h-64 bg-slate-500 rounded-lg border border-gray-800 overflow-hidden mb-6 flex items-center justify-center">
            <img
              src={project.screenshotURL || '/placeholder.png'}
              alt="Deployment Preview"
              className="object-contain max-h-full"
            />
          </div>

          <div className="space-y-2 text-base text-gray-400">
            <p>
              <span className="text-white">Domain: </span>
              {project.subDomain || '—'}
            </p>
            <p>
              <span className="text-white">Deployment: </span>
              <a
                href={`http://${project.subDomain}.localhost:8000`}
                className="text-blue-800 hover:underline"
                target="_blank"
              >
                {project.subDomain}.localhost:8000
              </a>
            </p>
            <p>
              <span className="text-white">Status: </span>
              <span className="text-green-500 font-medium">{project.deploymentStatus}</span>
            </p>
            <p>
              <span className="text-white">Created: </span>
              {new Date(project.createdAt).toDateString()}
            </p>
            <p>
              <span className="text-white">Source: </span>
              main &nbsp;&bull;&nbsp;
              <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-300">{project.commit || '—'}</code>
            </p>
          </div>
        </div>

        {/* Right: Metadata and controls */}
        <div className="flex flex-col justify-between w-full max-w-sm">
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-md space-y-4 text-base text-gray-400">
            <p>
              <span className="text-white">Git Repo: </span>
              <a href={project.gitURL} className="text-blue-400 hover:underline" target="_blank">
                {project.gitURL}
              </a>
            </p>
            <p>
              <span className="text-white">Custom Domain: </span>
              {project.customDomain ? (
                <a href={`http://${project.customDomain}`} className="bg-blue-900 hover:underline">
                  {project.customDomain}
                </a>
              ) : (
                <span className="text-gray-500">Not configured</span>
              )}
            </p>
            <p>
              <span className="text-white">Project ID: </span>
              {project.id}
            </p>
            <button
              onClick={() => router.push(`/logs/${id}`)}
              className="py-2 px-4 text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition font-medium"
            >
              Back
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-1/4 mx-auto gap-4 mt-6">
            <button
              onClick={() => router.push(`/deploy/${project.id}`)}
              className="flex-1 py-2 bg-blue-900 hover:bg-blue-700 rounded-xl transition text-sm font-medium"
            >
              Redeploy
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition text-sm font-medium"
            >
              Back
            </button>
          </div>
    </div>
  );
}
