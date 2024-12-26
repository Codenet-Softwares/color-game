import { useLocation, useNavigate } from "react-router-dom"

export const customErrorHandler = (error) => {
    let errorMessage = ''
    if (error?.response?.data?.message) {
        errorMessage = error?.response?.data?.message
    } else if (error?.response?.data?.errMessage) {
        errorMessage = error?.response?.data?.errMessage
    } else {
        errorMessage = "something went wrong"
    }
    return errorMessage
}

class TicketService {
    constructor(group, series, number, sem , drawTime) {
      this.group = group
      this.series = series
      this.number = number
      this.sem = sem
      this.drawTime = drawTime
    }
  
    list() {
      const seriesArray = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'J', 'K', 'L'];
      let currentGroup = this.group;
      let currentSeriesIndex = 0
      const tickets = [];
  
      for (let i = 0; i < this.sem; i++) {
  
        const seriesArrays = (this.sem === 5 || this.sem === 25) ? ['A', 'B', 'C', 'D', 'E'] :  seriesArray;
  
        tickets.push(`${currentGroup} ${seriesArray[currentSeriesIndex]} ${this.number}`);
  
        currentSeriesIndex++;
  
        // If the series reaches past 'L', reset to 'A' and increment the group
        if (currentSeriesIndex >= seriesArrays.length) {
          currentSeriesIndex = 0; 
          currentGroup++;        
        }
      }
  
      return tickets;
    }
  
  
    listHelper() {
  
    }
  
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
  
//   const groupInput = 38;      
//   const seriesInput = 'L';   
//   const numberInput = '77777';     
//   const semInput = 5
  
//  export const ticketService = new TicketService(groupInput, seriesInput, numberInput, semInput);