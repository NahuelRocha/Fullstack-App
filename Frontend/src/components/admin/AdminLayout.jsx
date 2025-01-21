import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BiImageAlt } from 'react-icons/bi';
import { MdOutlineBrandingWatermark, MdDashboard, MdBusinessCenter } from 'react-icons/md';
import { Menu, X, Package, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      icon: <MdDashboard className="w-5 h-5" />,
      title: 'Dashboard',
      desc: 'Dashboard general',
      path: '/admin',
    },
    {
      icon: <BiImageAlt className="w-5 h-5" />,
      title: 'Gestor de Imágenes',
      desc: 'Edita tus imágenes!',
      path: '/admin/images',
    },
    {
      icon: <MdOutlineBrandingWatermark className="w-5 h-5" />,
      title: 'Gestor de Banner',
      desc: 'Edita tu banner!',
      path: '/admin/banner',
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Gestor de Productos',
      desc: 'Edita tus productos!',
      path: '/admin/products',
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Gestor de Servicios',
      desc: 'Edita tus servicios!',
      path: '/admin/services',
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Gestor de Categorías',
      desc: 'Edita tus categorias!',
      path: '/admin/categories',
    },
    {
      icon: <MdBusinessCenter className="w-5 h-5" />,
      title: 'Información del Negocio',
      desc: 'Edita los datos de tu negocio!',
      path: '/admin/business',
    },
    {
      icon: <Info className="w-5 h-5" />, // Necesitarás importar Info de lucide-react
      title: 'Información de About',
      desc: 'Edita la información About!',
      path: '/admin/about',
    },
  ];

  const Dashboard = () => (
    <div className="space-y-4 mt-7">
      <h1 className="text-3xl font-bold text-gray-800 -mt-5 md:mt-1 mb-2 md:mb-6 ml-3">
        ¡Bienvenido al Panel de Administración!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.slice(1).map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white rounded-lg text-brightColor shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-md text-gray-500">{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 z-40 w-64 h-[calc(100vh-20px)] transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 top-[20px]`}
      >
        <div className="h-full px-5 py-10 overflow-y-auto bg-white shadow-lg mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold -mb-3 ml-1">Panel Admin</h2>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-brightColor transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gray-50 text-brightColor'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brightColor'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="p-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-500 hover:text-brightColor transition-colors mt-[20px]"
          >
            <Menu className="mt-4 w-8 h-8" />
          </button>
          <main className="bg-white rounded-xl shadow-lg p-6">
            {location.pathname === '/admin' ? <Dashboard /> : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
