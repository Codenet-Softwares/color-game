import React, { useState, useEffect } from "react";
import { GetResultMarket, GetWiningResult } from "../../utils/apiService";

const NewResult = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [results, setResults] = useState([]); // State to store fetched prize data
  const [error, setError] = useState(null); 
  const maxVisibleMarkets = 5;
  const visibleMarkets = markets.slice(
    scrollIndex,
    scrollIndex + maxVisibleMarkets
  );

  useEffect(() => {
    const fetchMarkets = () => {
     GetResultMarket({ date: new Date().toISOString().slice(0, 10) }).then((response) => {
        if (response && response.success && response.data) {
          setMarkets(response.data);
          setSelectedMarket(response.data[0]); // Default to the first market
        } else {
          setError("Failed to fetch markets or no data available.");
        }
      });
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (!selectedMarket) return;

    const fetchResults = () => {
      setError(null);
      GetWiningResult({ marketId: selectedMarket.marketId }).then((response) => {
        if (response && response.success) {
          if (response.data && response.data.length > 0) {
            setResults(response.data);
          } else {
            setResults([]); 
            setError("No prize data available.");
          }
        } else {
          setError(response?.message);
        }
      });
    };

    fetchResults();
  }, [selectedMarket]);

  const handleScrollLeft = () => {
    if (scrollIndex > 0) setScrollIndex(scrollIndex - 1);
  };
  const handleScrollRight = () => {
    if (scrollIndex + maxVisibleMarkets < markets.length)
      setScrollIndex(scrollIndex + 1);
  };

  const handleOldResults = () => {
    alert("This portion is under development.");
  };
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <div
        className="d-flex align-items-center mt-5  "
        style={{
          backgroundColor: "#4682B4",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Arrow */}
        <button
          className="btn btn-light"
          style={{
            padding: "5px 10px",
            fontSize: "18px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
          onClick={handleScrollLeft}
          disabled={scrollIndex === 0}
        >
          &#8249;
        </button>
        {/* Market Buttons */}
        <div
          className="d-flex flex-nowrap justify-content-center"
          style={{
            overflow: "hidden",
            gap: "10px",
          }}
        >
          {visibleMarkets.map((market) => (
            <button
              key={market.marketId}
              className={`btn ${
                market.marketId === selectedMarket?.marketId
                  ? "btn-primary"
                  : "btn-outline-light"
              }`}
              onClick={() => setSelectedMarket(market)}
              style={{
                fontSize: "16px",
                borderRadius: "4px",
                boxShadow:
                  market.marketId === selectedMarket?.marketId
                    ? "0px 4px 6px rgba(0, 0, 0, 0.2)"
                    : "none",
                whiteSpace: "nowrap",
              }}
            >
              {market.marketName}
            </button>
          ))}
        </div>
        {/* Right Arrow */}
        <button
          className="btn btn-light"
          style={{
            padding: "5px 10px",
            fontSize: "18px",
            borderRadius: "50%",
            marginLeft: "10px",
          }}
          onClick={handleScrollRight}
          disabled={scrollIndex + maxVisibleMarkets >= markets.length}
        >
          &#8250;
        </button>
        {/* Old Results Button */}
        <button
          className="btn btn-warning"
          onClick={handleOldResults}
          style={{
            marginLeft: "auto",
            borderRadius: "20px",
            padding: "5px 15px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Old Results
        </button>
      </div>
      {/* Market Result Display */}
      <div className="mt-4">
        <h2 className="text-center" style={{ color: "#3b6e91" }}>
          Results for <span style={{ color: "#4682B4" }}>{selectedMarket?.marketName || "Selected Market"}</span>
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-danger text-center">
            {error}
          </p>
        )}

        {/* Prize Distribution */}
        {results.length === 0 ? (
          <p className="text-center text-muted">No prize declared yet.</p>
        ) : (
          <div className="accordion mt-4" id="prizeAccordion">
            {results.map((result, index) => (
              <div className="accordion-item" key={result.resultId}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    {result.prizeCategory} - Amount: ₹{result.prizeAmount}
                    {result.complementaryPrize > 0 && (
                      <span className="badge bg-success ms-2">
                        Complementary Prize: ₹{result.complementaryPrize}
                      </span>
                    )}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#prizeAccordion"
                >
                  <div className="accordion-body">
                    <strong>Winning Ticket Numbers:</strong>
                    <ul>
                      {result.ticketNumber.map((ticket, idx) => (
                        <li key={idx}>{ticket}</li>
                      ))}
                    </ul>
                    {/* <p className="text-muted">
                      Market ID: {result.marketId}
                      <br />
                      Created At: {new Date(result.createdAt).toLocaleString()}
                      <br />
                      Updated At: {new Date(result.updatedAt).toLocaleString()}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewResult;
