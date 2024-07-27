import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <nav className="bg-gray-800 p-4 fixed w-full top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            key="home"
            to="/"
            className="text-white hover:text-gray-300 font-bold text-xl"
          >
            Home
          </Link>
          <Link
            key="training"
            to="/training"
            className="text-white hover:text-gray-300 font-bold text-xl"
          >
            Training
          </Link>
          <Link
            key="recognition"
            to="/recognition"
            className="text-white hover:text-gray-300 font-bold text-xl"
          >
            Recognition
          </Link>
          <Link
            key="results"
            to="/results"
            className="text-white hover:text-gray-300 font-bold text-xl"
          >
            Results
          </Link>
        </div>
      </nav>
      <div className="mt-8 p-8">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
