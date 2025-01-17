import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import GameService from "../../../Services/GameService";
import { useAuth } from "../../../Utils/Auth";
import { FaTrashAlt } from "react-icons/fa";

const UpdateGameSlider = () => {
  const auth = useAuth();
  const [sliderImages, setSliderImages] = useState([]);

  // Fetch slider images on component mount
  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const response = await GameService.getGameSliderImage(auth.user);
      setSliderImages(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch slider images.");
      console.error("Error fetching images:", error);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await GameService.deleteGameCreatedImage(auth.user, imageId);
      toast.success("Image deleted successfully!");
      // Refresh the list after deletion
      fetchSliderImages();
    } catch (error) {
      toast.error("Failed to delete the image. Please try again.");
      console.error("Error deleting image:", error);
    }
  };

  const handleToggleActiveStatus = async (imageId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const response = await GameService.activeInactiveGameImage(
        auth.user,
        imageId,
        newStatus
      );

      if (response && response.status === 200) {
        setSliderImages((prev) =>
          prev.map((image) =>
            image.imageId === imageId
              ? { ...image, isActive: newStatus }
              : image
          )
        );
        toast.success(
          `Image ${newStatus ? "activated" : "deactivated"} successfully.`
        );
      } else {
        toast.error("Failed to update image status. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update image status. Please try again.");
      console.error("API Error:", error);
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
          <h3 className="mb-0 fw-bold text-center">Update Game Slider</h3>
        </div>
        <div className="card-body"  style={{ background: "#D8C4B6" }}>
          {sliderImages.length === 0 ? (
            <div className="text-center">No slider images available.</div>
          ) : (
            <div className="row">
              {sliderImages.map((image, index) => (
                <div key={image.imageId} className="col-md-4 col-sm-4 mb-4">
                  <div className="card">
                    <img
                      src={image.image}
                      alt={`Slider ${index + 1}`}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <p className="card-text">
                        Status:{" "}
                        <span
                          style={{
                            color: image.isActive ? "green" : "red",
                          }}
                        >
                          {image.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                      <div className="d-flex justify-content-center my-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`flexSwitch-${image.imageId}`}
                            checked={image.isActive}
                            onChange={() =>
                              handleToggleActiveStatus(image.imageId, image.isActive)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexSwitch-${image.imageId}`}
                          ></label>
                        </div>
                      </div>

                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleDelete(image.imageId)}
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

export default UpdateGameSlider;
