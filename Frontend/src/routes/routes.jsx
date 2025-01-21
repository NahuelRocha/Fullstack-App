import { Navigate } from 'react-router-dom';
import Login from '../components/Login';
import AdminLayout from '../components/admin/AdminLayout';
import BannerEditor from '../components/admin/BannerEditor';
import ImageManager from '../components/admin/ImageManager';
import ProductManager from '../components/admin/ProductManager';
import BusinessManager from '../components/admin/BusinessManager';
import ServiceManager from '../components/admin/ServiceManager';
import CategoryManager from '../components/admin/CategoryManager';
import AboutManager from '../components/admin/AboutManager';

export const publicRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
];

export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'images', element: <ImageManager /> },
      { path: 'banner', element: <BannerEditor /> },
      { path: 'products', element: <ProductManager /> },
      { path: 'services', element: <ServiceManager /> },
      { path: 'categories', element: <CategoryManager /> },
      { path: 'business', element: <BusinessManager /> },
      { path: 'about', element: <AboutManager /> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
];
