export default function Footer() {
    return (
      <footer className="bg-gray-900 absolute bottom-0 w-full text-gray-400 text-sm py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Zeno. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  