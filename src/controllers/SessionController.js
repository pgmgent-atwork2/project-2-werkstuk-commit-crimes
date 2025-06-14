import SessionItem from "../lib/models/SessionItem.js";
import QuizItem from "../lib/models/QuizItem.js";

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllSessions = async (req, res) => {
  try {
    // Load sessions with their quiz
    const sessions = await SessionItem.query().withGraphFetched("quiz");

    // For each session, fetch all quizzes in the same group, including their questions
    const sessionsWithGroupQuizzes = await Promise.all(
      sessions.map(async (session) => {
        if (!session.quiz) return session;

        // Get all quizzes with the same group_id, including questions
        const groupQuizzes = await QuizItem.query()
          .where('group_id', session.quiz.group_id)
          .withGraphFetched('questions');

        return {
          ...session,
          groupQuizzes, // add all quizzes in the same group here
        };
      })
    );

    res.json(sessionsWithGroupQuizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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


export const checkExpiredSessions = async () => {
  try {
    const expiredSessionTimer = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const expiredSessions = await SessionItem.query()
      .where('created_at', '<', expiredSessionTimer)
      .where('second_try', false);

    for (const session of expiredSessions) {
      await SessionItem.query()
        .findById(session.id)
        .patch({ second_try: true });
      console.log(`Updated session ${session.id} to second_try=true`);
    }
  } catch (error) {
    console.error('Error checking expired sessions:', error);
  }
};

// checks if minutes are over
setInterval(checkExpiredSessions, 60 * 1000);