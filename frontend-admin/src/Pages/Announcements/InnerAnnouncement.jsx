import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";  
import GameService from "../../Services/GameService";  

const InnerAnnouncement = () => {
  const { user } = useAuth();
  const [announcementData, setAnnouncementData] = useState({
    announcement: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);  
  const [isLoading, setIsLoading] = useState(false);
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAnnouncement = async () => {
    setIsLoading(true);

    const { announcement } = announcementData;

    if (!announcement) {
      toast.error("Please provide an announcement.");
      setIsLoading(false);

      return;
    }

    const data = { announcement };

    try {
      const response = await GameService.CreateInnerAnnouncement(user, data);
      console.log("Create Inner Announcement API Response:", response.data);
      toast.success("Inner Announcement created successfully!");
      setAnnouncementData({ announcement: "" });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errMessage) {
        toast.error(error.response.data.errMessage); 
      } else {
        toast.error("Failed to create announcement. Please try again.");
      }
      console.error("Error creating inner announcement:", error);
    }finally {
      setIsLoading(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setAnnouncementData((prev) => ({
      ...prev,
      announcement: prev.announcement + emoji, 
    }));
    setShowEmojiPicker(false); 
  };

  return (
    <div className="container my-5 p-5">
  <h3 className="fw-bold text-center text-uppercase p-3 text-white rounded" style={{background:"#3E5879"}}>
    Create Inner Announcement
  </h3>

  {/* Show loading spinner */}
  {isLoading && (
    <div className="text-center my-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )}

  <div className="mt-4">
    <div className="mb-3">
      <div className="d-flex">
        <input
          type="text"
          id="announcement"
          name="announcement"
          className="form-control fw-bold"
          style={{
            background:"#E1D1C7",
            border:"2px solid #3E5879",
          }}
          value={announcementData.announcement}
          onChange={handleChange}
          placeholder="Enter Inner Announcement"
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
      <button
        className="btn btn-primary"
        onClick={handleCreateAnnouncement}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Creating..." : "Create Inner Announcement"}
      </button>
    </div>
  </div>
</div>

  );
};

export default InnerAnnouncement;
