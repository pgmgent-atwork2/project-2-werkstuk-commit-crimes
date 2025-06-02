import QuizItem from "../lib/models/QuizItem.js";

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllQuizes = async (req, res) => {
  try {
    const quizes = await QuizItem.query().withGraphFetched("questions");
    console.log(quizes);
    res.json(quizes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export async function updateQuiz(req, res) {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const updatedQuiz = await QuizItem.query()
      .patchAndFetchById(id, { title });

    res.status(200).json(updatedQuiz);
  } catch (err) {
    console.error("Fout bij updaten quiz:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
}
