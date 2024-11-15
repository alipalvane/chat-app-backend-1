import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";
import User from "../models/UserModel.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;
//CREATE TOKEN
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

//SIGNUP
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("email and password is required");
    }

    const user = await User.create({ email, password });

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};

//LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("email and password is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(404).send("Password is incorrect.");
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};

//USER INFO
export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("Id not found");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};

//UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).send("First name and Last name is required");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};

//ADD PROFILE IMAGE
export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is requred");
    }
    const date = Date.now();
    let fileName = "upload/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        image: fileName,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};

//REMOVE PROFILE IMAGE
export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("user not found");
    }
    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("profile image removed");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};

//LOGOUT
export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt","", {maxAge:1, secure:true, sameSite:"None"})
    return res.status(200).send("log out successfully");
  } catch (error) {
    console.log({ error });
    return res.status(500).send("internal error from server");
  }
};
