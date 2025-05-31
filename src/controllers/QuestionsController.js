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
          question_text: req.body.question_text,
          image: req.body.image
        });
        res.json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateQuestion = async (req, res) => {
  try {
    const updated = await QuestionItem.query()
      .patchAndFetchById(req.params.id, {
        question_text: req.body.question_text,
        image: req.body.image
      });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await QuestionItem.query().deleteById(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};