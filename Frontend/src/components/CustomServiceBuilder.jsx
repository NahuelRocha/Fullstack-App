import { useState, useEffect } from 'react';
import { Plus, Minus, Send, Package, X } from 'lucide-react';
import { productService } from '../services/api';
import { ProductServiceModal } from './ProductServiceModal';

const CustomServiceBuilder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getAvailableProducts(0, 100);
        setProducts(response.content);
        setLoading(false);
      } catch (err) {
        setError(err + 'Error cargando productos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddProduct = product => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + product.minimumOrder } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: product.minimumOrder }]);
    }
  };

  const handleUpdateQuantity = (productId, increment) => {
    setSelectedProducts(
      selectedProducts.map(p => {
        if (p.id === productId) {
          const newQuantity = increment ? p.quantity + 1 : Math.max(p.minimumOrder, p.quantity - 1);
          return { ...p, quantity: newQuantity };
        }
        return p;
      })
    );
  };

  const handleRemoveProduct = productId => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = '5492235632600';
    const orderDetails = selectedProducts
      .map(p => `${p.quantity} ${p.name} ($${(p.price * p.quantity).toFixed(2)})`)
      .join('\n');
    const total = calculateTotal().toFixed(2);
    const message = `¡Hola! Me gustaría hacer un pedido personalizado:\n\n${orderDetails}\n\nTotal: $${total}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightColor"></div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center p-4 bg-white rounded-xl shadow-lg">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl mt-16 md:mt-12">
        <ProductServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          products={products}
          selectedProducts={selectedProducts}
          onSelectProduct={product => {
            handleAddProduct(product);
            setIsModalOpen(false);
          }}
        />

        <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-left border-b">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 -mt-2">Armá tu Pedido</h2>
            <p className="text-gray-600 mb-3 md:mb-0">
              No encontraste lo que buscabas? Selecciona los productos y personaliza tu orden.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brightColor text-white px-6 py-3 rounded-xl hover:bg-opacity-90 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Agregar Productos</span>
          </button>
        </div>

        <div className="p-3 h-80">
          {selectedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed">
              <Package className="w-16 h-16 mb-4 opacity-50" />
              <button onClick={() => setIsModalOpen(true)}>
                <p className="text-lg mb-2">Tu carrito está vacío</p>
                <p className="text-gray-400">Agrega productos</p>
              </button>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-2 space-y-2">
              {selectedProducts.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 hover:border-brightColor transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 font-semibold text-lg">
                      ${product.price} × {product.quantity} unidades ={' '}
                      <span className="font-bold text-brightColor">
                        ${(product.price * product.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-3 bg-white rounded-lg px-2 py-1 border">
                      <button
                        onClick={() => handleUpdateQuantity(product.id, false)}
                        className="text-gray-600 hover:text-brightColor p-1"
                        disabled={product.quantity <= product.minimumOrder}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-8 text-center">{product.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(product.id, true)}
                        className="text-gray-600 hover:text-brightColor p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="ml-3 text-2xl font-semibold text-gray-700">Total del Pedido:</span>
            <span className="text-3xl mr-3 font-bold text-brightColor">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleWhatsAppOrder}
            disabled={selectedProducts.length === 0}
            className="w-full bg-brightColor text-white py-4 px-6 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
          >
            <Send className="w-5 h-5" />
            <span>Ordenar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomServiceBuilder;
