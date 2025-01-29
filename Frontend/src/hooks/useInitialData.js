import { useState, useEffect, useCallback } from 'react';
import { menuService, productService, imageService, categoryService } from '../services/api';

export const useInitialData = () => {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allProducts, setAllProducts] = useState([]);

  // Función para cargar los productos de una página específica
  const loadMoreProducts = useCallback(async (page = 0, size = 10) => {
    try {
      const productsData = await productService.getAllProducts(page, size);

      // Actualizar los productos de la página actual
      setProducts(productsData.content);

      // Mantener un registro de todos los productos que hemos visto
      setAllProducts(prevAllProducts => {
        const newProducts = [...prevAllProducts];
        productsData.content.forEach(product => {
          const existingIndex = newProducts.findIndex(p => p.id === product.id);
          if (existingIndex >= 0) {
            newProducts[existingIndex] = product;
          } else {
            newProducts.push(product);
          }
        });
        return newProducts;
      });

      setTotalPages(productsData.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error loading more products:', err);
      setError('Error cargando más productos. Por favor, intente nuevamente.');
    }
  }, []);

  // Función para obtener un producto por ID de la lista completa
  const getProductById = useCallback(
    id => {
      return allProducts.find(p => p.id === id);
    },
    [allProducts]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setError(null);

        const servicesPromise = menuService.getAllMenuItems().catch(err => {
          console.log('Error loading services:', err);
          return [];
        });

        const productsPromise = productService.getAllProducts(0, 100).catch(err => {
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
        setAllProducts(productsData.content || []); // Añadir esta línea
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
    allProducts, // Exportamos allProducts
    getProductById,
    availableImages,
    categories,
    error,
    loadMoreProducts,
    currentPage,
    totalPages,
    setCurrentPage, // Exportar la función para cambiar la página
  };
};
