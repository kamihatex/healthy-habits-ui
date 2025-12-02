import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HabitsDashboard from "../components/HabitDashboard";

const Home: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
        <div className="px-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="flex justify-start">
              <a className="flex items-center" href="/">
                <h1 className="text-2xl font-bold text-green-600">
                  Healthy Habits
                </h1>
              </a>
            </div>
            <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
              <a
                aria-current="page"
                className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                href="#"
              >
                Home
              </a>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                href="#"
              >
                Tracking
              </a>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500 text-white inline-flex items-center justify-center rounded-xl hover:bg-red-600 text-sm font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 bg-neutral-100">
        <HabitsDashboard />
      </main>
    </div>
  );
};

export default Home;
