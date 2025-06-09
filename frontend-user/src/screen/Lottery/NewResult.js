import React, { useState, useEffect } from "react";
import { GetResultMarket, GetWiningResult } from "../../utils/apiService";
import { format } from "date-fns";
import "./NewResult.css";

const NewResult = () => {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today); // For date filter
  const [openIndex, setOpenIndex] = useState(null); // Track open accordion
  const [maxVisibleMarkets, setMaxVisibleMarkets] = useState(5);
  useEffect(() => {
    const updateMaxVisibleMarkets = () => {
      if (window.innerWidth <= 768) {
        setMaxVisibleMarkets(1);
      } else {
        setMaxVisibleMarkets(5);
      }
    };

    updateMaxVisibleMarkets();
    window.addEventListener("resize", updateMaxVisibleMarkets);
    return () => {
      window.removeEventListener("resize", updateMaxVisibleMarkets);
    };
  }, []);
  const visibleMarkets = markets.slice(
    scrollIndex,
    scrollIndex + maxVisibleMarkets
  );

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle open/close
  };

  // let this be commented do not delete for future reference
  // const fetchMarkets = () => {
  //   GetResultMarket({ date: selectedDate }).then((response) => {
  //     if (response && response.success && response.data) {
  //       setMarkets(response.data);
  //       setSelectedMarket(response.data[0]); // Default to the first market
  //     } else {
  //       setError("Failed to fetch markets or no data available.");
  //     }
  //   });
  // };
  const fetchMarkets = () => {
    GetResultMarket({ date: selectedDate }).then((response) => {
      if (
        response &&
        response.success &&
        response.data &&
        response.data.length > 0
      ) {
        setMarkets(response.data);
        setSelectedMarket(response.data[0]); // Automatically select the first market
      } else {
        setMarkets([]);
        setSelectedMarket(null); // No market selected
        setError("No markets found for the selected date.");
      }
    });
  };

  useEffect(() => {
    fetchMarkets();
  }, [selectedDate]);


  const fetchResults = () => {
    if (!selectedMarket) return; // Ensure a market is selected

    setError(null); // Clear previous errors
  

    GetWiningResult({
      marketId: selectedMarket.marketId,
      date: selectedDate,
    }).then((response) => {
    

      if (response && response.success) {
        if (response.data && response.data.length > 0) {
          setResults(response.data);
        } else {
          setResults([]);
          setError("No prize data available for this date.");
        }
      } else {
        setError(response?.message || "Error fetching results.");
      }
    });
  };
  useEffect(() => {
    if (selectedMarket) {
      fetchResults();
    }
  }, [selectedMarket]);

  const handleScrollLeft = () => {
    if (scrollIndex > 0) setScrollIndex(scrollIndex - 1);
  };
  const handleScrollRight = () => {
    if (scrollIndex + maxVisibleMarkets < markets.length)
      setScrollIndex(scrollIndex + 1);
  };

  // Handle date change
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    const formattedDate = format(new Date(newDate), "yyyy-MM-dd");
    setSelectedDate(formattedDate);
  };
  return (
    <div className="whole_container mt-5 px-5">
      <div className="container_result p-3">
        <div className="market-container shadow-lg">
          {/* Datepicker (Auto Moves Below on Small Screens) */}
          <div className="date-filter-container mt-3">
            <label htmlFor="date-filter" className="date-filter-label">
              <i
                className="fas fa-calendar-alt me-2"
                style={{ color: "#4682B4" }}
              ></i>
              Select Declared Result Lottery Market Date:
            </label>
            <h6 className="date-filter-description">
              Please choose a date to view past available results of lottery
              markets.
            </h6>
            <input
              type="date"
              id="date-filter"
              className="date-filter-input"
              value={selectedDate}
              onChange={handleDateChange}
              max={today} // Prevent selecting future dates
              readonly // Prevent manual typing
              onKeyDown={(e) => e.preventDefault()} // Block manual input from keyboard
            />
          </div>
          <div className="d-flex align-items-center justify-content-between shadow-lg p-2 rounded-3 mt-4">
            {/* Left Arrow */}
            <button
              className="btn btn-light arrow-btn me-2"
              onClick={handleScrollLeft}
              disabled={scrollIndex === 0}
            >
              &#8249;
            </button>

            {/* Market Buttons */}
            <div className="market-buttons-container">
              {visibleMarkets.length > 0 ? (
                visibleMarkets.slice(0, maxVisibleMarkets).map((market) => (
                  <button
                    key={market.marketId}
                    className={`btn market-btn ${
                      market.marketId === selectedMarket?.marketId
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setSelectedMarket(market)}
                  >
                    {market.marketName}
                  </button>
                ))
              ) : (
                <div className="no-markets-text text-center">
                  No Markets Found With Results Declared.
                </div>
              )}
            </div>

            {/* Right Arrow */}
            <button
              className="btn btn-light arrow-btn ms-2"
              onClick={handleScrollRight}
              disabled={scrollIndex + maxVisibleMarkets >= markets.length}
            >
              &#8250;
            </button>
          </div>
        </div>
        {/* Market Result Display */}
        <div className="mt-4">
          {markets.length > 0 ? (
            <>
              <h2 className="text-center fw-bold text-white">
                Results For{" "}
                <span className="text-decoration-underline">
                  {selectedMarket?.marketName || "Selected Market"}
                </span>
              </h2>

              {/* Error Message */}
              {error && <p className="text-danger text-center">{error}</p>}

              {/* Prize Distribution */}
              {results?.length === 0 && !error ? (
                <p className="text-center text-muted">No prize declared yet.</p>
              ) : (
                <div className="accordion mt-4">
                  {results?.sort((a, b) => {
                      // Define the order of prizes
                      const order = {
                        "First Prize": 1,
                        "Second Prize": 2,
                        "Third Prize": 3,
                        "Fourth Prize": 4,
                        "Fifth Prize": 5,
                      };
                    
                      return (
                        (order[a.prizeCategory]) -
                        (order[b.prizeCategory])
                      );
                    })
                    .map((result, index) => (
                      <div className="accordion-item" key={result.resultId}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button d-flex flex-column flex-md-row justify-content-between align-items-start ${
                              openIndex === index ? "" : "collapsed"
                            }`}
                            onClick={() => toggleAccordion(index)}
                          >
                            <span>
                              {result.prizeCategory} -{" "}
                              <small className="text-primary fw-bold">
                                Amount:
                              </small>{" "}
                              ₹{result.prizeAmount}
                            </span>
                            {result.complementaryPrize > 0 && (
                              <span className="badge bg-success mt-md-0 ms-2 mt-1">
                                <small>
                                  {" "}
                                  Complementary Prize: ₹
                                  {result.complementaryPrize}
                                </small>
                              </span>
                            )}
                          </button>
                        </h2>

                        {openIndex === index && ( // Show content only if openIndex matches
                          <div className="accordion-collapse show">
                            <div className="accordion-body whole_accordion_body">
                              <strong className="winning_num">
                                Winning Ticket Numbers:
                              </strong>
                              <div className="complete_ticket_prize">
                                {result.ticketNumber.map((ticket, idx) => (
                                  <div
                                    key={idx}
                                    className="ticket-number"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform =
                                        "scale(1.1)";
                                      e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform =
                                        "scale(1)";
                                      e.currentTarget.style.boxShadow =
                                        "0 2px 5px rgba(0, 0, 0, 0.1)";
                                    }}
                                  >
                                    {ticket}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-danger fw-bold">
              No Markets Found For The Selected Date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewResult;
