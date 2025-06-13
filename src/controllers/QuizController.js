import QuizItem from "../lib/models/QuizItem.js";

export const index = (req, res) => {
  res.render("layout", {
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

    const updatedQuiz = await QuizItem.query().patchAndFetchById(id, { title });

    res.status(200).json(updatedQuiz);
  } catch (err) {
    console.error("Fout bij updaten quiz:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
}

export async function createQuiz(req, res) {
  try {
    const { title, language } = req.body;
    if (!title || !language) {
      return res.status(400).json();
    }
    const newQuiz = await QuizItem.query().insert({ title, language });
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Fout bij aanmaken quiz:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteQuiz(req, res) {
  try {
    const { id } = req.params;
    await QuizItem.query().deleteById(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Fout bij verwijderen quiz:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getQuizWithQuestions(req, res) {
  try {
    const quiz = await Quiz.query()
      .findById(req.params.id)
      .withGraphFetched("vragen.[antwoorden]");

    if (!quiz) {
      return res.status(404).json({ error: "Quiz niet gevonden" });
    }

    res.json({ questions: quiz.vragen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fout bij ophalen van quizvragen" });
  }
}