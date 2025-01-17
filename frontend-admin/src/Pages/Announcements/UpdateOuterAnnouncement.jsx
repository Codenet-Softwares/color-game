import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";

const UpdateOuterAnnouncement = () => {
  const auth = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await GameService.getOuterAnnouncement(auth.user);
      console.log("Fetch API Response:", response.data);  
      setAnnouncements(response.data.data || []);  
    } catch (error) {
      toast.error("Failed to fetch announcements.");
      console.error("Error fetching announcements:", error);
    }
  };
  
  const handleDelete = async (announceId) => {
    try {
      await GameService.deleteOuterAnnouncement(auth.user, announceId);  
      toast.success("Announcement deleted successfully!");
      fetchAnnouncements(); 
    } catch (error) {
      toast.error("Failed to delete the announcement. Please try again.");
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="container my-5 p-5">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{
            backgroundColor: "#3E5879",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold text-center">Update Outer Announcement</h3>
        </div>
        <div className="card-body" style={{ background: "#D8C4B6" }}>
          {announcements.length === 0 ? (
            <div className="text-center">No announcements available.</div>
          ) : (
            <div className="row">
              {announcements.map((announcement) => (
                <div key={announcement.announceId} className="col  mb-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5 className="card-title">{announcement.announcement || "No Title"}</h5> 
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleDelete(announcement.announceId)} 
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateOuterAnnouncement;
