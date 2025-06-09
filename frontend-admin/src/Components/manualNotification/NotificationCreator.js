import React, { useState } from "react";
import { toast } from "react-toastify";
import UserService from "../../Services/UserService";
import { useAuth } from "../../Utils/Auth";
import "react-toastify/dist/ReactToastify.css";
import "./NotificationCreator.css";



const NotificationCreator = () => {
  const auth = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!message.trim()) {
      toast.error("Message is required");
      return;
    }

    setLoading(true);

    try {
      const payload = { title, message };
      const res = await UserService.sendColorGameNotification(auth.user, payload);

      if (res?.data?.success) {
        toast.success("Notification sent successfully!");
        setTitle("");
        setMessage("");
      } else {
        toast.error("Failed to send notification.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-creator-container">
      <h2 className="notification-creator-heading">Send Color Game Notification</h2>
      <form onSubmit={handleSubmit} className="notification-creator-form">
        <label className="notification-creator-label">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            className="notification-creator-input"
            maxLength={100}
          />
          <div className="notification-creator-character-count">
            {title.length}/100 characters
          </div>
        </label>
        <label className="notification-creator-label">
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            className="notification-creator-input"
            style={{ height: "100px" }}
            maxLength={500}
          />
          <div className="notification-creator-character-count">
            {message.length}/500 characters
          </div>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="notification-creator-button"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
};

export default NotificationCreator;
