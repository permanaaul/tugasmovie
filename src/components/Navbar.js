import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/images/logomovie.png" alt="MovieApp Logo" width={40} height={40} />
          <div className="text-2xl font-bold ml-2">MovieApp</div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <div className="flex items-center space-x-2 hover:text-gray-400 transition-colors cursor-pointer">
              <FaSignInAlt />
              <span className="text-lg">Login</span>
            </div>
          </Link>
          <Link href="/register">
            <div className="flex items-center space-x-2 hover:text-gray-400 transition-colors cursor-pointer">
              <FaUserPlus />
              <span className="text-lg">Register</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
