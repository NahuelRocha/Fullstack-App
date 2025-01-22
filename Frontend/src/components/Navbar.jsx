import { useState, useEffect } from 'react';
import { Link as ScrollLink, scroller } from 'react-scroll';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { Menu, X, Home, PackageSearch, Info, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { categoryService } from '../services/api';
import { authService } from '../services/authService';
import PropTypes from 'prop-types';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [menu, setMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = () => {
        const sections = ['home', 'menu', 'custom', 'about'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const top = element.offsetTop;
            const height = element.clientHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setActiveSection('');
    }
  }, [location.pathname]);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const scrollToSection = sectionId => {
    if (location.pathname.startsWith('/admin') || location.pathname !== '/') {
      // Si estamos en admin o en una ruta específica, navegamos directamente
      navigate(`/${sectionId}`);
    } else {
      // Si estamos en la landing page (/), usamos scroll
      scroller.scrollTo(sectionId, {
        duration: 800,
        delay: 100,
        smooth: 'easeInOutQuart',
      });
      setActiveSection(sectionId);
    }
    closeMenu();
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
    closeMenu();
  };

  if (!categories) {
    return (
      <div className="bg-black text-white p-4 text-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="fixed w-full z-50 top-0">
      <div className="bg-gradient-to-b from-gray-900 to-black/90 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-16">
            {/* Logo */}
            <div
              className="ml-5 md:ml-16 flex items-center gap-9 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img src={logo} alt="Logo" className="h-2 w-3 mt-1 ml-10" />
              <h1 className="text-2xl  -ml-6 -mr-6 md:text-3xl font-semibold text-white">
                Daniela Eventos
              </h1>
              <img src={logo} alt="Logo" className="h-2 w-3 mt-1" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['home', 'menu', 'custom', 'about'].map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-3 py-2 text-lg transition-colors duration-300
                    ${
                      activeSection === section
                        ? 'text-customColor'
                        : 'text-gray-200 hover:text-brightColor'
                    }`}
                >
                  {section === 'home'
                    ? 'Inicio'
                    : section === 'menu'
                    ? 'Menú'
                    : section === 'custom'
                    ? 'Arma tu pedido'
                    : 'Nosotros'}
                </button>
              ))}

              {isAuthenticated && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-lg text-gray-200 hover:text-customColor transition-colors duration-300"
                >
                  Panel
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-6 py-2 bg-customColor hover:bg-brightColor
                    text-white rounded-lg transition-colors duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={handleChange}
              className="md:hidden p-2 rounded-lg text-gray-200 hover:text-customColor transition-colors"
            >
              {menu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Gradient border bottom */}
      <div className="h-px bg-gradient-to-r from-transparent via-customColor to-transparent" />
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${menu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
      >
        <div
          className={`absolute right-0 h-full w-72 bg-gradient-to-b from-gray-900 to-black transform transition-transform duration-300
            ${menu ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-customColor">Menú</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg text-gray-200 hover:text-customColor transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {['home', 'menu', 'custom', 'about'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`flex items-center w-full p-3 rounded-lg transition-all
                  ${
                    activeSection === section
                      ? 'bg-black/50 text-customColor'
                      : 'text-gray-200 hover:bg-black/80 hover:text-customColor'
                  }`}
              >
                {section === 'home' && <Home className="w-5 h-5 mr-3" />}
                {section === 'menu' && <PackageSearch className="w-5 h-5 mr-3" />}
                {section === 'custom' && <PackageSearch className="w-5 h-5 mr-3" />}
                {section === 'about' && <Info className="w-5 h-5 mr-3" />}
                <span className="font-medium text-xl">
                  {section === 'home'
                    ? 'Inicio'
                    : section === 'menu'
                    ? 'Menú'
                    : section === 'custom'
                    ? 'Arma tu pedido'
                    : 'Nosotros'}
                </span>
              </button>
            ))}

            {isAuthenticated && (
              <Link
                to="/admin"
                className="flex items-center w-full p-3 rounded-lg text-gray-200 hover:bg-black/30 hover:text-customColor transition-all"
                onClick={closeMenu}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span className="font-medium">Panel</span>
              </Link>
            )}

            <div className="pt-4 mt-4 border-t border-gray-800">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-red-950/30 transition-all"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    closeMenu();
                  }}
                  className="flex items-center w-full p-3 rounded-lg bg-customColor hover:bg-brightColor
                    text-white transition-colors duration-300"
                >
                  <LogIn className="w-5 h-5 mr-3" />
                  <span className="font-medium">Iniciar Sesión</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Navbar;
