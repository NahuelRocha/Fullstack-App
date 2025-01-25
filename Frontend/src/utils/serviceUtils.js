export const parseContentItemQuantity = contentItem => {
  const match = contentItem.match(/^(\d+)\s+(.+)$/);
  if (match) {
    return {
      quantity: parseInt(match[1]),
      productName: match[2],
    };
  }
  return null;
};

export const findProductByName = (productName, productsList) => {
  return productsList.find(p => p.name === productName);
};

export const reconstructSelectedProducts = (contentItems, productsList) => {
  return contentItems
    .map(item => {
      const parsed = parseContentItemQuantity(item);
      if (!parsed) return null;

      const product = findProductByName(parsed.productName, productsList);

      if (product) {
        return {
          ...product,
          quantity: parsed.quantity,
        };
      }

      return {
        id: `custom-${Date.now()}`,
        name: parsed.productName,
        quantity: parsed.quantity,
        price: 0,
        isCustom: true,
      };
    })
    .filter(item => item !== null);
};
