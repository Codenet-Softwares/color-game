import axios from "axios";
import jwt from "jsonwebtoken"
import { statusCode } from "../helper/statusCodes.js";
import { apiResponseErr, apiResponseSuccess } from "../middleware/serverError.js";

export const getAllSliderTextImg = async (req, res) => {
  try {
    // const token = jwt.sign(
    //   { role: req.user.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    // );

    // console.log("token..........", token)
    
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/all-slider-text-img`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
// }
    });
    const {data}=response.data.data
    console.log("data........",data)

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to get market")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(response.data.data, true, statusCode.success, "Success")
    );

  } catch (error) {
    console.log("err....", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getAllGif = async (req, res) => {
  try {
    // const token = jwt.sign(
    //   { role: req.user.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    // );

    // console.log("token..........", token)
    
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-all-gif`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
// }
    });
    const {data}=response.data.data
    console.log("data........",data)

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to get market")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(response.data.data, true, statusCode.success, "Success")
    );

  } catch (error) {
    console.log("err....", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getAllGameImg = async (req, res) => {
  try {
    // const token = jwt.sign(
    //   { role: req.user.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    // );

    // console.log("token..........", token)
    
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-all-game-img`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
// }
    });
    const {data}=response.data.data
    console.log("data........",data)

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to get market")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(response.data.data, true, statusCode.success, "Success")
    );

  } catch (error) {
    console.log("err....", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getAllInnerImg = async (req, res) => {
  try {
    // const token = jwt.sign(
    //   { role: req.user.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    // );

    // console.log("token..........", token)
    
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-all-inner-img`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
// }
    });
    const {data}=response.data.data
    console.log("data........",data)

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to get market")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(response.data.data, true, statusCode.success, "Success")
    );

  } catch (error) {
    console.log("err....", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getAnnouncement = async (req, res) => {
  try {
    // const token = jwt.sign(
    //   { role: req.user.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    // );

    // console.log("token..........", token)
    
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-admin-announcements`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
// }
    });
    const {data}=response.data.data
    console.log("data........",data)

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to get market")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(response.data.data, true, statusCode.success, "Success")
    );

  } catch (error) {
    console.log("err....", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};

export const getInnerAnnouncement = async (req, res) => {
  try {
    // const token = jwt.sign(
    //   { role: req.user.role },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    // );

    // console.log("token..........", token)
    
    const baseURL = process.env.WHITE_LABEL_URL;

    const response = await axios.get(`${baseURL}/api/admin/get-admin-inner-announcements`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
// }
    });
    const {data}=response.data.data
    console.log("data........",data)

    if (!response.data.success) {
      return res.status(statusCode.badRequest).send(
        apiResponseErr(null, false, statusCode.badRequest, "Failed to get market")
      );
    }

    return res.status(statusCode.success).send(
      apiResponseSuccess(response.data.data, true, statusCode.success, "Success")
    );

  } catch (error) {
    console.log("err....", error);
    return res.status(statusCode.internalServerError).send(
      apiResponseErr(null, false, statusCode.internalServerError, error.message)
    );
  }
};