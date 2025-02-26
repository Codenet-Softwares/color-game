import React from "react";
import "./TicketCard.css"; 

const TicketCard = ({ ticket }) => {
  const firstThree = ticket.slice(0, 4);
  const lastFour = ticket.slice(-5);

  return (
    <div className="ticket-card-container">
      <div className="ticket-card-inner">
        {/* Left Vertical Numbers */}
        <div className="ticket-card-left-numbers">{firstThree}</div>

        {/* Ticket Center Section */}
        <div className="ticket-card-center">
          <div className="ticket-card-title">Lottery Ticket</div>
          <div className="ticket-card-number">{ticket}</div>
        </div>

        {/* Right Vertical Numbers */}
        <div className="ticket-card-right-numbers">{lastFour}</div>
      </div>
    </div>
  );
};

export default TicketCard;
