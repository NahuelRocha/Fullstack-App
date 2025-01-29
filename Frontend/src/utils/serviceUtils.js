export const parseContentItemQuantity = contentItem => {
  const match = contentItem.match(/^(\d+)\s+(.+?)(?:\s+\[(\d+(?:\.\d+)?)\])?$/);
  if (match) {
    return {
      quantity: parseInt(match[1]),
      productName: match[2],
      price: match[3] ? parseFloat(match[3]) : null, // Captura el precio si existe
    };
  }
  console.warn('Failed to parse contentItem:', contentItem);
  return null;
};

export const findProductByName = (productName, productsList) => {
  return productsList.find(p => p.name.trim().toLowerCase() === productName.trim().toLowerCase());
};

export const reconstructSelectedProducts = (contentItems, allProducts) => {
  return contentItems
    .map(item => {
      const match = item.match(/^(\d+)\s+(.+)$/);
      if (!match) return null;

      const [, quantity, name] = match;
      const trimmedName = name.trim();

      // Buscar el producto en allProducts con una comparación más robusta
      const product = allProducts.find(
        p => p.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );

      if (product) {
        return {
          ...product,
          quantity: parseInt(quantity, 10),
        };
      } else {
        // Generar un ID único más robusto para productos personalizados
        const customId = `custom-${trimmedName.toLowerCase().replace(/\s+/g, '-')}`;
        return {
          id: customId,
          name: trimmedName,
          quantity: parseInt(quantity, 10),
          price: 0,
          isCustom: true,
        };
      }
    })
    .filter(Boolean);
};

export const formatContentItems = products => {
  return products.map(product => {
    const baseString = `${product.quantity} ${product.name}`;
    return product.isCustom ? `${baseString} [${product.price}]` : baseString;
  });
};

// Nueva función para calcular el precio total
export const calculateTotalPrice = products => {
  return products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);
};
