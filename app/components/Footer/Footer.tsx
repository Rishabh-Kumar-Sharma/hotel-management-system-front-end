export const Footer = () => {
  return (
    <footer>
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20">
        <div className="min-h-[160px] flex flex-col items-center justify-center text-center px-6">
          <h3 className="text-xl font-semibold text-white tracking-wide">
            HotelFlow
          </h3>

          <p className="text-gray-400 text-sm mt-2 max-w-md">
            Smart, scalable and modern hotel management system built for
            real-world operations.
          </p>

          <div className="flex gap-6 mt-6 text-sm text-gray-300">
            <a href="#features" className="hover:text-indigo-300 transition">
              Features
            </a>
            <a href="#about" className="hover:text-indigo-300 transition">
              About
            </a>
            <a href="/dashboard" className="hover:text-indigo-300 transition">
              Dashboard
            </a>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} HotelFlow. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
