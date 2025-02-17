import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import PropTypes from 'prop-types';

const ProductSelectorModal = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  selectedProducts,
  loadMoreProducts,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [localProducts, setLocalProducts] = useState([]);

  // Efecto para mantener una copia local de los productos
  useEffect(() => {
    if (products) {
      setLocalProducts(products);
    }
  }, [products]);

  const filteredProducts = localProducts
    .filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedProducts.some(p => p.id === product.id)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  const handlePageChange = async (page, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Guardar los productos actuales antes de cargar la nueva página
    const currentProducts = [...localProducts];

    try {
      // Cargar la nueva página
      await loadMoreProducts(page);
      setCurrentPage(page);
    } catch (error) {
      // Si hay un error, restaurar los productos anteriores
      setLocalProducts(currentProducts);
      console.error('Error al cargar más productos:', error);
    }
  };

  // Manejar la selección de producto
  const handleProductSelect = product => {
    // Crear una copia del producto para evitar referencias mutables
    const productCopy = {
      ...product,
      quantity: 1,
    };
    onSelectProduct(productCopy);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Seleccionar Producto</h2>
          <button type="button" onClick={onClose} className="p-2 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:border-brightColor focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full p-2 border-2 rounded-lg focus:border-brightColor focus:outline-none"
          >
            <option value="name">Ordenar por nombre</option>
            <option value="price">Ordenar por precio</option>
          </select>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <button
                type="button"
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">${product.price}</div>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 py-8">No se encontraron productos</div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex justify-center flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={e => handlePageChange(i, e)}
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
      </div>
    </div>
  );
};

ProductSelectorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectProduct: PropTypes.func.isRequired,
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  loadMoreProducts: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default ProductSelectorModal;
