
'use client'; 
import { useAuth, UserButton } from '@clerk/nextjs'

import Link from 'next/link';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isLoaded, userId, sessionId, getToken } = useAuth()


  return (
    <nav className="bg-stone-700 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">Bondhukoi</Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* Navigation Links */}
        <ul
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } sm:flex sm:space-x-6 sm:items-center`}
        >
          <li>
            <Link href="/friend" className="block py-2 px-4 hover:bg-blue-700 rounded">
              Friends
            </Link>
          </li>
          <li>
            <Link href="/faculty" className="block py-2 px-4 hover:bg-blue-700 rounded">
              Faculty info
            </Link>
          </li>
          <li>
            <Link href="/search" className="block py-2 px-4 hover:bg-blue-700 rounded">
              Search
            </Link>
          </li>
        </ul>

        <div className="flex gap-6 items-center">
            {!userId ? (
              <>
                <Link href="/sign-in">
                  <li className='list-none'>Login</li>
                </Link>
                <Link href="/sign-up">
                  <li className='list-none'>Sign Up</li>
                </Link>
              </>
            ):(
              <>
                <Link href="/profile">
                  <li className='list-none'>Profile</li>
                </Link>
                <li className='flex items-center list-none'>
                  <UserButton/>
                </li>
              </>
            )}
          
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
