import JWT from "jsonwebtoken";
import user_model from "../model/user_model.js";
//Protected route toke base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//Admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await user_model.findById(req.user._id);
    if (user.role !== 1) {
      return res
        .status(401)
        .send({ success: false, meassage: "UnAuthorized Access" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ success: false, error, meassage: "Error in admin middleware" });
  }
};
