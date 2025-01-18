import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../Utils/Auth";
import GameService from "../../../Services/GameService";

const AddGameGif = () => {
  const [file, setFile] = useState(null);
  const [gifPreview, setGifPreview] = useState(null);
  const auth = useAuth(); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setGifPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveGif = () => {
    setFile(null);
    setGifPreview(null);
  };

  const handleUploadGif = async () => {
    if (!file) {
      toast.error("Please select a GIF to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Gif = reader.result.split(",")[1]; 

      const data = {
        data: [
          {
            docBase: base64Gif,
            isActive: true,
          },
        ],
      };

      try {
        const response = await GameService.gifSliderImage(auth.user, data);
      
        toast.success("GIF uploaded successfully!");
        console.log(response.data);
        setFile(null);
        setGifPreview(null);
      } catch (error) {
        // Check if the error response exists and contains the `errMessage` property
        if (error.response && error.response.data && error.response.data.errMessage) {
          toast.error(error.response.data.errMessage); // Display the backend error message
        } else {
          toast.error("Failed to upload the GIF. Please try again."); // Fallback error message
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
          <h3 className="mb-0 fw-bold text-center text-uppercase p-2">Create GIF</h3>
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
              <h4 className="fw-bold">Choose GIF</h4>
              <i className="fas fa-plus-circle"></i>
              {gifPreview && (
                <img
                  src={gifPreview}
                  alt="GIF Preview"
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
            {gifPreview && (
              <div
                onClick={handleRemoveGif}
                style={{
                  cursor: "pointer",
                  color: "#FF0000",
                  marginTop: "10px",
                }}
              >
                <i className="fas fa-times"></i> Remove GIF
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/gif" 
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleUploadGif}>
              Upload GIF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGameGif;
