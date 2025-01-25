import { useState, useEffect } from 'react';
import { menuService, productService, imageService, categoryService } from '../services/api';

export const useInitialData = () => {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);

        const servicesPromise = menuService.getAllMenuItems().catch(err => {
          console.log('Error loading services:', err);
          return [];
        });

        const productsPromise = productService.getAllProducts().catch(err => {
          console.log('Error loading products:', err);
          return { content: [] };
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
        setProducts(productsData.content || productsData || []);
        setAvailableImages(imagesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error in loadInitialData:', err);
        setError('Error cargando los datos. Por favor, intente nuevamente.');
      }
    };

    loadInitialData();
  }, []);

  return { services, setServices, products, availableImages, categories, error };
};
