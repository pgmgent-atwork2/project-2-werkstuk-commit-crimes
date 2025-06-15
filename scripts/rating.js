document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitFeedback");
  const allStars = document.querySelectorAll(".star");
  const expectedCount = document.querySelectorAll(".stars").length;
  const ratings = {};

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("user_id");
  const quizId = urlParams.get("quiz_id");
  const sessionId = urlParams.get("session_id");

  function handleStarClick(star) {
    const questionId = star.parentElement.dataset.question;
    const value = parseInt(star.dataset.value);
    ratings[questionId] = value;
    updateStarsUI(questionId, value);
    console.log(`Rating opgeslagen: vraag ${questionId} = ${value} sterren`);
  }

  function updateStarsUI(questionId, value) {
    const starsInQuestion = document.querySelectorAll(
      `.stars[data-question="${questionId}"] .star`
    );
    starsInQuestion.forEach((s) => s.classList.remove("active"));
    for (let i = 0; i < value; i++) {
      starsInQuestion[i].classList.add("active");
    }
  }

  function handleStarMouseOver(star) {
    const questionId = star.parentElement.dataset.question;
    const value = parseInt(star.dataset.value);
    const starsInQuestion = document.querySelectorAll(
      `.stars[data-question="${questionId}"] .star`
    );
    starsInQuestion.forEach((s, i) => {
      if (i < value) s.classList.add("hover");
      else s.classList.remove("hover");
    });
  }

  function handleStarMouseOut(star) {
    const questionId = star.parentElement.dataset.question;
    const starsInQuestion = document.querySelectorAll(
      `.stars[data-question="${questionId}"] .star`
    );
    starsInQuestion.forEach((s) => s.classList.remove("hover"));
  }

  async function sendFeedback() {
    const userId = urlParams.get("user_id");
    const sessionId = urlParams.get("session_id");
    if (!userId || !quizId || !sessionId) {
      alert(
        "Ongeldige URL: user_id, quiz_id en session_id moeten aanwezig zijn."
      );
      return;
    }

    if (Object.keys(ratings).length !== expectedCount) {
      alert("Beantwoord alle vragen aub.");
      return;
    }

    try {
    for (const [questionId, rating] of Object.entries(ratings)) {
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          feedback: `Rating voor vraag ${questionId}`,
          rating, 
        }),
      });


        if (!response.ok) {
          throw new Error(
            `Feedback voor vraag ${questionId} kon niet verstuurd worden.`
          );
        }
      }
      alert("Bedankt voor je feedback!");
    } catch (error) {
      alert(`Fout bij versturen feedback: ${error.message}`);
    }
  }

  allStars.forEach((star) => {
    star.addEventListener("click", () => handleStarClick(star));
    star.addEventListener("mouseover", () => handleStarMouseOver(star));
    star.addEventListener("mouseout", () => handleStarMouseOut(star));
  });

  submitBtn.addEventListener("click", sendFeedback);
});
