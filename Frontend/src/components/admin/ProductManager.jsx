import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Pencil, Trash2, Plus, Search, Info } from 'lucide-react';
import ProductDetailModal from '../ProductDetailModal';

const UnitOfMeasure = {
  UNIT: 'UNIT',
  KILOGRAM: 'KILOGRAM',
};

const initialFormState = {
  name: '',
  unitOfMeasure: UnitOfMeasure.UNIT,
  quantity: '',
  purchaseCost: '',
  profitMargin: '',
  minimumOrder: 1,
  available: true,
};

const formatUnit = unit => {
  switch (unit) {
    case 'UNIT':
      return 'UN';
    case 'KILOGRAM':
      return 'KG';
    default:
      return unit;
  }
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Nuevo estado para el producto seleccionado
  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts(currentPage);
      setProducts(response.content);
      setFilteredProducts(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const parseLocalNumber = numberString => {
    const cleanString = numberString.replace(/\s/g, '');
    const standardizedString = cleanString.replace(',', '.');
    return parseFloat(standardizedString);
  };

  const formatLocalNumber = number => {
    return number.toString().replace('.', ',');
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const parsedFormData = {
        ...formData,
        purchaseCost: parseLocalNumber(formData.purchaseCost.toString()),
        quantity: parseLocalNumber(formData.quantity.toString()),
        profitMargin: parseLocalNumber(formData.profitMargin.toString()),
        minimumOrder: parseInt(formData.minimumOrder),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, parsedFormData);
      } else {
        await productService.createProduct(parsedFormData);
      }

      handleCloseModal();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      unitOfMeasure: product.unitOfMeasure,
      quantity: product.quantity,
      purchaseCost: product.purchaseCost,
      profitMargin: product.profitMargin,
      minimumOrder: product.minimumOrder,
      available: product.available,
    });
    setIsModalOpen(true);
    setSelectedProduct(null); // Cerrar el modal de detalles si está abierto
  };

  const handleDelete = async id => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
        setSelectedProduct(null); // Cerrar el modal de detalles después de eliminar
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Nuevo método para manejar los detalles del producto
  const handleProductDetails = product => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="space-y-6 mt-2 md:mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:ml-4 font-bold text-gray-800">Gestor de Productos</h1>
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brightColor"
          />
          <Search className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={handleNewProduct}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-brightColor text-white rounded-lg hover:bg-brightColor/90 transition-colors"
        >
          <Plus className="w-5 h-5 -ml-1 mr-1 md:mr-2" />
          Nuevo Producto
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">{error}</div>}

      {/* Products Table with horizontal scroll on mobile */}
      <div className="relative overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200 divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300"
              >
                Nombre
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                Cantidad
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                Unidad
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                $ de compra
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                Costo x KG / UN
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                % de Ganancia
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                Orden mínima
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                $ de venta
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                Estado
              </th>
              <th className="px-4 py-0 md:py-2 text-left text-gray-900 text-sm font-black uppercase border-r border-gray-300">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td
                  onClick={() => handleProductDetails(product)}
                  className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap relative group"
                >
                  {product.name}
                  <Info
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-4 h-4"
                    aria-label="Ver detalles del producto"
                  />
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  {product.quantity}
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  {formatUnit(product.unitOfMeasure)}
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  ${product.purchaseCost}
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  ${product.cost}
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  {product.profitMargin}%
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  {product.minimumOrder}
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  ${product.price}
                </td>
                <td className="px-3 py-1 text-md text-gray-800 border-r border-gray-300 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.available ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 rounded ${
              currentPage === i
                ? 'bg-brightColor text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed pt-6 px-4 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-2 order-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Unidad de Medida
                  </label>
                  <select
                    value={formData.unitOfMeasure}
                    onChange={e => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                    className="mt-1 block w-full rounded-md border-2 order-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  >
                    {Object.values(UnitOfMeasure).map(unit => (
                      <option key={unit} value={unit}>
                        {formatUnit(unit)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Cantidad</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={e => {
                      let value = e.target.value;
                      if (value === '') {
                        setFormData({ ...formData, quantity: '' });
                      } else if (/^[0-9]*[,.]?[0-9]*$/.test(value)) {
                        setFormData({ ...formData, quantity: value });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Costo de Compra</label>
                  <input
                    type="text"
                    value={formData.purchaseCost}
                    onChange={e => {
                      let value = e.target.value;
                      if (value === '') {
                        setFormData({ ...formData, purchaseCost: '' });
                      } else if (/^[0-9]*[,.]?[0-9]*$/.test(value)) {
                        setFormData({ ...formData, purchaseCost: value });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Margen de Ganancia (%)
                  </label>
                  <input
                    type="text"
                    value={formData.profitMargin}
                    onChange={e => {
                      let value = e.target.value;
                      if (value === '') {
                        setFormData({ ...formData, profitMargin: '' });
                      } else if (/^[0-9]*[,.]?[0-9]*$/.test(value)) {
                        setFormData({ ...formData, profitMargin: value });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Orden Mínima</label>
                  <input
                    type="number"
                    value={formData.minimumOrder}
                    onChange={e => setFormData({ ...formData, minimumOrder: e.target.value })}
                    className="mt-1 block w-full rounded-md border-2 order-gray-300 focus:border-customColor/70 focus:outline-none transition duration-150 p-1"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="h-5 w-5 rounded text-brightColor focus:ring-brightColor"
                />
                <label className="text-sm font-medium text-gray-900">Disponible</label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-gray-900 hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-7 py-2 bg-brightColor text-white rounded-lg hover:bg-brightColor/90 transition-all"
                >
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Nuevo Modal de Detalles de Producto */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductManager;
