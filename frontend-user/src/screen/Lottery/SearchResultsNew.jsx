import React from "react";
import TicketCard from "./TicketCard";
import "./SearchResultsNew.css"; 

const SearchResultsNew = ({ lotteryData, handleBack }) => {
  return (
    <div className="text-center">
      {/* Back Button */}
      <div className="text-start">
        <button className="btn btn-secondary back-button" onClick={handleBack}>
          Back
        </button>
      </div>

      <h4 className="search-results-heading">Search Results:</h4>
      <div className="search-result-container">
        {lotteryData?.searchResult?.tickets?.length > 0 ? (
          <>
            <h5>Tickets:</h5>
            <div
              className={`ticket-list-container ${
                lotteryData.searchResult.tickets.length > 4
                  ? "scrollable-container"
                  : ""
              }`}
            >
              <div className="ticket-grid">
                {lotteryData.searchResult.tickets.map((ticket, index) => (
                  <TicketCard key={index} ticket={ticket} />
                ))}
              </div>
            </div>
            <h5>
              Price: <span className="result-price">₹{lotteryData.searchResult.price}</span>
            </h5>
            <h5>
              SEM: <span className="result-sem">{lotteryData.searchResult.sem}</span>
            </h5>
          </>
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsNew;
