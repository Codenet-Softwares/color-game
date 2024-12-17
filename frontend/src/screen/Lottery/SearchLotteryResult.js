import React, { useState } from "react";
import { PurhaseLotteryTicketUser } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import "./SearchLotteryResult.css";

const SearchLotteryResult = ({ responseData, marketId }) => {
  console.log("====>>>> responseData", marketId);

  const navigate = useNavigate();
  const [purchaseResponse, setPurchaseResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  // Function to handle the purchase button click
  // const handleBuy = async (price) => {
  //   if (!responseData) return;

  //   const body = {
  //     generateId: responseData.generateId || "defaultId",

  //     lotteryPrice: responseData.price || "5.00",
  //     marketId: marketId || "defaultMarketId"  // Pass marketId to the body

  //     lotteryPrice: price,

  //   };

  //   try {
  //     setLoading(true);
  //     const response = await PurhaseLotteryTicketUser(body); // Use updated body
  //     console.log("API response:", response);
  //     setPurchaseResponse(response);
  //     setTimeout(() => {

  //       // window.location.reload();

  //       setShowSearch(prev=>!prev)

  //     }, 2000);
  //   } catch (error) {
  //     console.error("Error purchasing ticket:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleBuy = async () => {
    if (!responseData) return;

    const body = {
      generateId: responseData.generateId || "defaultId",
      lotteryPrice: responseData.price || "5.00",
      marketId: marketId || "defaultMarketId", // Pass marketId to the body
    };

    try {
      setLoading(true);
      const response = await PurhaseLotteryTicketUser(body); // Use updated body
      console.log("API response:", response);
      setPurchaseResponse(response);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error purchasing ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center"  >
      <h4 style={{ color: "#4682B4", fontWeight: "bold" }}>Search Results:</h4>
      <div className="mt-3">
        {responseData && responseData.tickets && responseData.tickets.length > 0 ? (
          <>
            <h5>Tickets:</h5>
            <div
              style={{
                maxHeight: responseData.tickets.length > 8 ? "400px" : "auto",
                overflowY: responseData.tickets.length > 8 ? "scroll" : "unset",
                border: responseData.tickets.length > 8 ? "1px solid #ccc" : "none",
                padding: "10px",
                borderRadius: "4px",
                 backgroundColor: "#B0B0B0",
                //  border:"2px solid red" 
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 4fr)",
                  gap: "20px",
                  // border:"2px solid red" 
                }}
              >
                {responseData.tickets.map((ticket, index) => {
                  const firstThree = ticket.slice(0, 4);
                  const lastFour = ticket.slice(-4);
                  return (
                    <div
                    key={index}
                    style={{
                      background: "linear-gradient(135deg, #e6f7ff, #d4edff)",
                      padding: "15px", // Increased padding to create proper space
                      borderRadius: "12px",
                      position: "relative",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      color: "#3b6e91",
                      border: "2px solid #3b6e91",
                      // display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      clipPath:
                        "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #e6f7ff, #d4edff)",
                        padding: "20px", // Increased padding here to ensure inner space
                        borderRadius: "12px",
                        position: "relative",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        color: "#3b6e91",
                        border: "2px solid #3b6e91",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        clipPath:
                          "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
                      }}
                    >
                      {/* Left Vertical Numbers */}
                      <div
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          color: "#4682B4",
                          marginRight: "10px",
                          // border:"2px solid red" 
                        }}
                      >
                        {firstThree}
                      </div>
                      {/* Ticket Center Section */}
                      <div
                        style={{
                          flexGrow: 1,
                          textAlign: "center",
                          borderLeft: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                          padding: "0 10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            marginBottom: "10px",
                          }}
                        >
                          Ticket
                        </div>
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "#3b6e91",
                          }}
                        >
                          {ticket}
                        </div>
                      </div>
                      {/* Right Vertical Numbers */}
                      <div
                        style={{
                          writingMode: "vertical-rl",
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          color: "#4682B4",
                          marginLeft: "10px",
                        }}
                      >
                        {lastFour}
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <h5>
              Price: <span style={{ color: "#3b6e91" }}>₹{responseData.price}</span>
            </h5>
            <h5>
              SEM: <span style={{ color: "#3b6e91" }}>{responseData.sem}</span>
            </h5>
            {/* Buy Button */}
            <div className="text-center mt-4">
              <button
                className="btn btn-success"
                onClick={() => handleBuy(responseData.price)}
                style={{
                  backgroundColor: "#28a745",
                  padding: "10px 40px",
                  fontWeight: "bold",
                }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Buy"}
              </button>
            </div>
            {purchaseResponse && (
              <div className="mt-4">
                <h5 style={{ color: "#28a745" }}>
                  {purchaseResponse.message || "Purchase successful!"}
                </h5>
              </div>
            )}
          </>
        ) : (
          <h5 style={{ color: "#3b6e91" }}>
            {responseData
              ? responseData.message || "No tickets found."
              : "No data available."}
          </h5>
        )}
      </div>
    </div>
    
      );
    };
  
    

export default SearchLotteryResult;