import User from "../models/UserModel.js";

export const seachContacts = async (req, res, next) => {
  try {
    const { seachTerm } = req.body;
    if (seachTerm === undefined || seachTerm === null) {
      return res.status(400).send("search is required");
    }
    //remove special characters from search
    const sanitized = seachTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitized, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};
