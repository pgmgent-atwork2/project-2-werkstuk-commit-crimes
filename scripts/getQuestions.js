function showQuestions() {
  fetch("http://localhost:3000/api/questions", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Fout bij ophalen vragen:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  showQuestions();
});

export default showQuestions;
