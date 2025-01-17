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
      });
  };


  const handleDelete = async (imageId) => {
    try {
      await GameService.deleteCreatedImage(auth.user, imageId);
      toast.success(`Image Deleted successfully`);
      fetchSliderImages();
    } catch (error) {
      toast.error("Failed to delete the image. Please try again.");
      console.error(error);
    }
  };

  const handleToggleActiveStatus = async (imageId, currentStatus) => {
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
          <h3 className="mb-0 fw-bold text-center">Slider Images</h3>
        </div>
        <div className="card-body" style={{ background: "#D8C4B6" }}>
          <div className="table-responsive">
            <table
              className="table table-striped table-hover rounded-table"
              style={{
                border: "2px solid #6c757d",
                borderRadius: "10px",
              }}
            >
              <thead
                className="table-primary"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Serial Number</th>
                  <th>Slider Image</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sliderImages.data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No images available.
                    </td>
                  </tr>
                ) : (
                  sliderImages.data.map((slider, index) => (
                    <tr key={slider.imageId}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={slider.image}
                          alt="Slider"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`flexSwitch-${slider.imageId}`}
                            checked={slider.isActive}
                            onChange={() =>
                              handleToggleActiveStatus(slider.imageId, slider.isActive)
                            }
                          />
                          <label className="form-check-label">
                            {slider.isActive ? "Active" : "Inactive"}
                          </label>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(slider.imageId)}
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderImageDelete;
