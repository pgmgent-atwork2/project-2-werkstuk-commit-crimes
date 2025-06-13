document.getElementById("quizForm").addEventListener("submit", function(e) {
    e.preventDefault(); 

    const day = document.getElementById("day-select").value;
    const month = document.getElementById("month-select").value;
    const year = document.getElementById("year-select").value;

    if (!day || !month || year === "jaar") {
      alert("Vul alstublieft alle velden in.");
      return;
    }

    startQuiz(day, month, year);
  });

