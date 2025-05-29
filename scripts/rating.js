document.addEventListener("DOMContentLoaded", function () {
  const allStars = document.querySelectorAll(".star");

  allStars.forEach((star) => {
    star.addEventListener("click", function () {
      const questionId = this.parentElement.dataset.question;
      const value = parseInt(this.dataset.value);

      const starsInQuestion = document.querySelectorAll(
        `.stars[data-question="${questionId}"] .star`
      );
      starsInQuestion.forEach((s) => s.classList.remove("active"));

      for (let i = 0; i < value; i++) {
        starsInQuestion[i].classList.add("active");
      }

      console.log(`Rating for question ${questionId}: ${value} stars`);
    });

    star.addEventListener("mouseover", function () {
      const questionId = this.parentElement.dataset.question;
      const value = parseInt(this.dataset.value);

      const starsInQuestion = document.querySelectorAll(
        `.stars[data-question="${questionId}"] .star`
      );

      starsInQuestion.forEach((s, index) => {
        if (index < value) {
          s.classList.add("hover");
        } else {
          s.classList.remove("hover");
        }
      });
    });

    star.addEventListener("mouseout", function () {
      const questionId = this.parentElement.dataset.question;
      const starsInQuestion = document.querySelectorAll(
        `.stars[data-question="${questionId}"] .star`
      );
      starsInQuestion.forEach((s) => s.classList.remove("hover"));
    });
  });
});
