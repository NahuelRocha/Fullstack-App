import { useState, useEffect } from 'react';
import { businessService } from '../services/api';
import { Facebook, Instagram, Mail, Phone, Clock, MapPin, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const data = await businessService.getBusinessInfo();
        setBusinessInfo(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching business info:', err);
      }
    };

    fetchBusinessInfo();
  }, []);

  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6 text-center rounded-t-3xl">
        <p className="text-red-400">Error loading business information</p>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black text-white p-6 text-center rounded-t-3xl">
        <p className="animate-pulse">Loading business information...</p>
      </div>
    );
  }

  return (
    <footer className="relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-customColor to-transparent" />

      <div className="bg-gradient-to-b from-gray-900 to-black text-gray-200 rounded-t-3xl mt-8 md:mt-0">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8 md:px-16">
            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-customColor to-white bg-clip-text text-transparent">
                {businessInfo.welcome}
              </h2>
              <p className="text-sm leading-relaxed opacity-80 hover:opacity-100 transition-opacity">
                {businessInfo.about}
              </p>
            </div>

            {/* Business Hours Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-customColor">Atención</h2>
              <nav className="space-y-3">
                <a className="flex items-center gap-2 hover:text-customColor transition-colors duration-300">
                  <Clock className="w-4 h-4" />
                  <span>{businessInfo.businessDays}</span>
                </a>
                <a className="flex items-center gap-2 hover:text-customColor transition-colors duration-300">
                  <Clock className="w-4 h-4" />
                  <span>{businessInfo.businessHours}</span>
                </a>
                <a className="flex items-center gap-2 hover:text-customColor transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                  <span>{businessInfo.address}</span>
                </a>
                <a className="flex items-center gap-2 hover:text-customColor transition-colors duration-300">
                  <Clock className="w-4 h-4" />
                  <span>{businessInfo.deliveryHours}</span>
                </a>
              </nav>
            </div>

            {/* Menu Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-customColor">Menu</h2>
              <nav className="space-y-4">
                <Link
                  to="/menu"
                  className="flex items-center gap-2 hover:text-customColor transition-colors duration-300"
                >
                  <Menu className="w-4 h-4" />
                  <span>Ver Menú</span>
                </Link>
                <Link
                  to="/custom"
                  className="flex items-center gap-2 hover:text-customColor transition-colors duration-300"
                >
                  <Menu className="w-4 h-4" />
                  <span>Arma tu pedido</span>
                </Link>
              </nav>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-customColor">Contactanos</h2>
              <nav className="space-y-3">
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="flex items-center gap-2 hover:text-customColor transition-colors duration-300"
                >
                  <Mail className="w-4 h-4" />
                  <span>{businessInfo.email}</span>
                </a>
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center gap-2 hover:text-customColor transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" />
                  <span>{businessInfo.phone}</span>
                </a>
                <a
                  href={businessInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-customColor transition-colors duration-300"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <a
                  href={businessInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-customColor transition-colors duration-300"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-800">
            <p className="text-center py-6 text-sm opacity-80">
              @copyright developed by{' '}
              <a
                href="https://www.linkedin.com/in/rocha-nahuel/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-customColor hover:text-brightColor transition-colors duration-300"
              >
                Rocha Nahuel
              </a>{' '}
              | All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
