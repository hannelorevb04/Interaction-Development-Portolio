// Locaties van muzikale trivia met meerdere vragen en bijbehorende antwoorden en muziekfragmenten
const musicTrivia = [
    { 
        name: "Concertzaal 1", 
        location: [51.5, -0.09], 
        questions: [
            { question: "Welke beroemde band speelde hier voor het eerst in 1965?", answer: "The Beatles", audio: "https://example.com/beatles.mp3" },
            { question: "Wie gaf hier een legendarisch concert in 1970?", answer: "Led Zeppelin", audio: "https://example.com/ledzeppelin.mp3" }
        ]
    },
    { 
        name: "Muziekwinkel 2", 
        location: [40.7128, -74.0060], 
        questions: [
            { question: "Welke bekende gitarist begon zijn carrière hier?", answer: "Jimi Hendrix", audio: "https://example.com/hendrix.mp3" },
            { question: "Welke bekende zanger kocht hier zijn eerste gitaar?", answer: "Bob Dylan", audio: "https://example.com/bobdylan.mp3" }
        ]
    },
    { 
        name: "Standbeeld van Muzikant 3", 
        location: [48.8566, 2.3522], 
        questions: [
            { question: "Wie is afgebeeld in dit standbeeld?", answer: "Freddie Mercury", audio: "https://example.com/mercury.mp3" },
            { question: "Welke muzikant kreeg hier een standbeeld in 2000?", answer: "David Bowie", audio: "https://example.com/bowie.mp3" }
        ]
    },
    { 
        name: "Concertzaal 4", 
        location: [35.6895, 139.6917], 
        questions: [
            { question: "Welke klassieke componist trad hier regelmatig op?", answer: "Ludwig van Beethoven", audio: "https://example.com/beethoven.mp3" },
            { question: "Wie gaf hier een concert in 1808 dat later beroemd werd?", answer: "Wolfgang Amadeus Mozart", audio: "https://example.com/mozart.mp3" }
        ]
    },
    { 
        name: "Muziekmuseum 5", 
        location: [-33.8688, 151.2093], 
        questions: [
            { question: "Welke muziekinstrument wordt hier prominent tentoongesteld?", answer: "Didgeridoo", audio: "https://example.com/didgeridoo.mp3" },
            { question: "Wat is het oudste instrument in dit museum?", answer: "Lier", audio: "https://example.com/lier.mp3" }
        ]
    }
];

let score = 0;
let timeLeft = 300; // 5 minuten tijdslimiet
let timerInterval;
let markers = [];
let currentLocationIndex = -1;
let map;

// Functie om een willekeurige locatie te kiezen en de vragen daarvoor op te halen
function chooseRandomLocation() {
    currentLocationIndex = Math.floor(Math.random() * musicTrivia.length);
}

// Functie om een willekeurige vraag voor de huidige locatie te kiezen
function getRandomQuestionForCurrentLocation() {
    if (currentLocationIndex !== -1 && currentLocationIndex < musicTrivia.length) {
        return getRandomQuestion(musicTrivia[currentLocationIndex].questions);
    }
    return null;
}

// Functie om de kaart te initialiseren
function initializeMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
}

// Functie om de game te starten
function startGame() {
    chooseRandomLocation();
    const currentQuestion = getRandomQuestionForCurrentLocation();
    if (currentQuestion) {
        const userAnswer = prompt(currentQuestion.question);
        if (userAnswer && userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            alert("Correct! Luister naar dit muziekfragment.");
            const audio = new Audio(currentQuestion.audio);
            audio.play();
            updateScore(1);
        } else {
            alert("Onjuist antwoord. Probeer het opnieuw!");
        }
    } else {
        alert("Er zijn geen vragen beschikbaar voor de huidige locatie. Probeer de pagina te vernieuwen.");
    }
}

// Functie om de score bij te werken
function updateScore(points) {
    score += points;
    document.getElementById('score').innerText = `Score: ${score}`;
}

