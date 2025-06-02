import AnswerItem from "../lib/models/AnswerItem.js";

export const index = (req, res) => {
  res.render("layout", {
    title: "Make It Happen",
    body: "index",
  });
};

export const getAllAnswers = async (req, res) => {
  try {
    const answers = await AnswerItem.query().withGraphFetched("question");
    console.log(answers);
    res.json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAnswer = async (req, res) => {
  const id = req.params.id;
  const { answer_text } = req.body;

  try {
    const updatedAnswer = await AnswerItem.query().patchAndFetchById(id, {
      answer_text,
    });

    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.json(updatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAnswer = async (req, res) => {
  const id = req.params.id;

  try {
    const rowsDeleted = await AnswerItem.query().deleteById(id);

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.json({ message: "Answer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postAnswer = async (req, res) => {
  try {
    const { question_id, answer_text, is_correct } = req.body;
    const newAnswer = await AnswerItem.query().insert({
      question_id,
      answer_text,
      is_correct,
    });
    res.status(201).json(newAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
