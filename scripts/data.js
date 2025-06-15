
document.getElementById("downloadExcelBtn").addEventListener("click", async () => {
  try {
    const [usersRes, sessionsRes, quizzesRes] = await Promise.all([
      fetch("http://localhost:3000/api/users"),
      fetch("http://localhost:3000/api/sessions"),
      fetch("http://localhost:3000/api/quiz"),
    ]);

    if (!usersRes.ok || !sessionsRes.ok || !quizzesRes.ok) {
      throw new Error("Kon data niet ophalen");
    }

    const users = await usersRes.json();
    const sessions = await sessionsRes.json();
    const quizzes = await quizzesRes.json();

    const dataToExport = users.map(user => {
      const session = sessions.find(s => s.id === user.session_id);
      const quiz = session ? quizzes.find(q => q.group_id === session.group) : null;

      return {
        Naam: user.name,
        Leeftijd: user.age,
        Taal: user.language,
        "Quiz Titel": quiz?.title || "Onbekend",
        "Eerste Score": user.first_score ?? "n.v.t.",
        "Tweede Score": user.second_score ?? "n.v.t.",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QuizResultaten");
    XLSX.writeFile(workbook, "quiz_resultaten.xlsx");

  } catch (error) {
    alert("Fout bij exporteren: " + error.message);
  }
});