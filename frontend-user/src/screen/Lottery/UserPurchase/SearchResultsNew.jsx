import React from "react";
import TicketCard from "./TicketCard";
import "./SearchResultsNew.css";

const SearchResultsNew = ({ lotteryData, handleBack, handleBuy }) => {
  return (
    <div className="text-center ">
      {/* Back Button */}
     <div className="position-relative mt-3">
  {/* Back Button aligned to the left */}
  <button
    className="btn btn-secondary back-button text-uppercase position-absolute start-0"
    onClick={handleBack}
  >
    Back
  </button>

  {/* Centered Heading */}
  <h4 className="text-uppercase text-center m-0 fw-bold search-results-heading">Search Results:</h4>
</div>


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
            <div className="row justify-content-center my-3">
              <div className="col-6 col-sm-5 text-end">
                <h5 className="text-uppercase mb-0">
                  Price:{" "}
                  <span className="result-price">
                    ₹{lotteryData.searchResult.price}
                  </span>
                </h5>
              </div>
              <div className="col-6 col-sm-5 text-start">
                <h5 className="text-uppercase mb-0">
                  SEM:{" "}
                  <span className="result-sem">
                    {lotteryData.searchResult.sem}
                  </span>
                </h5>
              </div>
            </div>

            {/* Buy Button */}
            <button
              className=" buy-button text-uppercase fw-bold border-0 px-3 py-2 text-white rounded"
              onClick={handleBuy}
            >
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
