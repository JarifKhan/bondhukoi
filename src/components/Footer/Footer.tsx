// components/Footer.js
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Bondhukoi</h2>
            <p className="text-sm">© 2025 All Rights Reserved</p>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-400">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-gray-400">
              Contact
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" className="hover:text-gray-400">
              <FaTwitter />
            </a>
            <a href="https://github.com" target="_blank" className="hover:text-gray-400">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-gray-400">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
