export const ORDER_PANDING_STATUS = [
  { item: "Pending", value: "pending" },
  { item: "Follow Up", value: "follow_up" },
  { item: "Confirmed", value: "confirmed" },
  { item: "Cancelled", value: "cancelled" },
];
export const ORDER_FOLLOWUP_STATUS = [
  { item: "Follow Up", value: "follow_up" },
  { item: "Confirmed", value: "confirmed" },
  { item: "Cancelled", value: "cancelled" },
];

export const ORDER_HOLD_ON_STATUS = [
  { item: "Hold On", value: "hold_on", color: "yellow" },
  { item: "Follow Up", value: "follow_up", color: "blue" },
  { item: "Confirmed", value: "confirmed", color: "green" },
  { item: "Cancelled", value: "cancelled", color: "red" },
];

export const ORDER_COURIES = [
  { item: "Office Delivery", value: "office_delivery" },
  { item: "SteadFast", value: "steadfast" },
  { item: "Pathao", value: "pathao" },
];

export const ORDER_STEAD_FAST = [
  { item: "in_review", value: "In Review" },
  { item: "pending", value: "Pending" },
  { item: "hold", value: "Hold" },
  { item: "cancelled", value: "Cancelled" },
  { item: "delivered", value: "Delivered" },
  { item: "cancelled_approval_pending", value: "Cancel" },
  { item: "unknown_approval_pending", value: "Need Approval" },
  // { item: 'partial_delivered_approval_pending', value: 'Partial Delivered' },
  { item: "delivered_approval_pending", value: "Delivered" },
  { item: "partial_delivered", value: "Partial Delivered" },
  { item: "unknown", value: "Unknown" },
];

export const ORDER_PATHAO = [
  { item: "Pickup_Requested", value: "Pickup Requested" },
  { item: "Assigned_for_Pickup", value: "Assigned For Pickup" },
  { item: "Picked", value: "Picked" },
  { item: "Pickup_Failed", value: "Pickup Failed" },
  { item: "Pickup_Cancelled", value: "Pickup Cancelled" },
  { item: "At_the_Sorting_HUB", value: "At The Sorting HUB" },
  { item: "In_Transit", value: "In Transit" },
  { item: "Received_at_Last_Mile_HUB", value: "Received At Last Mile HUB" },
  { item: "Assigned_for_Delivery", value: "Assigned For Delivery" },
  { item: "Delivered", value: "Delivered" },
  { item: "Partial_Delivery", value: "Partial Delivery" },
  { item: "Return", value: "Return" },
  { item: "Delivery_Failed", value: "Delivery Failed" },
  { item: "On_Hold", value: "On Hold" },
  { item: "Payment_Invoice", value: "Payment Invoice" },
];
