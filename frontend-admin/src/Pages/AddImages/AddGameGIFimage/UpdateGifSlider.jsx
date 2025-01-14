import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../../Utils/Auth";
import { FaTrashAlt } from "react-icons/fa";
import GameService from "../../../Services/GameService";

const UpdateGifSlider = () => {
  const auth = useAuth();
  const [gifImages, setGifImages] = useState([]);

  // Fetch GIF slider images on component mount
  useEffect(() => {
    fetchGifImages();
  }, []);

  // Function to fetch GIF slider images
  const fetchGifImages = async () => {
    try {
      const response = await GameService.getGifSlider(auth.user);
      console.log("GIF API Response:", response.data); // Debugging
      setGifImages(response.data.data || []); // Ensure proper data mapping
    } catch (error) {
      toast.error("Failed to fetch GIF slider images.");
      console.error("Error fetching GIF images:", error);
    }
  };

  // Function to delete a GIF image
  const handleDelete = async (imageId) => {
    console.log("Deleting GIF ID:", imageId); // Debugging
    try {
      const response = await GameService.deleteCreateGif(auth.user, imageId);
      if (response.status === 200) {
        toast.success("GIF deleted successfully!");
        fetchGifImages(); // Refresh the list after deletion
      } else {
        toast.error("Failed to delete the GIF. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete the GIF. Please try again.");
      console.error("Error deleting GIF:", error);
    }
  };

  const handleToggleActiveStatus = async (imageId, currentStatus) => {
    const newStatus = !currentStatus;
    console.log("Toggling status for imageId:", imageId, "to:", newStatus);
  
    try {
      const response = await GameService.activeInactiveGameGif(auth.user, imageId, newStatus);
      console.log("API Response:", response.data); 
  
      if (response.status === 200) {
        setGifImages((prev) =>
          prev.map((gif) =>
            gif.imageId === imageId ? { ...gif, isActive: newStatus } : gif
          )
        );
        toast.success(`GIF ${newStatus ? "activated" : "deactivated"} successfully.`);
      } else {
        toast.error("Failed to update GIF status. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update GIF status. Please try again.");
      console.error("Error updating GIF status:", error);
    }
  };
  

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{
            backgroundColor: "#7D7D7D",
            color: "#FFFFFF",
          }}
        >
          <h3 className="mb-0 fw-bold text-center">Update GIF Slider</h3>
        </div>
        <div className="card-body">
          {gifImages.length === 0 ? (
            <div className="text-center">No GIF images available.</div>
          ) : (
            <div className="row">
              {gifImages.map((gif, index) => (
                <div key={gif.imageId} className="col-md-4 col-sm-4 mb-4">
                  <div className="card">
                    <img
                      src={gif.url}
                      alt={`GIF ${index + 1}`}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <p className="card-text">
                        Status:{" "}
                        <span
                          style={{
                            color: gif.isActive ? "green" : "red",
                          }}
                        >
                          {gif.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                      <div className="d-flex justify-content-center my-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`flexSwitch-${gif.imageId}`}
                            checked={gif.isActive}
                            onChange={() =>
                              handleToggleActiveStatus(gif.imageId, gif.isActive)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexSwitch-${gif.imageId}`}
                          ></label>
                        </div>
                      </div>
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleDelete(gif.imageId)}
                      >
                        <FaTrashAlt />
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

export default UpdateGifSlider;
