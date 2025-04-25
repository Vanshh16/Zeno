import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2  bg-slate-950 border border-slate-800 text-white px-6 py-4 rounded-full shadow-lg flex items-center justify-between max-w-2xl w-[95%] z-50">
      <Link href="/" className="text-3xl font-bold italic text-blue-700">Zeno</Link>

      <div className="space-x-8 text-base hidden sm:flex">
        <Link href="/projects" className="hover:text-blue-400  transition">Projects</Link>
        <Link href="/logs" className="hover:text-blue-400 transition">Logs</Link>
        <Link href="/about" className="hover:text-blue-400 transition">About</Link>
      </div>

      <div className="hidden sm:block">
        <Link href="/login" className="bg-blue-950 text-md hover:bg-blue-900 px-4 rounded-md py-2 font-semibold">
          Login
        </Link>
      </div>
    </nav>
  );
}
