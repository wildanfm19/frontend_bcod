import React from 'react';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import { logo } from "../../utils/constant";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left Section - Logo and Store Name */}
          <div className="flex items-center space-x-4">
              <img
                src={logo}
              />
            <span className="text-gray-300 text-lg">Binusian Store</span>
          </div>

       

          {/* Right Section - Social Media Icons */}
          <div className="flex space-x-4">
            <a 
              href="https://www.instagram.com/bcod.2025/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Instagram size={20} />
            </a>
            
            <a 
              href="https://wa.me/6281210753730" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            Copyright © 2025 B-COD. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;