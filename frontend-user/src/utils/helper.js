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

  listHelper() { }

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

export function formatDate(dateString) {
  // Create a new Date object using the input string
  let date = new Date(dateString);
  // Extract year, month, and day
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding 1 to month because January is 0
  let day = ("0" + date.getDate()).slice(-2);
  // Concatenate the parts with '-' separator
  return `${year}-${month}-${day}`;
}

export function capitalizeEachWord(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}


export const convertFormatDate = (dateStr) => {
  const originalDate = new Date(dateStr);

  if (isNaN(originalDate)) {
    return "Invalid Date";
  }

  // Subtract 5 hours 30 minutes in milliseconds
  const adjustedDate = new Date(originalDate.getTime() - (5 * 60 + 30) * 60 * 1000);

  const day = adjustedDate.getDate();
  const month = adjustedDate.toLocaleString("default", { month: "short" });
  const hours = adjustedDate.getHours();
  const minutes = adjustedDate.getMinutes();

  const formattedTime = `${day} ${month} ${hours}:${minutes < 10 ? "0" + minutes : minutes
    }`;

  return formattedTime;
};


