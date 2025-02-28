import { useLocation, useNavigate } from "react-router-dom";

export const customErrorHandler = (error) => {
  let errorMessage = "";
  if (error?.response?.data?.message) {
    errorMessage = error?.response?.data?.message;
  } else if (error?.response?.data?.errMessage) {
    errorMessage = error?.response?.data?.errMessage;
  } else {
    errorMessage = "something went wrong";
  }
  return errorMessage;
};

class TicketService {
  constructor(group, series, number, sem, drawTime) {
    this.group = group;
    this.series = series;
    this.number = number;
    this.sem = sem;
    this.drawTime = drawTime;
  }

  list() {
    const seriesArray = ["A", "B", "C", "D", "E", "G", "H", "J", "K", "L"];
    let currentGroup = this.group;
    let currentSeriesIndex = 0;
    const tickets = [];

    for (let i = 0; i < this.sem; i++) {
      const seriesArrays =
        this.sem === 5 || this.sem === 25
          ? ["A", "B", "C", "D", "E"]
          : seriesArray;

      tickets.push(
        `${currentGroup} ${seriesArray[currentSeriesIndex]} ${this.number}`
      );

      currentSeriesIndex++;

      // If the series reaches past 'L', reset to 'A' and increment the group
      if (currentSeriesIndex >= seriesArrays.length) {
        currentSeriesIndex = 0;
        currentGroup++;
      }
    }

    return tickets;
  }

  listHelper() {}

  calculatePrice() {
    const price = 6 * this.sem;
    return price;
  }
}
export function formatDateForUi(dateString) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export const generateLotteryOptions = (
  groupStart,
  groupEnd,
  seriesStart,
  seriesEnd,
  numberStart,
  numberEnd
) => {
  // Ensure numbers are within 00001-99999 and properly ordered
  [numberStart, numberEnd] = [
    Math.max(1, Math.min(99999, numberStart)),
    Math.max(1, Math.min(99999, numberEnd)),
  ].sort((a, b) => a - b);

  return {
    groupOptions: Array.from(
      { length: groupEnd - groupStart + 1 },
      (_, i) => String(groupStart + i)
    ),
    seriesOptions: Array.from(
      { length: seriesEnd.charCodeAt(0) - seriesStart.charCodeAt(0) + 1 },
      (_, i) => String.fromCharCode(seriesStart.charCodeAt(0) + i)
    ).filter((char) => !["I", "O", "F"].includes(char)),
    numberOptions: Array.from({ length: numberEnd - numberStart + 1 }, (_, i) =>
      String(numberStart + i).padStart(5, "0")
    ),
  };
};
