import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import { menuService } from '../../services/api';
import ProductSelectorModal from '../ProductSelectorModal';
import { useInitialData } from '../../hooks/useInitialData';
import { useServiceForm } from '../../hooks/useServiceForm';
import {
  reconstructSelectedProducts,
  formatContentItems,
  calculateTotalPrice,
} from '../../utils/serviceUtils';

const ServiceManager = () => {
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const {
    services,
    setServices,
    products,
    allProducts,
    availableImages,
    categories,
    error: initialError,
    loadMoreProducts,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useInitialData();

  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    price: 0,
    contentItems: [],
    imageUrls: [],
    category: 1,
  };

  const {
    formData,
    setFormData,
    selectedProducts,
    setSelectedProducts,
    currentCustomItem,
    setCurrentCustomItem,
    handleAddCustomContentItem,
    handleAddProduct,
    handleImageAdd,
    handleImageRemove,
    resetForm,
  } = useServiceForm(initialFormState);

  // Update content items when products or custom items change
  useEffect(() => {
    const productContentItems = selectedProducts.map(p => `${p.quantity} ${p.name}`);
    const allContentItems = [...productContentItems];
    console.log('Buscando precio para:', selectedProducts);
    setFormData(prev => ({
      ...prev,
      contentItems: allContentItems,
    }));
  }, [selectedProducts, setFormData]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const productContentItems = selectedProducts.map(p => `${p.quantity} ${p.name}`);
      const allContentItems = [...productContentItems];
      setFormData(prev => ({
        ...prev,
        contentItems: allContentItems,
      }));
    }
  }, [selectedProducts, setFormData]);

  useEffect(() => {
    if (editingService) {
      const reconstructedProducts = reconstructSelectedProducts(
        editingService.contentItems,
        allProducts // Usar allProducts en lugar de products
      );
      setSelectedProducts(reconstructedProducts);
    }
  }, [editingService, allProducts]);

  const updateServiceFromProducts = products => {
    const contentItems = formatContentItems(products);
    const totalPrice = calculateTotalPrice(products);

    setFormData(prev => ({
      ...prev,
      contentItems,
      price: totalPrice,
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedPrice = Math.round(formData.price);
      const formattedContentItems = formatContentItems(selectedProducts);

      let updatedService;

      if (editingService) {
        updatedService = await menuService.updateMenuItem({
          id: editingService.id,
          updates: {
            ...formData,
            price: updatedPrice,
            contentItems: formattedContentItems,
          },
        });

        setServices(prevServices =>
          prevServices.map(service => (service.id === editingService.id ? updatedService : service))
        );
        setSuccessMessage('Servicio actualizado con éxito');
      } else {
        const newService = await menuService.createMenuItem(formData);
        setServices(prevServices => [...prevServices, newService]);
        setSuccessMessage('Servicio creado con éxito');
      }

      resetForm();
      setEditingService(null);
      scrollToTop();

      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditService = service => {
    console.log('Contenido antes de reconstrucción:', service.contentItems);
    const reconstructedProducts = reconstructSelectedProducts(service.contentItems, allProducts); // Cambiar products por allProducts
    console.log('Productos reconstruidos:', reconstructedProducts);
    setFormData(prev => ({
      ...prev,
      title: service.title,
      subtitle: service.subtitle,
      description: service.description,
      price: service.price,
      contentItems: service.contentItems,
      imageUrls: service.imageUrls,
      category: service.category_id,
    }));
    console.log('ANTES de setSelectedProducts:', selectedProducts);
    setSelectedProducts(reconstructedProducts);
    console.log('DESPUÉS de setSelectedProducts:', reconstructedProducts);
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
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-md font-bold">Subtítulo</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
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
                />
              </div>

              <div>
                <label className="block text-gray-700 text-md font-bold">Categoría</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-2 px-2"
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
                    className="w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  />
                  <input
                    type="text"
                    value={currentCustomItem.name}
                    onChange={e => handleCustomItemChange('name', e.target.value)}
                    placeholder="Nombre del elemento"
                    className="w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentCustomItem.price}
                    onChange={e => handleCustomItemChange('price', e.target.value)}
                    placeholder="Precio"
                    className="w-full rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomContentItem}
                    className="px-4 py-2 bg-brightColor text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center"
                    disabled={!currentCustomItem.name}
                  >
                    <Plus className="-ml-1 w-4 h-4 mr-1" />
                    Añadir
                  </button>
                </div>

                {/* Lista de productos y elementos personalizados seleccionados */}
                <div className="space-y-3">
                  {selectedProducts.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                    >
                      {/* Campo de cantidad */}
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
                        className="w-12 rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-0.5 text-center"
                      />

                      {/* Nombre del producto (con truncado y tooltip) */}
                      <span className="flex-1 text-md truncate" title={item.name}>
                        {item.name}
                      </span>

                      {/* Precio total */}
                      <span className="text-gray-600 text-md whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Botón de eliminación */}
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
                        <Trash2 className="w-4 h-4" /> {/* Icono más pequeño */}
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
                  loadMoreProducts={loadMoreProducts}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={page => setCurrentPage(page)} // Pasar la función para cambiar la página
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
              <div className="space-y-4 pt-4 border-t">
                <div className="text-2xl flex justify-center items-center space-x-3">
                  <label className="block text-gray-700 text-md font-bold">Total:</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => {
                      const newPrice = e.target.value === '' ? '' : parseFloat(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        price: isNaN(newPrice) ? '' : newPrice,
                      }));
                    }}
                    className="ml-2 w-32 font-medium rounded-lg border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 py-1 px-2"
                    min="0"
                    step="0.01"
                  />
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
