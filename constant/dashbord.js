export function formatDateToBST(date) {
  return date?.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
}

export const formatDate = date => date.toISOString().split("T")[0];
