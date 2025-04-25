export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0f0f0f] p-8 rounded-2xl shadow-lg border border-gray-800">
          {children}
        </div>
      </div>
    );
  }
  