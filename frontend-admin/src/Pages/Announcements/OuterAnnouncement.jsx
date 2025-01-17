import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";

const OuterAnnouncement = () => {
  const { user } = useAuth();
  const [announcementData, setAnnouncementData] = useState({
    announcement: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojis = [
    "😊", "😂", "😍", "😎", "🤔", "🥺", "💯", "🎉", "👍", "🙏",
    "❤️", "💙", "💚", "💛", "💜", "🧡", "🤍", "🤎",
    "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🎮", "🎲",
    "🌞", "🌈", "🌧️", "⛅", "🌨️", "❄️", "🌬️", "🌪️", "🌟", "🌙",
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
    "🎵", "🎶", "🎤", "🎧", "🎼", "🎷", "🎸", "🎻", "🥁", "🎺",
    "🎬", "📽️", "🍿", "🎥", "📺", "📷", "📸", "📡", "🎮", "🎧",
    "💻", "🖥️", "📱", "📞", "📡", "💾", "🖱️", "🖲️", "⌨️", "💻",
    "🎁", "💌", "🎀", "🎉", "🎊", "🎈", "🧧", "🧸", "🛍️", "📦",
    "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "0️⃣"
  ];

  const handleEmojiClick = (emoji) => {
    setAnnouncementData((prev) => ({
      ...prev,
      announcement: prev.announcement + emoji,
    }));
    setShowEmojiPicker(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAnnouncement = async () => {
    const { announcement } = announcementData;

    if (!announcement) {
      toast.error("Please provide an announcement.");
      return;
    }

    const data = { announcement };

    try {
      const response = await GameService.CreateOuterAnnouncement(user, data);
      console.log("Create API Response:", response.data);
      toast.success("Announcement created successfully!");
      setAnnouncementData({ announcement: "" });
    } catch (error) {
      // Check if the error response exists and contains the `errMessage` property
      if (error.response && error.response.data && error.response.data.errMessage) {
        toast.error(error.response.data.errMessage); // Display the backend error message
      } else {
        toast.error("Failed to create announcement. Please try again."); // Fallback error message
      }
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <div className="container my-5 p-5">
      <h2 className="fw-bold text-center text-uppercase">Create Outer Announcement</h2>
      <div className="mt-4">
        <div className="mb-3">
          <div className="d-flex">
            <input
              type="text"
              id="announcement"
              name="announcement"
              className="form-control fw-bold"
              style={{
                background: "#D8C4B6",
                border:"2px solid #3E5879",
              }}
              value={announcementData.announcement}
              onChange={handleChange}
              placeholder="Enter Outer Announcement"
            />
            <button
              type="button"
              className="btn btn-info ms-2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <h5 className="fw-bold">Choose Emojis 😊</h5>
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="emoji-picker mt-2">
              <div className="emoji-grid">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="btn btn-light emoji-button"
                    style={{ fontSize: "1.5rem", margin: "5px" }}
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button className="btn btn-primary" onClick={handleCreateAnnouncement}>
            Create Outer Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default OuterAnnouncement;
