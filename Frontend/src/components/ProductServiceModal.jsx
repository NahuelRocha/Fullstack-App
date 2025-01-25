import PropTypes from 'prop-types';
import { useState } from 'react';
import { Search, X, Package, DollarSign, ShoppingBag, ShoppingCart } from 'lucide-react';

export const ProductServiceModal = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  selectedProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = products
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
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md md:max-w-2xl shadow-xl">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-brightColor" />
              Agregar Productos
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:border-brightColor focus:outline-none text-gray-700 font-medium text-sm md:text-base"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 rounded-xl focus:border-brightColor focus:outline-none text-gray-700 font-medium bg-white text-sm md:text-base"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price">Ordenar por precio</option>
            </select>
          </div>
        </div>

        <div className="p-4 md:p-6 max-h-[50vh] md:max-h-[60vh] overflow-y-auto">
          <div className="space-y-2 md:space-y-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-full flex items-center p-3 md:p-4 border-2 rounded-xl hover:border-brightColor hover:bg-gray-50 transition-all text-left group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-hover:text-brightColor" />
                    <h3 className="font-semibold text-gray-800 text-lg md:text-xl">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm md:text-base">
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-semibold -ml-1">{product.price}</span>
                    <span className="text-gray-400">|</span>
                    <span className="font-semibold">Orden Mínima: {product.minimumOrder}</span>
                    {product.category && (
                      <>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">{product.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <Package className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
              <p className="text-base md:text-lg">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProductServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      minimumOrder: PropTypes.number.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  onSelectProduct: PropTypes.func.isRequired,
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};
