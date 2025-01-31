import { useState } from "react";

const PrizeAccordion = ({ results }) => {
  const [openIndex, setOpenIndex] = useState(null); // Track open accordion

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle open/close
  };

  return (
    <div className="accordion mt-4">
      {results.map((result, index) => (
        <div className="accordion-item" key={result.resultId}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${openIndex === index ? "" : "collapsed"}`}
              onClick={() => toggleAccordion(index)}
            >
              {result.prizeCategory} - Amount: ₹{result.prizeAmount}
              {result.complementaryPrize > 0 && (
                <span className="badge bg-success ms-2">
                  Complementary Prize: ₹{result.complementaryPrize}
                </span>
              )}
            </button>
          </h2>

          {openIndex === index && ( // Show content only if openIndex matches
            <div className="accordion-collapse show">
              <div className="accordion-body" style={{ padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
                <strong style={{ fontSize: "1.2rem", color: "#3b6e91", display: "block", marginBottom: "15px" }}>
                  Winning Ticket Numbers:
                </strong>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "15px",
                    backgroundColor: "#f8faff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {result.ticketNumber.map((ticket, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "15px",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#555",
                        textAlign: "center",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
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
  );
};

export default PrizeAccordion;
