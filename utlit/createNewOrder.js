function createNewOrder(order) {
  const { order_details, pricing, ...rest } = order; // Destructure the original object

  // Create a new product object with simplified details
  const newProduct = {
    id: order_details[0].product_id,
    product: order_details[0].product.product_name,
    price: order_details[0].unit_price,
    quantity: order_details[0].product_qty,
  };

  // Create the new order object with the desired structure
  return {
    id: rest.id + 1, // Increment ID by 1 (assuming consecutive IDs)
    order_no: `${rest.shop_id}${parseInt(rest.order_no.slice(-6)) + 1}`, // Generate new order number
    order_tracking_code: "FW3TSNW158", // Replace with logic to generate tracking code
    order_type: "phone",
    ...rest, // Include remaining properties from the original object
    customer_name: "S M AL RABBI", // Replace with actual customer name (if available)
    phone: "01726278251", // Replace with actual phone number (if available)
    grand_total: pricing.grand_total,
    discounted_total: pricing.grand_total,
    discount: pricing.discount,
    order_details: [newProduct], // Include the simplified product object
    fraud_entry: 9, // Replace with fraud scoring logic
    fraud_delivery: 7, // Replace with fraud scoring logic
    fraud_return: 2, // Replace with fraud scoring logic
    fraud_processing: false,
  };
}

export { createNewOrder };
