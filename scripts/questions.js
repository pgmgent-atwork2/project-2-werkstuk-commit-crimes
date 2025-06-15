const questionText = document.getElementById("question-text");
const answer1 = document.getElementById("answer-1")
const answer2 = document.getElementById("answer-2")
const answer3 = document.getElementById("answer-3")
const answer4 = document.getElementById("answer-4")
const imageContainer = document.getElementById("image-container");

fetch("http://localhost:3000/api/questions")
  .then(response => response.json())
  .then(data => {
    const question = data[0]; 
    questionText.textContent = question.question_text;

    if (question.image_path) {
      const img = document.createElement("img");
      img.src = question.image_path;
      img.alt = "Question Image";
      imageContainer.innerHTML = "";
      imageContainer.appendChild(img);
    } else {
      imageContainer.innerHTML = ""; 
    }

    const answers = question.answers;
    answer1.textContent = answers[0] ? answers[0].answer_text : "";
    answer2.textContent = answers[1] ? answers[1].answer_text : "";
    answer3.textContent = answers[2] ? answers[2].answer_text : "";
    answer4.textContent = answers[3] ? answers[3].answer_text : "";
  })
  .catch(error => {
    console.error("Error fetching question:", error);
  });