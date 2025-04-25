"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeployPage() {
  const [gitURL, setGitURL] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleDeploy = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log(token);
    
    const response = await axios.post(
      "http://localhost:9000/p/project",
      {
        name,
        gitURL,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Response: ", response);

    if (response.status === 200) {
      const projectId = response.data.data.project.id;
      const res = await axios.post(
        "http://localhost:9000/p/deploy",
        {
          projectId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Res", res);
      
      if (res.status === 200) {
        router.push(`/logs/${projectId}`)
      } else {
        console.log(res.data.error);
      }
    } else {
        console.log(response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center bg-gray-950 text-white px-6 py-10">
            <h1 className="text-3xl font-bold mb-6">Deploy a New Project</h1>

      <div className="w-1/3 bg-slate-950 p-10 border border-slate-900 rounded-lg space-y-5">
        <div className="">
          <label className="block text-base mb-1 text-gray-400">
            Project Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-2 bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="my-awesome-app"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-400">
            Git Repository URL
          </label>
          <input
            type="url"
            value={gitURL}
            onChange={(e) => setGitURL(e.target.value)}
            className="w-full rounded-xl px-4 py-2 bg-[#111] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <button
            onClick={handleDeploy}
          disabled={loading}
          className="bg-blue-900 hover:bg-blue-700 px-5 py-2 rounded-xl text-white font-medium transition disabled:opacity-50"
        >
          {loading ? "Deploying..." : "Deploy Now"}
        </button>
      </div>
    </div>
  );
}
