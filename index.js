document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      id: 1,
      qt: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      qt: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars",
    },
    {
      id: 3,
      qt: "What is 7 + 8?",
      options: ["12", "14", "15", "16"],
      correctAnswer: "15",
    },
    {
      id: 4,
      qt: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Claude Monet",
      ],
      correctAnswer: "Leonardo da Vinci",
    },
    {
      id: 5,
      qt: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correctAnswer: "Pacific Ocean",
    },
  ];

  const QUIZ_LENGTH = 5;

  const questionTextElement = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const feedbackElement = document.getElementById("feedback");
  const submitAnswerBtn = document.getElementById("submit-answer-btn");
  const nextQuestionBtn = document.getElementById("next-question-btn");
  const currentScoreElement = document.getElementById("current-score");
  const totalQuestionsElement = document.getElementById("total-questions");
  const quizQuestionContainer = document.getElementById(
    "quiz-question-container"
  );
  const quizSummaryContainer = document.getElementById("quiz-summary");
  const finalScoreElement = document.getElementById("final-score");
  const totalQuestionsSummaryElement = document.getElementById(
    "total-questions-summary"
  );
  const restartQuizBtn = document.getElementById("restart-quiz-btn");

  let currentQuestionIndex = 0;
  let score = 0;
  let selectedAnswer = null;
  let askedQuestionIds = [];
  let currentQuestion = null;

  totalQuestionsElement.textContent = QUIZ_LENGTH;
  totalQuestionsSummaryElement.textContent = QUIZ_LENGTH;

  function getRandomQuestion() {
    if (askedQuestionIds.length === questions.length) {
      askedQuestionIds = [];
    }

    let availableQuestions = questions.filter(
      (q) => !askedQuestionIds.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      availableQuestions = questions;
      askedQuestionIds = [];
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];

    if (
      askedQuestionIds.length > 0 &&
      question.id === askedQuestionIds[askedQuestionIds.length - 1] &&
      availableQuestions.length > 1
    ) {
      return getRandomQuestion();
    }

    if (askedQuestionIds.length >= QUIZ_LENGTH) {
      askedQuestionIds.shift();
    }

    askedQuestionIds.push(question.id);

    return question;
  }

  function displayQuestion() {
    if (currentQuestionIndex >= QUIZ_LENGTH) {
      showQuizSummary();
      return;
    }

    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    questionTextElement.textContent = currentQuestion.qt;
    optionsContainer.innerHTML = "";
    feedbackElement.textContent = "";
    feedbackElement.className = "feedback";
    submitAnswerBtn.disabled = true;
    nextQuestionBtn.style.display = "none";

    currentQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.classList.add("option-button");
      button.textContent = option;
      button.addEventListener("click", () => selectOption(button, option));
      optionsContainer.appendChild(button);
    });
  }

  function selectOption(selectedButton, option) {
    document.querySelectorAll(".option-button").forEach((btn) => {
      btn.classList.remove("selected");
    });

    selectedButton.classList.add("selected");
    selectedAnswer = option;
    submitAnswerBtn.disabled = false;
  }

  function submitAnswer() {
    if (selectedAnswer === null) {
      feedbackElement.textContent = "Please select an answer.";
      feedbackElement.classList.add("incorrect");
      return;
    }

    document.querySelectorAll(".option-button").forEach((btn) => {
      btn.disabled = true;
      if (btn.textContent === currentQuestion.correctAnswer) {
        btn.style.backgroundColor = "#d4edda";
        btn.style.border = "2px solid #28a745";
      } else if (btn.textContent === selectedAnswer) {
        btn.style.backgroundColor = "#f8d7da";
        btn.style.border = "2px solid #dc3545";
      }
    });

    submitAnswerBtn.style.display = "none";
    nextQuestionBtn.style.display = "block";

    if (selectedAnswer === currentQuestion.correctAnswer) {
      score++;
      feedbackElement.textContent = "Correct! 🎉";
      feedbackElement.classList.add("correct");
    } else {
      feedbackElement.textContent = `Incorrect. 😔 The correct answer was: "${currentQuestion.correctAnswer}"`;
      feedbackElement.classList.add("incorrect");
    }

    currentScoreElement.textContent = score;
    selectedAnswer = null;
  }

  function showQuizSummary() {
    quizQuestionContainer.style.display = "none";
    quizSummaryContainer.style.display = "block";
    finalScoreElement.textContent = score;
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    askedQuestionIds = [];
    currentScoreElement.textContent = score;
    quizSummaryContainer.style.display = "none";
    quizQuestionContainer.style.display = "block";
    displayQuestion();
  }

  submitAnswerBtn.addEventListener("click", submitAnswer);
  nextQuestionBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    displayQuestion();
  });
  restartQuizBtn.addEventListener("click", restartQuiz);

  displayQuestion();
});
