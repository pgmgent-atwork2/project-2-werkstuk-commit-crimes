import UserAnswer from "../lib/models/UserAnswer.js";
import UserItem from "../lib/models/UserItem.js";

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserItem.query().withGraphFetched("[session, answers]");
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};