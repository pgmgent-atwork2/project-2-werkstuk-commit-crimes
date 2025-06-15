import SessionItem from "../lib/models/SessionItem.js";
import QuizItem from "../lib/models/QuizItem.js";

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

export const createSession = async (req, res) => {
  try {
    const { group_id, password } = req.body;
    
    const newSession = await SessionItem.query().insert({
      group: Number(group_id), 
      password: password,
      second_try: false
    });

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const checkExpiredSessions = async () => {
  try {
    const now = Date.now();
    const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000);
    const twoHoursThirtyMinutesAgo = new Date(now - 150 * 60 * 1000);

    const formatted30MinAgo = thirtyMinutesAgo.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
    const formatted2h30MinAgo = twoHoursThirtyMinutesAgo.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');

    const sessionsForSecondTry = await SessionItem.query()
      .where('created_at', '<', formatted30MinAgo)
      .where('second_try', false);

    for (const session of sessionsForSecondTry) {
      await SessionItem.query()
        .findById(session.id)
        .patch({ second_try: true });
      console.log(`Marked session ${session.id} as second_try (created at: ${session.created_at})`);
    }

    const sessionsToDelete = await SessionItem.query()
      .where('created_at', '<', formatted2h30MinAgo);

    for (const session of sessionsToDelete) {
      await SessionItem.query()
        .deleteById(session.id);
      console.log(`Deleted session ${session.id} (created at: ${session.created_at})`);
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