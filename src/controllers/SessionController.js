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
    const sessions = await SessionItem.query().withGraphFetched("quiz").withGraphFetched("user");


    const sessionsWithGroupQuizzes = await Promise.all(
      sessions.map(async (session) => {
        if (!session.quiz) return session;


        const groupQuizzes = await QuizItem.query()
          .where('group_id', session.quiz.group_id)
          .withGraphFetched('questions');

        return {
          ...session,
          groupQuizzes, 
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
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const formattedTime = thirtyMinutesAgo.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');

    const expiredSessions = await SessionItem.query()
      .where('created_at', '<', formattedTime)
      .where('second_try', false);

    for (const session of expiredSessions) {
      await SessionItem.query()
        .findById(session.id)
        .patch({ second_try: true });
      console.log(`Marked session ${session.id} as second_try (created at: ${session.created_at})`);
    }
  } catch (error) {
    console.error('Error checking expired sessions:', error);
  }
};

// checks if minutes are over
setInterval(checkExpiredSessions, 1 * 60 * 1000);

export const getActiveSessions = async (req, res) => {
  try {
    const timeLimit = new Date(Date.now() - 2.5 * 60 * 60 * 1000);

    const activeSessions = await SessionItem.query()
      .where('created_at', '>', timeLimit)
      .orderBy('created_at', 'desc');

    if (!activeSessions || activeSessions.length === 0) {
      return res.status(404).json({ error: "Geen actieve sessies gevonden" });
    }

    res.json(activeSessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fout bij ophalen van actieve sessies" });
  }
};