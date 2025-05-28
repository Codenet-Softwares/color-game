import axios from "axios";
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";

export const getSliderTextImg = async (req, res) => {
  try {
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/slider-text-img`);
    const {data}=response.data

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to fetch")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(data, true, statusCode.success, "Success")
    );

  } catch (error) {
    if (error.response && error.response.data) {
      const errMessage = error.response.data.errMessage || "Something went wrong";
      const responseCode = error.response.data.responseCode || statusCode.internalServerError;

      return res.status(responseCode).send(
        apiResponseErr([], true, responseCode, errMessage)
      );
    }

    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};



export const getGif = async (req, res) => {
  try {
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-gif`);
    const {data}=response.data
    

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to fetch")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(data, true, statusCode.success, "Success")
    );

  } catch (error) {
    if (error.response && error.response.data) {
      const errMessage = error.response.data.errMessage || "Something went wrong";
      const responseCode = error.response.data.responseCode || statusCode.internalServerError;

      return res.status(responseCode).send(
        apiResponseErr([], true, responseCode, errMessage)
      );
    }

    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getGameImg = async (req, res) => {
  try {
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-game-img`);
    const {data}=response.data
   

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to fetch")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(data, true, statusCode.success, "Success")
    );

  } catch (error) {
    if (error.response && error.response.data) {
      const errMessage = error.response.data.errMessage || "Something went wrong";
      const responseCode = error.response.data.responseCode || statusCode.internalServerError;

      return res.status(responseCode).send(
        apiResponseErr([], true, responseCode, errMessage)
      );
    }

    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getInnerImg = async (req, res) => {
  try {
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-inner-game-img`);
    const {data}=response.data

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to fetch")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(data, true, statusCode.success, "Success")
    );

  } catch (error) {
    if (error.response && error.response.data) {
      const errMessage = error.response.data.errMessage || "Something went wrong";
      const responseCode = error.response.data.responseCode || statusCode.internalServerError;

      return res.status(responseCode).send(
        apiResponseErr([], true, responseCode, errMessage)
      );
    }

    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getAnnouncement = async (req, res) => {
  try {  
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-announcements`);
    const {data}=response.data

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to fetch")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(data, true, statusCode.success, "Success")
    );

  } catch (error) {
    if (error.response && error.response.data) {
      const errMessage = error.response.data.errMessage || "Something went wrong";
      const responseCode = error.response.data.responseCode || statusCode.internalServerError;

      return res.status(responseCode).send(
        apiResponseErr([], true, responseCode, errMessage)
      );
    }

    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getInnerAnnouncement = async (req, res) => {
  try {   
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-inner-announcements`);
    const {data}=response.data

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to fetch")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(data, true, statusCode.success, "Success")
    );

  } catch (error) {
    if (error.response && error.response.data) {
      const errMessage = error.response.data.errMessage || "Something went wrong";
      const responseCode = error.response.data.responseCode || statusCode.internalServerError;

      return res.status(responseCode).send(
        apiResponseErr([], true, responseCode, errMessage)
      );
    } 
    
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};