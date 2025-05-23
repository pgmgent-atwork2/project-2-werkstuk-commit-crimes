import QuestionItem from "../lib/models/QuestionItem.js";
 
export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await QuestionItem.query().withGraphFetched("answers");
    console.log(questions);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const postQuestion = async (req, res) => {
    try {
        const newQuestion = await QuestionItem.query().insert({
          question: req.body.question,
          image: req.body.image
        });
        res.json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}