import { useState, useEffect } from 'react';
import { menuService, productService, imageService, categoryService } from '../services/api';

export const useInitialData = () => {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadMoreProducts = async (page = 0, size = 10) => {
    try {
      const productsData = await productService.getAllProducts(page, size);
      setProducts(productsData.content);
      setTotalPages(productsData.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading more products:', err);
      setError('Error cargando más productos. Por favor, intente nuevamente.');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);

        const servicesPromise = menuService.getAllMenuItems().catch(err => {
          console.log('Error loading services:', err);
          return [];
        });

        const productsPromise = productService.getAllProducts(0, 10).catch(err => {
          console.log('Error loading products:', err);
          return { content: [], totalPages: 0 };
        });

        const imagesPromise = imageService.getAllImages().catch(err => {
          console.log('Error loading images:', err);
          return [];
        });

        const categoriesPromise = categoryService.getAllCategories().catch(err => {
          console.log('Error loading categories:', err);
          return [];
        });

        const [servicesData, productsData, imagesData, categoriesData] = await Promise.all([
          servicesPromise,
          productsPromise,
          imagesPromise,
          categoriesPromise,
        ]);

        setServices(servicesData);
        setProducts(productsData.content || []);
        setTotalPages(productsData.totalPages || 0);
        setAvailableImages(imagesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error in loadInitialData:', err);
        setError('Error cargando los datos. Por favor, intente nuevamente.');
      }
    };

    loadInitialData();
  }, []);

  return {
    services,
    setServices,
    products,
    availableImages,
    categories,
    error,
    loadMoreProducts,
    currentPage,
    totalPages,
    setCurrentPage, // Exportar la función para cambiar la página
  };
};
