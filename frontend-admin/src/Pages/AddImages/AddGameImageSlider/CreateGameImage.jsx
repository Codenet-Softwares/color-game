import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../Utils/Auth";
import GameService from "../../../Services/GameService";
import UpdateGameSlider from "./UpdateGameSlider";

const CreateGameImage = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationMessage, setValidationMessage] = useState(""); // State for validation message
  const auth = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Reset validation message when a new file is selected
    setValidationMessage("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    setValidationMessage(""); // Reset validation message when the image is removed
  };

  const handleUploadImage = async () => {
    // Validation before upload
    if (!file) {
      setValidationMessage("Please select an image to upload.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setValidationMessage("Please select a valid image file.");
      return;
    }

    // const maxFileSize = 5 * 1024 * 1024;
    // if (file.size > maxFileSize) {
    //   setValidationMessage("File size exceeds the 5MB limit.");
    //   return;
    // }

    const reader = new FileReader();
    reader.onloadend = async () => {
      auth.showLoader(); 

      const base64Image = reader.result.split(",")[1];

      const data = {
        data: [
          {
            docBase: base64Image,
            isActive: true,
          },
        ],
      };

      try {
        const response = await GameService.gameSliderImage(auth.user, data);

        toast.success("Image uploaded successfully!");
        setFile(null);
        setImagePreview(null);
        setValidationMessage(""); 
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errMessage) {
          toast.error(error.response.data.errMessage);
        } else {
          toast.error("Failed to upload the image. Please try again.");
        }
        console.error(error);
      } finally {
        auth.hideLoader(); 
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="container p-5">
        <div>
          <div className="mb-4 text-center">
            <div
              onClick={() => document.getElementById("file-input").click()}
              style={{
                display: "inline-block",
                cursor: "pointer",
                fontSize: "40px",
                color: "#3E5879",
                padding: "30px",
                border: "2px solid #3E5879",
                borderRadius: "8px",
                backgroundColor: "lightgray",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <h4 className="fw-bold">Choose Image</h4>
              <i className="fas fa-plus-circle"></i>
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

            {/* Show validation message below the image selection */}
            {validationMessage && (
              <div
                style={{
                  color: "#FF0000",
                  marginTop: "10px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {validationMessage}
              </div>
            )}

            {imagePreview && (
              <div
                onClick={handleRemoveImage}
                style={{
                  cursor: "pointer",
                  color: "#FF0000",
                  marginTop: "10px",
                }}
              >
                <i className="fas fa-times"></i> Remove Image
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
            <button className="btn btn-primary" onClick={handleUploadImage}>
              Upload Image
            </button>
          </div>
        </div>
      <UpdateGameSlider/>
    </div>
  );
};

export default CreateGameImage;
