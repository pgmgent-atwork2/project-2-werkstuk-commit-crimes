import SessionItem from "../lib/models/SessionItem";

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await SessionItem.query().withGraphFetched("user");
    console.log(sessions);
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};