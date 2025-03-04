import React from "react";
import TicketCard from "./TicketCard";
import "./SearchResultsNew.css"; 

const SearchResultsNew = ({ lotteryData, handleBack, handleBuy }) => {

  return (
    <div className="text-center ">
      {/* Back Button */}
      <div className="text-start ">
        <button className="btn btn-secondary back-button text-uppercase" onClick={handleBack}>
          Back
        </button>
      </div>

      <h4 className="search-results-heading text-uppercase">Search Results:</h4>
      <div className="search-result-container">
        {lotteryData?.searchResult?.tickets?.length > 0 ? (
          <>
            <h5 className="text-uppercase">Tickets:</h5>
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
            <h5 className="text-uppercase">
              Price: <span className="result-price">₹{lotteryData.searchResult.price}</span>
            </h5>
            <h5 className="text-uppercase">
              SEM: <span className="result-sem">{lotteryData.searchResult.sem}</span>
            </h5>
             {/* Buy Button */}
             <button className="btn btn-primary buy-button text-uppercase fw-bold " onClick={handleBuy}>
              purchase
            </button>
          </>
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsNew;
