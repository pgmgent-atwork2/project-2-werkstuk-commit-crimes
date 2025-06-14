import UserItem from "../lib/models/UserItem.js";
import SessionItem from "../lib/models/SessionItem.js";
import FeedbackItem from "../lib/models/FeedbackItem.js";

export const index = (req, res) => {
  res.render("layout", {
    title: "Make It Happen",
    body: "index",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserItem.query().withGraphFetched("feedback");
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
  console.log("Ontvangen data:", req.body);
  const { name, day, month, year, language } = req.body;

  if (!name || !day || !month || !year || !language) {
    return res.status(400).json({ error: "alle velden zijn verplicht" });
  }

  const birthdate = new Date(`${year}-${month}-${day}`);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }

  try {
    console.log("Probeer gebruiker toe te voegen:", { name, age, language });
    const user = await UserItem.query().insert({
      name,
      age,
      language,
    });
    console.log("Gebruiker toegevoegd:", user);
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Fout bij het aanmaken van de gebruiker:", error);
    res.status(500).json({
      error: "gebruiker kon niet aangemaakt worden",
      details: error.message,
      stack: error.stack,
    });
  }
};

export const updateUserSession = async (req, res) => {
  const { user_id, session_id } = req.body;

  if (!user_id || !session_id) {
    return res.status(400).json({ error: "user_id en session_id zijn verplicht" });
  }

  try {
    const updatedUser = await UserItem.query()
      .patchAndFetchById(user_id, { session_id });

    if (!updatedUser) {
      return res.status(404).json({ error: "User niet gevonden" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kon user niet updaten" });
  }
};


export const saveScore = async (req, res) => {
  const { session_id, user_id, score } = req.body;

  if (!session_id || !user_id || score === undefined) {
    return res.status(400).json({ error: "session_id, user_id en score zijn verplicht" });
  }

  try {
    const session = await SessionItem.query().findById(session_id);
    console.log("Session from DB:", session);

    if (!session) {
      return res.status(404).json({ error: "Sessie niet gevonden" });
    }

    const isSecondTry = session.second_try == 1;

    const patchData = isSecondTry
      ? { second_score: score }
      : { first_score: score };

    const updatedUser = await UserItem.query()
      .patchAndFetchById(user_id, patchData);

    if (!updatedUser) {
      return res.status(404).json({ error: "Gebruiker niet gevonden" });
    }

    res.json({ success: true, user: updatedUser, attempt: isSecondTry ? "second_try" : "first_try" });
  } catch (error) {
    console.error("Fout bij opslaan score:", error);
    res.status(500).json({ error: "Kon score niet opslaan" });
  }
};