import { styled } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";
export const removeTextFromNumber = (phoneNumber, textToRemove) => {
  if (phoneNumber.includes(textToRemove)) {
    return phoneNumber.replace(textToRemove, "");
  } else {
    return phoneNumber;
  }
};

export const followUpOrderFilterOption = [
  { value: "today", label: "Today" },
  { value: "next_seven_days", label: "Next Seven Days" },
  { value: "custom", label: "Custom" },
];
export const confirmedOrderFilterOption = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "previous", label: "Previous" },
  { value: "next_seven_days", label: "Next Seven Days" },
  { value: "custom", label: "Custom" },
];

export const pendingStatus = [
  { item: "Pending", value: "pending" },
  { item: "Follow Up", value: "follow_up" },
  { item: "Confirmed", value: "confirmed" },
  { item: "Cancelled", value: "cancelled" },
];

export const multiStatus = [
  { item: "Follow Up", value: "follow_up" },
  { item: "Cancelled", value: "cancelled" },
  { item: "Delivered", value: "delivered" },
  { item: "Hold On", value: "hold_on" },
];
export function formatDateToBST(date) {
  return date?.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
}

export const BootstrapButton = styled(Button)({
  backgroundColor: "#fff",
  border: "1px solid #894bca",
  color: "#894bca",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: "#894bca",
    borderColor: "#894bca",
    boxShadow: "none",
    color: "#fff",
  },
});

export const FilterDateInput = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "42px",
    marginRight: "10px",
    width: "250px",
  },
});

export const followUpStatus = [
  { item: "Follow Up", value: "follow_up" },
  { item: "Confirmed", value: "confirmed" },
  { item: "Cancelled", value: "cancelled" },
];

export const holdOnStatus = [
  { item: "Hold On", value: "hold_on", color: "yellow" },
  { item: "Follow Up", value: "follow_up", color: "blue" },
  { item: "Confirmed", value: "confirmed", color: "green" },
  { item: "Cancelled", value: "cancelled", color: "red" },
  { item: "Pending", value: "pending", color: "red" },
];
export const cancelledOnStatus = [
  { item: "Cancelled", value: "cancelled", color: "red" },
  { item: "Follow Up", value: "follow_up", color: "blue" },
  { item: "Confirmed", value: "confirmed", color: "green" },
];
export const orderType = value => {
  if (value === "landing") {
    return "#894bca";
  }
  if (value === "website") {
    return "#f5b849";
  }
  if (value === "social") {
    return "#23b7e5";
  }
  if (value === "phone") {
    return "#26bf94";
  }
};
