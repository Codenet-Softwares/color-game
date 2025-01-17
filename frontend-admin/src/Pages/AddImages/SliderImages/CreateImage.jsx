import React, { useState } from "react";
import GameService from "../../../Services/GameService";
import { useAuth } from "../../../Utils/Auth";
import { toast } from "react-toastify";

const CreateImage = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const auth = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setImagePreview(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleAddImage = async () => {
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const docBase = reader.result;
      const base64Image = docBase.split(",")[1];

      const data = {
        data: [
          {
            docBase: base64Image,
            isActive: true,
          },
        ],
      };

      try {
        const response = await GameService.createSliderImage(auth.user, data);
      
        toast.success("Image uploaded successfully!");
        console.log(response.data);
        setFile(null);
        setImagePreview(null);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errMessage) {
          toast.error(error.response.data.errMessage); 
        } else {
          toast.error("Failed to upload the image. Please try again."); 
        }
        console.error(error);
      }
      
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="container p-5">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{ backgroundColor: "#3E5879", color: "#FFFFFF" }}
        >
          <h3 className="mb-0 fw-bold text-center">Create Slider Image</h3>
        </div>
        <div className="card-body" style={{ background: "#D8C4B6" }}>
          <div className="mb-4 text-center">
            <div
              onClick={() => document.getElementById("file-input").click()}
              style={{
                display: "inline-block",
                cursor: "pointer",
                fontSize: "40px",
                color: "#007BFF",
                padding: "30px",
                border: "2px solid #007BFF",
                borderRadius: "8px",
                backgroundColor: "lightgray",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <h4 className="fw-bold">Choose Image</h4>
              <i className="fas fa-plus-circle"></i>
              {/* Display the image preview if available */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              )}
            </div>

            {/* Cross button outside the box */}
            {imagePreview && (
              <div
                onClick={handleRemoveImage}
                style={{
                  cursor: "pointer",
                  color: "#FF0000",
                }}
              >
                <i className="fas fa-times"></i>
              </div>
            )}

            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="text-center">
            <button className="btn btn-primary" onClick={handleAddImage}>
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateImage;
  