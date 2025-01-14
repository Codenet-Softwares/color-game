import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";  // Assuming this is where the auth logic is
import GameService from "../../Services/GameService";  // Update with the appropriate service

const InnerAnnouncement = () => {
  const { user } = useAuth();
  const [announcementData, setAnnouncementData] = useState({
    announcement: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAnnouncement = async () => {
    const { announcement } = announcementData;  
    
    if (!announcement) {
      toast.error("Please provide an Announcement.");
      return;
    }
  
    const data = { announcement };
  
    try {
      const response = await GameService.CreateInnerAnnouncement(user, data);
      console.log("Create Inner Announcement API Response:", response.data);
      toast.success("Inner Announcement created successfully!");
      setAnnouncementData({ announcement: "" });
    } catch (error) {
      toast.error("Failed to create announcement. Please try again.");
      console.error("Error creating inner announcement:", error);
    }
  };

  return (
    <div className="container my-5">
      <h1>Create Inner Announcement</h1>
      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="announcement" className="form-label">
            Announcement
          </label>
          <input
            type="text"
            id="announcement"
            name="announcement"
            className="form-control"
            value={announcementData.announcement}
            onChange={handleChange}
            placeholder="Enter inner announcement"
          />
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleCreateAnnouncement}>
            Create Inner Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnerAnnouncement;
