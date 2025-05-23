import QuizItem from "../lib/models/QuizItem";

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllQuizes = async (req, res) => {
  try {
    const quizes = await QuizItem.query().withGraphFetched("question");
    console.log(quizes);
    res.json(quizes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};