import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrashAlt } from "react-icons/fa";
import GameService from "../../../Services/GameService"; // Update the path to your GameService
import { useAuth } from "../../../Utils/Auth"; // Ensure this is correct

const UpdateInnerImage = () => {
  const auth = useAuth();
  const [innerImages, setInnerImages] = useState([]);

  // Fetch images on component mount
  useEffect(() => {
    fetchInnerImages();
  }, []);
  const fetchInnerImages = async () => {
    try {
      const response = await GameService.getInnerSliderImage(auth.user);
      console.log(response.data); // Log the response to check its structure
      setInnerImages(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch inner images.");
      console.error("Error fetching images:", error);
    }
  };
  

  const handleDelete = async (imageId) => {
    try {
      await GameService.deleteCreateInnerImage(auth.user, imageId); 
      toast.success("Image deleted successfully!");
      fetchInnerImages(); // Refresh the list after deletion
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
        setInnerImages((prev) =>
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
          <h3 className="mb-0 fw-bold text-center text-uppercase p-2">Update Inner Images</h3>
        </div>
        <div className="card-body" style={{ background: "#D8C4B6" }}>
          {innerImages.length === 0 ? (
            <div className="text-center">No images available.</div>
          ) : (
            <div className="row">
              {innerImages.map((image, index) => (
                <div key={image.imageId} className="col-md-4 col-sm-4 mb-4">
                  <div className="card">
                    <img
                      src={image.image} // Ensure the image path is correct
                      alt={`Inner Image ${index + 1}`}
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
                        <FaTrashAlt /> Delete
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

export default UpdateInnerImage;
