import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Edit, Image as ImageIcon } from 'lucide-react';
import { menuService, productService, imageService, categoryService } from '../../services/api';
import ProductSelectorModal from '../ProductSelectorModal';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    contentItems: [],
    imageUrls: [],
    newCategoryId: 1,
  });
  const [currentCustomItem, setCurrentCustomItem] = useState({
    quantity: '',
    name: '',
    price: 0,
  });

  useEffect(() => {
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

    loadInitialData();
  }, []);

  // Update content items when products or custom items change
  useEffect(() => {
    const productContentItems = selectedProducts.map(p => `${p.quantity} ${p.name}`);
    const allContentItems = [...productContentItems];

    setFormData(prev => ({
      ...prev,
      contentItems: allContentItems,
    }));
  }, [selectedProducts]);

  const handleAddCustomContentItem = () => {
    const { quantity, name, price } = currentCustomItem;

    // Validate input
    if (name.trim() && quantity > 0) {
      const newCustomItem = {
        ...currentCustomItem,
        isCustom: true,
        id: `custom-${Date.now()}`, // Unique identifier for custom items
      };

      // Update selected products (which now includes both product and custom items)
      const updatedSelectedProducts = [...selectedProducts, newCustomItem];
      setSelectedProducts(updatedSelectedProducts);

      // Reset current custom item input
      setCurrentCustomItem({
        quantity: 1,
        name: '',
        price: 0,
      });

      // Update service from products (now including custom items)
      updateServiceFromProducts(updatedSelectedProducts);
    }
  };

  const handleAddProduct = product => {
    setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    updateServiceFromProducts([...selectedProducts, { ...product, quantity: 1 }]);
  };

  const updateServiceFromProducts = products => {
    const contentItems = products.map(p =>
      p.isCustom ? `${p.quantity} ${p.name}` : `${p.quantity} ${p.name}`
    );
    const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    setFormData(prev => ({
      ...prev,
      contentItems,
      price: totalPrice,
    }));
  };

  const handleImageAdd = imageUrl => {
    if (formData.imageUrls.length < 3 && !formData.imageUrls.includes(imageUrl)) {
      setFormData({
        ...formData,
        imageUrls: [...formData.imageUrls, imageUrl],
      });
    }
  };

  const handleImageRemove = imageUrl => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter(url => url !== imageUrl),
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedPrice = Math.round(formData.price);
      if (editingService) {
        await menuService.updateMenuItem({
          id: editingService.id,
          updates: {
            title: formData.title,
            subtitle: formData.subtitle,
            description: formData.description,
            price: updatedPrice,
            contentItems: formData.contentItems,
            imageUrls: formData.imageUrls,
            category: formData.category,
          },
        });
        setSuccessMessage('Servicio actualizado con éxito');
      } else {
        await menuService.createMenuItem(formData);
        setSuccessMessage('Servicio creado con éxito');
      }

      // Recargar servicios y limpiar formulario
      const servicesData = await menuService.getAllMenuItems();
      setServices(servicesData);
      resetForm();
      scrollToTop(); // Añadir scroll al top

      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      price: 0,
      contentItems: [],
      imageUrls: [],
      newCategoryId: 1,
    });
    setSelectedProducts([]);
    setEditingService(null);
  };

  const parseContentItemQuantity = contentItem => {
    const match = contentItem.match(/^(\d+)\s+(.+)$/);
    if (match) {
      return {
        quantity: parseInt(match[1]),
        productName: match[2],
      };
    }
    return null;
  };

  const findProductByName = (productName, productsList) => {
    return productsList.find(p => p.name === productName);
  };

  const reconstructSelectedProducts = (contentItems, productsList) => {
    return contentItems
      .map(item => {
        const parsed = parseContentItemQuantity(item);
        if (!parsed) return null;

        // Buscar en la lista de productos
        const product = findProductByName(parsed.productName, productsList);

        if (product) {
          return {
            ...product,
            quantity: parsed.quantity,
          };
        }

        // Si no se encuentra en la lista de productos, asumir que es personalizado
        return {
          id: `custom-${Date.now()}`, // Generar un nuevo ID para elementos personalizados
          name: parsed.productName,
          quantity: parsed.quantity,
          price: 0, // No se puede inferir el precio aquí, debería recuperarse de otra forma si es posible
          isCustom: true,
        };
      })
      .filter(item => item !== null);
  };

  const handleEditService = service => {
    setFormData({
      title: service.title,
      subtitle: service.subtitle,
      description: service.description,
      price: service.price,
      contentItems: service.contentItems,
      imageUrls: service.imageUrls,
      newCategoryId: service.category_id,
    });

    // Reconstruir productos seleccionados incluyendo personalizados
    const reconstructedProducts = reconstructSelectedProducts(service.contentItems, products);
    setSelectedProducts(reconstructedProducts);

    setEditingService(service);
    scrollToTop();
  };

  const handleCustomItemChange = (field, value) => {
    setCurrentCustomItem(prev => ({
      ...prev,
      [field]: field === 'quantity' ? value || '' : value,
    }));
  };

  if (error)
    return (
      <div className="p-4 text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );

  return (
    <div className="container mx-auto mt-0 md:mt-7">
      <h1 className="text-3xl font-bold ml-5 md:ml-4">Gestor de Servicios</h1>

      {error ? (
        <div className="p-4 text-red-500">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="space-y-8 w-full">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 border border-green-400 rounded-lg">
              {successMessage}
            </div>
          )}
          {/* Formulario de creación/edición */}
          <div className="bg-white rounded-xl shadow-lg p-2 md:p-4 w-full md:-mt-1">
            <h2 className="flex justify-center text-gray-700 text-lg md:text-xl font-semibold mb-4">
              {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-md font-bold">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-md font-bold">Subtítulo</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-md font-bold">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-md font-bold">Categoría</label>
                <select
                  value={formData.newCategoryId}
                  onChange={e => setFormData({ ...formData, newCategoryId: e.target.value })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-2 px-2"
                  required
                >
                  <option value="" className="text-md">
                    Seleccione una categoría
                  </option>
                  {categories.map(category => (
                    <option className="capitalize text-sm" key={category.id} value={category.id}>
                      {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de productos y elementos personalizados */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
                  <h3 className="block py-1 text-gray-700 text-xl font-bold text-center md:text-left ">
                    Lista de Productos
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(true)}
                      className="px-4 py-2 mb-1 flex items-center justify-center bg-brightColor text-white rounded-lg hover:bg-opacity-90"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Añadir Producto
                    </button>
                  </div>
                </div>

                {/* Formulario para añadir elementos personalizados */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr_2fr_auto] gap-2 mb-4">
                  <input
                    type="number"
                    value={currentCustomItem.quantity}
                    onChange={e => handleCustomItemChange('quantity', e.target.valueAsNumber)}
                    placeholder="Cantidad"
                    className="w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-2"
                  />
                  <input
                    type="text"
                    value={currentCustomItem.name}
                    onChange={e => handleCustomItemChange('name', e.target.value)}
                    placeholder="Nombre del elemento"
                    className="w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-2"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentCustomItem.price}
                    onChange={e => handleCustomItemChange('price', e.target.value)}
                    placeholder="Precio"
                    className="w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomContentItem}
                    className="w-full px-4 py-2 bg-brightColor text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center"
                    disabled={!currentCustomItem.name}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Añadir
                  </button>
                </div>

                {/* Lista de productos y elementos personalizados seleccionados */}
                <div className="space-y-3">
                  {selectedProducts.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                    >
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => {
                          const newSelectedProducts = [...selectedProducts];
                          newSelectedProducts[index].quantity = parseInt(e.target.value);
                          setSelectedProducts(newSelectedProducts);
                          updateServiceFromProducts(newSelectedProducts);
                        }}
                        className="w-16 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-0.5"
                      />
                      <span className="flex-1">{item.name}</span>
                      <span className="text-gray-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newSelectedProducts = selectedProducts.filter(
                            (_, i) => i !== index
                          );
                          setSelectedProducts(newSelectedProducts);
                          updateServiceFromProducts(newSelectedProducts);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Modal de selección de productos */}
                <ProductSelectorModal
                  isOpen={isProductModalOpen}
                  onClose={() => setIsProductModalOpen(false)}
                  products={products}
                  selectedProducts={selectedProducts}
                  onSelectProduct={handleAddProduct}
                />
              </div>

              {/* Gestor de imágenes */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Imágenes del servicio ({formData.imageUrls.length}/3)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Imágenes seleccionadas */}
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Service ${index + 1}`}
                        className="w-full h-24 md:h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(url)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Selector de imágenes disponibles */}
                  {formData.imageUrls.length < 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableImages
                        .filter(image => !formData.imageUrls.includes(image.url))
                        .map(image => (
                          <button
                            key={image.id}
                            type="button"
                            onClick={() => handleImageAdd(image.url)}
                            className="relative group"
                          >
                            <img
                              src={image.url}
                              alt={`Available ${image.id}`}
                              className="w-full h-24 md:h-48 object-cover rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Plus className="w-8 h-8 text-gray-600 group-hover:text-brightColor" />
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Precio total y botones */}
              <div className="space-y-4 pt-6 border-t">
                <div className="text-2xl font-bold flex justify-center">
                  Total: ${formData.price}
                </div>
                <div className="space-x-3 space-y-2 md:space-x-6 flex flex-col md:justify-center">
                  <button
                    type="submit"
                    className="py-2 text-xl bg-brightColor text-white rounded-lg hover:bg-opacity-90"
                  >
                    {editingService ? 'Guardar Servicio' : 'Crear Servicio'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-1 py-1 text-md text-gray-700 hover:text-red-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Lista de servicios */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-3 md:mb-2">Servicios Existentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {services.map(service => (
                <div key={service.id} className="bg-white rounded-xl shadow-xl border-2 p-6 w-full">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="text-md text-gray-900">{service.subtitle}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-2 text-gray-600 hover:text-brightColor"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('¿Está seguro de eliminar este servicio?')) {
                            await menuService.deleteMenuItem(service.id);
                            setServices(services.filter(s => s.id !== service.id));
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 font-semibold mb-2">${service.price}</p>
                  {service.imageUrls.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {service.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${service.title} ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {service.contentItems.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        <span className="text-customColor">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
