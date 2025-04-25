'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import logsArray from '../../../../data/logs';
const socket = io('http://localhost:9001');

export default function DeploymentLogsPage() {
  const { id } = useParams(); 
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const [readyButton, setReadyButton] = useState(false);

  const router = useRouter();
  // useEffect(() => {
  //   const channel = `logs:${id}`;
  //   socket.emit("subscribe", channel);
  //   socket.on("message", (msg) => {
  //     setLogs((prevLogs) => [...prevLogs, msg]);
  //     setStatus("connected");
  //   });

  //   setTimeout(() => {
  //     setReadyButton(true);
  //   }, 5000);
  //   return () => {
  //     socket.off('message');
  //   };

  // }, [id]);

  useEffect(() => {
    setLogs(logsArray)
  }, [id])
  

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-8 px-8">
      <h1 className="text-2xl font-semibold mb-4">Deployment Logs</h1>
      <p className="text-sm text-gray-400 mb-6">Deployment ID: {id}</p>

      <div className="bg-[#111] rounded-xl border border-gray-800 p-4 max-h-[60vh] overflow-y-scroll text-sm space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-500">Waiting for logs...</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="text-gray-300 font-mono">{log}</div>
          ))
        )}
      </div>

      <div className="mt-6 text-sm text-gray-400">
        <span>Status: </span>
        <span className="text-purple-400 font-medium">{status}</span>
      </div>
      <div className="mt-6 text-sm text-gray-400">
        {readyButton && <span className="text-purple-400 font-medium">Your project is ready!</span>}
        {readyButton && (
          <button
            className="w-full rounded-xl bg-blue-400 text-white font-semibold p-2"
            onClick={() => {router.push(`/project/${id}`)}}> Go to your Project</button>
            )}
      </div>
    </div>
  );
}
