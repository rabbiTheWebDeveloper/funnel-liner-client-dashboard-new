export const replaceSpacesWithHyphens =(text) =>{

  return text?.replace(/\s+/g, '-');
}

export const getTotalQuantity = (items) => {
  return items.reduce((total, currentItem) => {
      // Convert quantity to a number if it's a string
      const quantity = typeof currentItem.quantity === 'string' ? parseInt(currentItem.quantity, 10) : currentItem.quantity;
      return total + quantity;
  }, 0);
};