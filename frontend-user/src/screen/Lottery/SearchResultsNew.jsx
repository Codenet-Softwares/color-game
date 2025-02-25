import React from "react";
import TicketCard from "./TicketCard";

const SearchResultsNew = ({ lotteryData, handleBack }) => {
  return (
    <div className="text-center">
       {/* Back Button */}
       <div className="text-start ">
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          style={{
            backgroundColor: "#6c757d",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          Back
        </button>
      </div>
      <h4 style={{ color: "#4682B4", fontWeight: "bold" }}>Search Results:</h4>
      <div className="mt-3">
      {lotteryData?.searchResult?.tickets?.length > 0 ? (
        <>
          <h5>Tickets:</h5>
          <div
            style={{
              maxHeight:
                lotteryData.searchResult.tickets.length > 4 ? "400px" : "auto",
              overflowY:
                lotteryData.searchResult.tickets.length > 4
                  ? "scroll"
                  : "unset",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
              backgroundColor: "#B0B0B0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 4fr)",
                gap: "20px",
              }}
            >
                
              {lotteryData.searchResult.tickets.map((ticket, index) => (
                <TicketCard key={index} ticket={ticket} />
              ))}
            </div>
          </div>
          <h5>
            Price:{" "}
            <span style={{ color: "#3b6e91" }}>
              ₹{lotteryData.searchResult.price}
            </span>
          </h5>
          <h5>
            SEM:{" "}
            <span style={{ color: "#3b6e91" }}>
              {lotteryData.searchResult.sem}
            </span>
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
