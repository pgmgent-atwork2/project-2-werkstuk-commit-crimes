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
  const { name, day, month, year } = req.body;

  if (!name || !day || !month || !year) {
    return res.status(400).json({ error: "alle velden zijn verplicht" });
  }

  const birthdate = new Date(`${year}/${month}/${day}`);
  const age = new Date().getFullYear() - birthdate.getFullYear();

  try {
    console.log("Probeer gebruiker toe te voegen:", { name, age });
    const user = await UserItem.query().insert({
      name,
      age,
    });
    console.log("Gebruiker toegevoegd:", user);
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Fout bij het aanmaken van de gebruiker:", error);
    res.status(500).json({ error: "gebruiker kon niet aangemaakt worden" });
  }
};
