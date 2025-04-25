import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-purple-600 mb-6">MyPlatform</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
            <Link href="/projects" className="text-gray-700 hover:text-purple-600">Projects</Link>
            <Link href="/settings" className="text-gray-700 hover:text-purple-600">Settings</Link>
          </nav>
        </div>
        <div>
          <button
            // onClick={() => {
            //   localStorage.removeItem('token');
            //   window.location.href = '/login';
            // }}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
