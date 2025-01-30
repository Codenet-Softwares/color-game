import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";

const UpdateInnerAnnouncement = () => {
  const auth = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    auth.showLoader();
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await GameService.getInnerAnnouncement(auth.user);  
      setAnnouncements(response.data.data || []);  
    } catch (error) {
      toast.error("Failed to fetch inner announcements.");
      console.error("Error fetching inner announcements:", error);
    }finally {
      auth.hideLoader();
    }
  };

  const handleDelete = async (announceId) => {
    auth.showLoader();
    try {
      await GameService.deleteInnerAnnouncement(auth.user, announceId);  
      toast.success("Inner Announcement deleted successfully!");
      fetchAnnouncements(); 
    } catch (error) {
      toast.error("Failed to delete the inner announcement. Please try again.");
      console.error("Error deleting inner announcement:", error);
    }finally {
      auth.hideLoader();
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
          <h3 className="mb-0 fw-bold text-center text-uppercase p-2">Update Inner Announcement</h3>
        </div>
        <div className="card-body" style={{ background: "#E1D1C7" }}>
          {announcements.length === 0 ? (
            <div className="text-center">No inner announcements available.</div>
          ) : (
            <div className="row">
              {announcements.map((announcement) => (
                <div key={announcement.announceId} className="col mb-4">
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

export default UpdateInnerAnnouncement;
