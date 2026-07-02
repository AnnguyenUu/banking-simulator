export interface AmountIndicator {
  type: "success" | "error";
  className: "text-red-600" | "text-green-600" | "";
  prefix: "+" | "-" | "";
}

export const getAmountIndicator = (value: number): AmountIndicator => {
  if (Number.isNaN(value)) {
    return { type: "error", className: "", prefix: "" };
  }

  if (value === 0) {
    return { type: "success", className: "", prefix: "" };
  }

  if (value < 0) {
    return { type: "error", className: "text-red-600", prefix: "" };
  }

  return { type: "success", className: "text-green-600", prefix: "+" };
};
