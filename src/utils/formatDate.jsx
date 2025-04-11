import { format } from "date-fns";

export const formatDate = (date, formatString = "dd/MM/yyyy") => {
  try {
    return format(new Date(date), formatString);
  } catch {
    return "-";
  }
};
