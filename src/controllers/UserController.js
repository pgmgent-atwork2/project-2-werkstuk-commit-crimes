import UserItem from "../lib/models/UserItem.js";

export const index = (req, res) => {
  res.render("layout", {
    title: "Make It Happen",
    body: "index",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserItem.query().withGraphFetched("session");
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const registerUser = async (req, res) => {
  const { name, day, month, year, session__id } = req.body;

  if (!name || !day || !month || !year || !session__id) {
    return res.status(400).json({error: "alle velden zijn verplicht"})
  }

  const birthdate = new Date(`${year}/${month}/${day}`)

  const age = new Date().getFullYear() - birthdate.getFullYear();

  try {
    const user  = await UserItem.query().insert({
      name,
      age,
      session__id,
    });

    res.redirect("/quiz.html")
  } catch(error) {
    res.status(500).json({ error: "gebruiker kon niet aangemaakt worden"})
  }
}