import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor para añadir el token a todas las peticiones
axiosInstance.interceptors.request.use(
  config => {
    const publicEndpoints = [
      '/menu/all',
      '/user/login',
      '/banner',
      '/about',
      '/business/info',
      '/category/all',
    ]; // Lista de endpoints públicos
    if (!publicEndpoints.includes(config.url)) {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const bannerService = {
  getBannerImages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/banner`);
      return {
        title: response.data.tittle,
        description: response.data.description,
        images: response.data.images_url.map(url => ({ url })),
      };
    } catch (error) {
      throw new Error('Error fetching banner images: ' + error.message);
    }
  },
};

export const businessService = {
  getBusinessInfo: async () => {
    try {
      const response = await axiosInstance.get('/business/info');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching business info: ' + error.message);
    }
  },

  updateBusinessInfo: async updates => {
    try {
      const response = await axiosInstance.put('/business/update', { updates });
      return response.data;
    } catch (error) {
      throw new Error('Error updating business info: ' + error.message);
    }
  },
};

export const aboutService = {
  getAboutInfo: async () => {
    try {
      const response = await axiosInstance.get('/about');
      return {
        id: response.data.id,
        title: response.data.title,
        about: response.data.about,
      };
    } catch (error) {
      throw new Error('Error fetching about information: ' + error.message);
    }
  },

  updateAboutInfo: async data => {
    try {
      const response = await axiosInstance.put('/about/update', {
        title: data.title,
        aboutText: data.about,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error updating about information: ' + error.message);
    }
  },
};

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get('/category/all');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.ENTITY_NOT_FOUND) {
        return []; // Retorna una lista vacía si no hay categorías
      }
      throw new Error('Error fetching categories: ' + error.message);
    }
  },

  createCategory: async name => {
    try {
      const response = await axiosInstance.post('/category/create', { name });
      return response.data;
    } catch (error) {
      throw new Error('Error creating category: ' + error.message);
    }
  },

  deleteCategory: async id => {
    try {
      await axiosInstance.delete(`/category/delete/${id}`);
    } catch (error) {
      throw new Error('Error deleting category: ' + error.message);
    }
  },

  updateCategory: async (id, name) => {
    try {
      const response = await axiosInstance.put(`/category/update/${id}`, null, {
        params: { name },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error updating category: ' + error.message);
    }
  },
};

export const menuService = {
  getAllMenuItems: async () => {
    try {
      const response = await axiosInstance.get('/menu/all');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching menu items: ' + error.message);
    }
  },

  createMenuItem: async menuItemData => {
    try {
      const response = await axiosInstance.post('/menu/create', menuItemData);
      return response.data;
    } catch (error) {
      throw new Error('Error creating menu item: ' + error.message);
    }
  },

  updateMenuItem: async menuItemData => {
    try {
      const response = await axiosInstance.put('/menu/update', menuItemData);
      return response.data;
    } catch (error) {
      throw new Error('Error updating menu item: ' + error.message);
    }
  },

  deleteMenuItem: async id => {
    try {
      const response = await axiosInstance.delete(`/menu/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting menu item: ' + error.message);
    }
  },

  addMenuItemImage: async (id, url) => {
    try {
      const response = await axiosInstance.post('/menu/add/image', { id, url });
      return response.data;
    } catch (error) {
      throw new Error('Error adding image: ' + error.message);
    }
  },

  removeMenuItemImage: async (id, url) => {
    try {
      const response = await axiosInstance.delete('/menu/remove/image', {
        data: { id, url },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error removing image: ' + error.message);
    }
  },
};

export const imageService = {
  uploadImage: async base64image => {
    try {
      const response = await axiosInstance.post('/image/create', { base64image });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al subir la imagen');
    }
  },

  getAllImages: async () => {
    try {
      const response = await axiosInstance.get('/image/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener las imágenes');
    }
  },

  deleteImage: async id => {
    try {
      await axiosInstance.delete(`/image/delete/${id}`);
    } catch (error) {
      if (error.response?.data?.IMAGE_ERROR) {
        throw new Error(
          'Esta imagen está en uso por un servicio o banner. Por favor, elimine primero la referencia a esta imagen.'
        );
      }
      throw new Error(error.response?.data?.message || 'Error al eliminar la imagen');
    }
  },
};

export const adminBannerService = {
  updateBannerData: async (title, description) => {
    try {
      const response = await axiosInstance.put('/banner/update', {
        tittle: title, // Nota: mantenemos "tittle" porque así lo espera el backend
        description,
      });
      return response.data;
    } catch (error) {
      throw new Error('Error updating banner data: ' + error.message);
    }
  },

  addBannerImage: async url => {
    try {
      const response = await axiosInstance.post('/banner/images', { url });
      return response.data;
    } catch (error) {
      throw new Error('Error adding banner image: ' + error.message);
    }
  },

  removeBannerImage: async url => {
    try {
      const response = await axiosInstance.delete('/banner/images', {
        data: { url },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error removing banner image: ' + error.message);
    }
  },
};

export const productService = {
  // Get all available products with pagination
  getAvailableProducts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/product?page=${page}&size=${size}`);
    return response.data;
  },

  // Get all products with pagination
  getAllProducts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/product/all?page=${page}&size=${size}`);
    return response.data;
  },

  // Get a single product by ID
  getProduct: async id => {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data;
  },

  // Create a new product
  createProduct: async productData => {
    const response = await axiosInstance.post('/product', productData);
    return response.data;
  },

  updateProduct: async (id, updates) => {
    const { id: _, cost, price, ...updateData } = updates;
    const response = await axiosInstance.put(`/product/${id}`, updateData);
    return response.data;
  },

  // Delete a product
  deleteProduct: async id => {
    const response = await axiosInstance.delete(`/product/${id}`);
    return response.data;
  },
};
