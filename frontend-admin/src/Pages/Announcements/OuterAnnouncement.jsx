import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";

const OuterAnnouncement = () => {
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
      toast.error("Please provide a Announcement.");
      return;
    }
  
    const data = { announcement };  
  
    try {
      const response = await GameService.CreateOuterAnnouncement(user, data);
      console.log("Create API Response:", response.data); 
      toast.success("Announcement created successfully!");
      setAnnouncementData({ announcement: "" });
    } catch (error) {
      toast.error("Failed to create announcement. Please try again.");
      console.error("Error creating announcement:", error);
    }
  };
  
  
  return (
    <div className="container my-5">
      <h1>Create Outer Announcement</h1>
      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="announcement"
            name="announcement"
            className="form-control"
            value={announcementData.announcement}
            onChange={handleChange}
            placeholder="Enter title"
          />
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={handleCreateAnnouncement}>
            Create Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default OuterAnnouncement;
