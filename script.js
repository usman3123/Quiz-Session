let array = [
   {
        question: "سب سے پہلے قرآن میں نازل ہونے والا لفظ کون سا تھا؟",
        answers: [
            { text: "اقْرَأْ", correct: "True" },
            { text: "بسم اللہ", correct: "False" },
            { text: "الحمدللہ", correct: "False" },
            { text: "اَللہُ اَکبر", correct: "False" }
        ]
    },
    {
        question: "پیغمبر ﷺ کی سب سے پہلی بیٹی کون تھیں؟",
        answers: [
            { text: "فاطمہ رضی اللہ عنہا", correct: "False" },
            { text: "رقیہ رضی اللہ عنہا", correct: "False" },
            { text: "زینب رضی اللہ عنہا", correct: "True" },
            { text: "ام کلثوم رضی اللہ عنہا", correct: "False" }
        ]
    },
    {
        question: "سب سے طویل آیت قرآن میں کون سی ہے؟",
        answers: [
            { text: "آیت نمبر 282 سورۃ البقرہ", correct: "True" },
            { text: "آیتُ الکرسی", correct: "False" },
            { text: "آیتُ الکافرون", correct: "False" },
            { text: "آیتُ الاخلاص", correct: "False" }
        ]
    },
    {
        question: "سب سے پہلا معاہدہ مسلمانوں نے کس کے ساتھ کیا تھا؟",
        answers: [
            { text: "اہل یثرب", correct: "False" },
            { text: "قریش", correct: "False" },
            { text: "اہل حدیبیہ", correct: "True" },
            { text: "اہل مکہ", correct: "False" }
        ]
    }
];

const question = document.querySelector(".question");
const allanswers = document.querySelector(".answers");
const next = document.querySelector(".fornext");
const leaderboard = document.getElementById("leaderboard");
let playerName = "";


let curentquestionindex = 0;
let score = 0;

function startquiz() {
    curentquestionindex = 0;
    score = 0;
    next.innerHTML = "Next";
    showquestion();
}

function showquestion() {
    resetstate();
    let questionindex = array[curentquestionindex];
    let questionno = curentquestionindex + 1;
    question.innerHTML = questionno + "." + questionindex.question;
    questionindex.answers.forEach((answer) => {
        let btn = document.createElement("button");
        btn.classList.add("quizanswer");
        btn.innerHTML = answer.text;
        allanswers.appendChild(btn);
        if (answer.correct) {
            btn.dataset.correct = answer.correct;
        }
        btn.addEventListener("click", selectanswer);
    });
}

function resetstate() {
    next.style.display = "none";
    while (allanswers.firstChild) {
        allanswers.removeChild(allanswers.firstChild);
    }
}

function selectanswer(e) {
    const selectbtn = e.target;
    const iscorrect = selectbtn.dataset.correct == "True";
    if (iscorrect) {
        selectbtn.classList.add("correct");
        score++;
    } else {
        selectbtn.classList.add("incorrect");
    }
    Array.from(allanswers.children).forEach(btn => {
        if (btn.dataset.correct === "True") {
            btn.classList.add("correct");
        }
        btn.disabled = true;
    });
    next.style.display = "block";
}

function showscore() {
    resetstate();
    question.innerHTML = `You Scored ${score} out of ${array.length} !`;
    next.innerHTML = "Restart";
    next.style.display = "none";

    // ✅ Backend pe score bhejna
    fetch(`${backendURL}/save-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: playerName,  
            score: score,
            body: JSON.stringify({
            name: playerName,
            score: score
        })

        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Score saved:", data);
            fetchScores(); // leaderboard update
        })
        .catch(err => console.error("Error saving score:", err));
}

function handlenextbutton() {
    curentquestionindex++;
    if (curentquestionindex < array.length) {
        showquestion();
    } else {
        showscore();
    }
}

next.addEventListener("click", () => {
    if (curentquestionindex < array.length) {
        handlenextbutton();
    } else {
        startquiz();
    }
});

startquiz();

const backendURL = "https://quiz-session-backend-production.up.railway.app";

async function fetchScores() {
    try {
        const res = await fetch(`${backendURL}/scores`);
        const data = await res.json();

        leaderboard.innerHTML = "";

const userScores = data.filter(item => item.name.toLowerCase() === playerName.toLowerCase());

if (userScores.length === 0) {
    leaderboard.innerHTML = `<li>No records found yet for "${playerName}".</li>`;
    return;
}

userScores.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item.name} - ${item.score} points - ${item.date}`;
    leaderboard.appendChild(li);
});


    } catch (err) {
        console.error("Error fetching scores:", err);
    }
}

fetchScores();


function askName() {
    document.getElementById("customPopup").style.display = "flex";
}

function saveName() {
    const input = document.getElementById("nameInput").value.trim();
    if (!input) {
        alert("⚠️ Please enter your full name!");
        return;
    }
    playerName = input;
    document.getElementById("customPopup").style.display = "none";
    startquiz();
}


window.onload = () => {
    askName();
};

