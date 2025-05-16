import AnswerItem from "../lib/models/AnswerItem.js";

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllAnswers = async (req, res) => {
  try {
    const answers = await AnswerItem.query();
    console.log(answers);
    res.json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
