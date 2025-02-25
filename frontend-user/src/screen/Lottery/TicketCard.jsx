import React from "react";

const TicketCard = ({ ticket }) => {
  const firstThree = ticket.slice(0, 4);
  const lastFour = ticket.slice(-5);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e6f7ff, #d4edff)",
        padding: "25px", 
        borderRadius: "12px",
        position: "relative",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
        color: "#3b6e91",
        border: "5px solid #3b6e91",
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
          padding: "15px",
          borderRadius: "12px",
          position: "relative",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          color: "#3b6e91",
          border: "3px solid #3b6e91",
          display: "flex",
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
            marginRight: "15px",
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {firstThree}
        </div>

        {/* Ticket Center Section */}
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            borderLeft: "5px solid #ccc",
            borderRight: "5px solid #ccc",
            padding: "10px 20px",
          }}
        >
          <div
          className="text-uppercase"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
           Lottery Ticket
          </div>
          <div
            style={{
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
            marginLeft: "15px",
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {lastFour}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
