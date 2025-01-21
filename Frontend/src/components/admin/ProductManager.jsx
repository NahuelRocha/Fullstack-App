import { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

const UnitOfMeasure = {
  UNIT: 'UNIT',
  KILOGRAM: 'KILOGRAM',
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
  const [formData, setFormData] = useState({
    name: '',
    unitOfMeasure: UnitOfMeasure.UNIT,
    quantity: 0,
    purchaseCost: 0,
    profitMargin: 0,
    minimumOrder: 1,
    available: true,
  });

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

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Create a new object with parsed numbers
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

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        unitOfMeasure: UnitOfMeasure.UNIT,
        quantity: 0,
        purchaseCost: 0,
        profitMargin: 0,
        minimumOrder: 1,
        available: true,
      });
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
  };

  const handleDelete = async id => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="space-y-6 p-2 mt-0 md:mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl ml-2 font-bold text-gray-800">Gestor de Productos</h1>
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
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-brightColor text-white rounded-lg hover:bg-brightColor/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">{error}</div>}

      {/* Products Table with horizontal scroll on mobile */}
      <div className="overflow-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Unidad
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    $ de compra
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Costo x KG / UN
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    % de Ganancia
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Orden mínima
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    $ de venta
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-gray-900 text-sm font-black uppercase"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-4 text-md  text-gray-800 whitespace-nowrap">
                      {formatUnit(product.unitOfMeasure)}
                    </td>
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      ${product.purchaseCost}
                    </td>
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      ${product.cost}
                    </td>
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      {product.profitMargin}%
                    </td>
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      {product.minimumOrder}
                    </td>
                    <td className="px-4 py-4 text-md text-gray-800 whitespace-nowrap">
                      ${product.price}
                    </td>
                    <td className="px-4 py-4 text-md whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
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
        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                <select
                  value={formData.unitOfMeasure}
                  onChange={e => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor"
                >
                  {Object.values(UnitOfMeasure).map(unit => (
                    <option key={unit} value={unit}>
                      {formatUnit(unit)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  type="text" // Changed from "number" to "text"
                  value={formatLocalNumber(formData.quantity)}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]*[,.]?[0-9]*$/.test(value)) {
                      setFormData({ ...formData, quantity: value === '' ? 0 : value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio de Compra</label>
                <input
                  type="text" // Changed from "number" to "text"
                  value={formatLocalNumber(formData.purchaseCost)}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]*[,.]?[0-9]*$/.test(value)) {
                      setFormData({ ...formData, purchaseCost: value === '' ? 0 : value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Margen de Ganancia (%)
                </label>
                <input
                  type="text" // Changed from "number" to "text"
                  value={formatLocalNumber(formData.profitMargin)}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]*[,.]?[0-9]*$/.test(value)) {
                      setFormData({ ...formData, profitMargin: value === '' ? 0 : value });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Orden Mínima</label>
                <input
                  type="number"
                  value={formData.minimumOrder}
                  onChange={e =>
                    setFormData({ ...formData, minimumOrder: parseInt(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brightColor focus:ring-brightColor"
                  required
                  min="1"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="h-4 w-4 text-brightColor focus:ring-brightColor border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Disponible</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brightColor hover:bg-brightColor/90"
                >
                  {editingProduct ? 'Actualizar' : 'Cargar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
