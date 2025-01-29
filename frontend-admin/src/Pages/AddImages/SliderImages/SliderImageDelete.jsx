import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import GameService from "../../../Services/GameService";
import { useAuth } from "../../../Utils/Auth";

const SliderImageDelete = () => {
  const auth = useAuth();
  const [sliderImages, setSliderImages] = useState({
    data: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    totalData: 0,
  });

  useEffect(() => {
    auth.showLoader();
    fetchSliderImages();
  }, []);

  const fetchSliderImages = () => {
    GameService.getSliderImage(auth.user)
      .then((res) => {
        setSliderImages((prev) => ({
          ...prev,
          data: res.data.data || [],
        }));
      })
      .catch((err) => {
        toast.error("Failed to load slider images.");
      })
      .finally(() => {
        auth.hideLoader();
      });
  };

  const handleDelete = async (imageId) => {
    auth.showLoader();
    try {
      await GameService.deleteCreatedImage(auth.user, imageId);
      toast.success(`Image Deleted successfully`);
      fetchSliderImages();
    } catch (error) {
      toast.error("Failed to delete the image. Please try again.");
    } finally {
      // Hide the loader after the request is complete (success or error)
      auth.hideLoader();
    }
  };

  const handleToggleActiveStatus = async (imageId, currentStatus) => {
    auth.showLoader();
    const newStatus = !currentStatus;
    try {
      const response = await GameService.activeInactiveImage(
        auth.user,
        imageId,
        newStatus
      );

      if (response && response.status === 200) {
        setSliderImages((prev) => ({
          ...prev,
          data: prev.data.map((image) =>
            image.imageId === imageId
              ? { ...image, isActive: newStatus }
              : image
          ),
        }));

        toast.success(
          `Image ${newStatus ? "activated" : "deactivated"} successfully.`
        );
      } else {
        toast.error("Failed to update image status. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update image status. Please try again.");
      console.error("API Error:", error);
    } finally {
      // Hide the loader after the request is complete (success or error)
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
          <h3 className="mb-0 fw-bold text-center text-uppercase p-2">
            Slider Images
          </h3>
        </div>
        <div className="card-body" style={{ background: "#E1D1C7" }}>
          <div
            className="card-container"
            style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
          >
            {sliderImages.data.length === 0 ? (
              <div className="text-center" style={{ width: "100%" }}>
                No images available.
              </div>
            ) : (
              sliderImages.data.map((slider, index) => (
                <div
                  key={slider.imageId}
                  className="card"
                  style={{
                    width: "385px",
                    border: "2px solid #6c757d",
                    borderRadius: "10px",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div className="card-body text-center">
                    <img
                      src={slider.image}
                      alt="Slider"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="card-footer">
                    <div
                      className="form-check form-switch d-flex justify-content-center align-items-center"
                      style={{ marginBottom: "16px" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`flexSwitch-${slider.imageId}`}
                        checked={slider.isActive}
                        onChange={() =>
                          handleToggleActiveStatus(
                            slider.imageId,
                            slider.isActive
                          )
                        }
                      />
                      <label className="form-check-label ms-2">
                        {slider.isActive ? "Active" : "Inactive"}
                      </label>
                    </div>
                    <div className="text-center">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(slider.imageId)}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderImageDelete;
