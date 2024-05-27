const questions = [
    {
        question: "Welke artiest bracht het nummer 'Thriller' uit?",
        answer: "Michael Jackson"
    },
    {
        question: "Uit welke serie komt de quote: 'I am the one who knocks'?",
        answer: "Breaking Bad"
    }
];

let currentQuestionIndex = 0;

function startGame() {
    document.getElementById('start-game-btn').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;
}

function startListening() {
    document.getElementById('start-listening-btn').style.display = 'none';
    document.getElementById('stop-listening-btn').style.display = 'block';

    // Start speech recognition
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'nl-NL';

    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript.trim();
        document.getElementById('spoken-answer').textContent = "Jij zei: " + spokenText;

        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.answer.toLowerCase();

        if (spokenText.toLowerCase() === correctAnswer) {
            document.getElementById('result').textContent = 'Correct!';
            setTimeout(nextQuestion, 2000);
        } else {
            document.getElementById('result').textContent = 'Fout! Probeer opnieuw.';
        }
    }

    recognition.start();
}

function stopListening() {
    document.getElementById('start-listening-btn').style.display = 'block';
    document.getElementById('stop-listening-btn').style.display = 'none';

    // Stop speech recognition
    recognition.stop();
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById('question-container').innerHTML = "<h2>Game Over!</h2>";
    }
}

document.getElementById('start-game-btn').addEventListener('click', startGame);
