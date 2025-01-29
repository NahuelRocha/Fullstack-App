import { useState } from 'react';

export const useServiceForm = initialState => {
  const [formData, setFormData] = useState(initialState);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentCustomItem, setCurrentCustomItem] = useState({
    quantity: '',
    name: '',
    price: 0,
  });

  const handleAddCustomContentItem = () => {
    const { quantity, name, price } = currentCustomItem;

    if (name.trim() && quantity > 0) {
      const newCustomItem = {
        ...currentCustomItem,
        isCustom: true,
        id: `custom-${Date.now()}`,
      };

      const updatedSelectedProducts = [...selectedProducts, newCustomItem];
      setSelectedProducts(updatedSelectedProducts);
      setCurrentCustomItem({ quantity: 1, name: '', price: 0 });
      updateServiceFromProducts(updatedSelectedProducts);
    }
  };

  const handleAddProduct = product => {
    const updatedSelectedProducts = [...selectedProducts, { ...product, quantity: 1 }];

    setSelectedProducts(updatedSelectedProducts);
    updateServiceFromProducts(updatedSelectedProducts);
  };

  const updateServiceFromProducts = products => {
    const contentItems = products.map(p => `${p.quantity} ${p.name}`);
    const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    setFormData(prev => ({
      ...prev,
      contentItems,
      price: totalPrice,
    }));
  };

  const handleImageAdd = imageUrl => {
    if (formData.imageUrls.length < 3 && !formData.imageUrls.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrl],
      }));
    }
  };

  const handleImageRemove = imageUrl => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== imageUrl),
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
    setSelectedProducts([]);
  };

  return {
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
  };
};
