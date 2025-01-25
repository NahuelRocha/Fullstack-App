import { menuService, productService, imageService, categoryService } from './api';
import { useState } from 'react';

function useServiceManager() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);

  const loadInitialData = async () => {
    try {
      setError(null);

      // Realizar las llamadas por separado para mejor manejo de errores
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

  return { services, error, loadInitialData, categories, products, availableImages };
}
