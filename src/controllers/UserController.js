import UserItem from "../lib/models/UserItem.js";

export const index = (req, res) => {
  res.render("layout", {
    title: "Make It Happen",
    body: "index",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserItem.query();
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