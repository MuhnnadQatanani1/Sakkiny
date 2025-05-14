import React from "react";
import { Link } from "react-router-dom";

export const Error404 = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-6">
      <h1 className="text-6xl text-red-600">404</h1>
      <h2 className="text-4xl text-red-500">Page Not Found</h2>
      <p className="text-2xl text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link to='/' className="px-4 py-2 bg-red-500 text-white rounded-md">Home</Link>
    </div>
  );
};
