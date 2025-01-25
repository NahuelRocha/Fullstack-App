import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const ProductDetailModal = ({ product, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !product) return null;

  const productDetails = [
    { label: 'Nombre', value: product.name },
    { label: 'Cantidad', value: `${product.quantity} ${formatUnit(product.unitOfMeasure)}` },
    { label: 'Costo de Compra', value: `$${product.purchaseCost}` },
    { label: 'Costo por UN/KG', value: `$${product.cost}` },
    { label: 'Margen de Ganancia', value: `${product.profitMargin}%` },
    { label: 'Precio de Venta', value: `$${product.price}` },
    { label: 'Orden Mínima', value: product.minimumOrder },
    {
      label: 'Estado',
      value: product.available ? 'Disponible' : 'No Disponible',
      className: product.available ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-2xl relative md:mt-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Detalles del Producto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-4">
          {productDetails.map(({ label, value, className }) => (
            <div key={label} className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">{label}</span>
              <span className={`text-gray-800 font-semibold ${className || ''}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between p-4 border-t">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 mr-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 ml-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility function to format unit
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

// PropTypes validation
ProductDetailModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unitOfMeasure: PropTypes.string.isRequired,
    purchaseCost: PropTypes.number.isRequired,
    cost: PropTypes.number.isRequired,
    profitMargin: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    minimumOrder: PropTypes.number.isRequired,
    available: PropTypes.bool.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductDetailModal;
