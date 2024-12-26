import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Upload = ({
  CarouselImgData,
  idname,
  icon,
  index,
  updateCarouselData,
}) => {
  const [carouselData, setCarouselData] = useState(CarouselImgData);
  console.log(carouselData);

  useEffect(() => {
    // Ensure carouselData has values before calling updateCarouselData
    if (Object.keys(carouselData).length > 0) {
       const { image, ...restData } = carouselData;
      updateCarouselData(index, restData);
    }
  }, [carouselData, index]); 

  const handleCarouselDataChange = (name, value) => {
    let data;
    setCarouselData((prevCarouselData) => ({
      ...prevCarouselData,
      [name]: value,
    }));
    console.log(carouselData);
  };

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCarouselDataChange("doctype", file.type);
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        setCarouselData([]);
        toast.error("Only PDF or JPEG files are allowed");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          handleCarouselDataChange("image", URL.createObjectURL(file));
          const base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
          handleCarouselDataChange("docBase", base64String);
          handleCarouselDataChange("name", file.name);
          toast.success("Added successfully");
        };
      }
    }
  };

  return (
    <div className="white_card_body">
      <h6 className="card-subtitle mb-2">Upload Carousel</h6>

      <div
        className="mb-3"
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) {
            handleCarouselDataChange("doctype", file.type);
            const allowedTypes = [
              "application/pdf",
              "image/jpeg",
              "image/png",
              "image/jpg",
            ];
            if (!allowedTypes.includes(file.type)) {
              setCarouselData([]);
              toast.error("Only PDF or JPEG files are allowed");
            } else {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = () => {
                handleCarouselDataChange("image", URL.createObjectURL(file));
                const base64String = reader.result
                  .replace("data:", "")
                  .replace(/^.+,/, "");
                handleCarouselDataChange("docBase", base64String);
                handleCarouselDataChange("name", file.name);
                toast.success("Added successfully");
              };
            }
          }
        }}
      >
        <div className=" d-flex">
          <input
            type="file"
            className={`input-field${index} form-control`}
            hidden
            onChange={handleOnChange}
            required
            aria-describedby="basic-addon1"
          />
          {carouselData.image ? (
            <div
              className="card w-100 "
              onClick={() =>
                document.querySelector(`.input-field${index}`).click()
              }
              onDragOver={(e) => {
                e.preventDefault();
                window.close();
              }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  {" "}
                  <i className={icon}></i>
                  <p className="mx-4 text-success fw-bold">
                    {idname} Submit successfully
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="card w-100"
                onClick={() =>
                  document.querySelector(`.input-field${index}`).click()
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  window.close();
                }}
              >
                <div className="card-body">
                  <div className="d-flex">
                    {" "}
                    <i
                      className={icon}
                      style={{ marginTop: "0.5em", color: "darkred" }}
                    ></i>
                    <p className="mx-4">{idname}</p>
                  </div>
                </div>
              </div>
              <label className="input-group-text" for="inputGroupFile02">
                Upload
              </label>
            </>
          )}
        </div>
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text">
          <span className="" id="basic-addon1">
            Carousel Heading
          </span>
        </div>
        <input
          type="text"
          className={`form-control ${index}`}
          placeholder=" Text...."
          aria-describedby="basic-addon1"
          value={carouselData.headingText}
          onChange={(e) =>
            handleCarouselDataChange("headingText", e.target.value)
          }
        />
      </div>
      <div className="input-group mb-3">
        <div className="input-group-text">
          <span className="" id="basic-addon1">
            Carousel Text
          </span>
        </div>
        <input
          type="text"
          className={`form-control ${index}`}
          placeholder=" Text...."
          aria-describedby="basic-addon1"
          value={carouselData.text}
          onChange={(e) => handleCarouselDataChange("text", e.target.value)}
        />
      </div>
    </div>
  );
};

export default Upload;
