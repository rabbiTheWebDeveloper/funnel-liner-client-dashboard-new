export const calculateDeliveryPercentage = (deliveries, returns) => {
  const deliveriesNum = Number(deliveries);
  const returnsNum = Number(returns);
  if(deliveriesNum === 0 && returnsNum === 0) return 0
  if (deliveriesNum === 0) return 0;
  const successfulDeliveries = deliveriesNum - returnsNum;
  const deliveryPercentage = (successfulDeliveries / deliveriesNum) * 100;
  return deliveryPercentage.toFixed(0); 
  
}
