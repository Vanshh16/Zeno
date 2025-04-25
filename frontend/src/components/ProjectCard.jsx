"use client";

import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl px-6 pt-5 pb-2 shadow-md hover:shadow-lg transition-shadow duration-200 w-[500px] max-w-full">
      {/* Header with avatar and name */}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-500 flex items-center justify-center text-white font-bold text-sm">
          {project.name[0].toUpperCase()}
        </div>
        <div>
          <Link href={`/project/${project.id}`}><h2 className="text-xl cursor-pointer hover:underline text-white">{project.name}</h2></Link>
          <p className="text-sm text-gray-400 break-all">{project.gitURL}</p>
        </div>
      </div>

      <div className="text-sm flex flex-col text-gray-300 space-y-1 mb-5">
        <div className="flex justify-between">
          <p>
            <span className="text-gray-500">Subdomain:</span>{" "}
            {project.subDomain}
          </p>
          <p>
            <span className="text-gray-500">Custom Domain:</span>{" "}
            {project.customDomain || "—"}
          </p>
        </div>
        <div className="flex justify-between">
          <p>
            <span className="text-gray-500">Created:</span>{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="text-gray-500">Updated:</span>{" "}
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Visit Button */}
      <div className="flex my-2 justify-start">
        <a
          href={`https://${
            project.customDomain || project.subDomain + ".vercel.app"
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base bg-blue-950 hover:bg-blue-900 text-white px-5 py-1 rounded transition-all"
        >
          Visit
        </a>
      </div>
    </div>
  );
}
