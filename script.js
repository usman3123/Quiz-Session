
let array = [
    {
        question :"What is your name?",
        answers : [
            {text: "Umer",correct : "False"},
            {text: "Hassaan",correct : "False"},
            {text: "Ahmad",correct : "False"},
            {text: "Talha",correct : "True"},
        ]
    },
    {
        question :"What is your name?",
        answers : [
            {text: "Umer",correct : "False"},
            {text: "Hassaan",correct : "True"},
            {text: "Ahmad",correct : "False"},
            {text: "Talha",correct : "False"},
        ]
    },{
        question :"What is your name?",
        answers : [
            {text: "Umer",correct : "True"},
            {text: "Hassaan",correct : "False"},
            {text: "Ahmad",correct : "False"},
            {text: "Talha",correct : "False"},
        ]
    },{
        question :"What is your name?",
        answers : [
            {text: "Umer",correct : "False"},
            {text: "Hassaan",correct : "False"},
            {text: "Ahmad",correct : "True"},
            {text: "Talha",correct : "False"},
        ]
    }
]

const question = document.querySelector(".question")
const allanswers = document.querySelector(".answers")
const next = document.querySelector(".fornext")

let curentquestionindex = 0;
score = 0;
function startquiz() {
    curentquestionindex = 0;
    score = 0;
    next.innerHTML = "Next";
    showquestion()

}
function showquestion(){
    resetstate()
    let questionindex = array[curentquestionindex]
    let questionno = curentquestionindex + 1
    question.innerHTML = questionno +"."+questionindex.question
    questionindex.answers.forEach((answer)=> {
       let btn = document.createElement("button")
       btn.classList.add("quizanswer")
       btn.innerHTML = answer.text
       allanswers.appendChild(btn)
       if (answer.correct) {
        btn.dataset.correct = answer.correct;
       }
       btn.addEventListener("click", selectanswer)
    })

}
function resetstate() {
    next.style.display = "none";
    while (allanswers.firstChild) {
        allanswers.removeChild(allanswers.firstChild)
    }
}

function selectanswer(e) {
    const selectbtn = e.target;
    const iscorrect = selectbtn.dataset.correct == "True";
    if (iscorrect) {
        selectbtn.classList.add("correct");
        score++;
    }else{
        selectbtn.classList.add("incorrect")
    }
    Array.from(allanswers.children).forEach(btn => {
        if (btn.dataset.correct === "True") {
            btn.classList.add("correct");
        }
        btn.disabled = true;
    })
    next.style.display = "block"
}
function showscore() {
    resetstate();
    question.innerHTML = `You Scored ${score} out of ${array.length} !`;
    next.innerHTML = "Restart"
    next.style.display = "block"

    // ✅ Backend pe score bhejna
    fetch("http://quiz-session-backend-production.up.railway.app/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Usman",   
            score: score
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

function handlenextbutton() {
    curentquestionindex++;
    if (curentquestionindex < array.length) {
        showquestion();
    }else{
        showscore();
    }
}
next.addEventListener("click",()=> {
    if (curentquestionindex < array.length) {
        handlenextbutton();
    }else{
        startquiz()
    }
})
startquiz()
const leaderboard = document.getElementById("leaderboard");

const backendURL = "https://quiz-session-backend-production.up.railway.app";

async function fetchScores() {
  try {
    const res = await fetch(`${backendURL}/scores`);
    const data = await res.json();

    leaderboard.innerHTML = "";

    data.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${item.username} - ${item.score} points - ${item.date}`;
      leaderboard.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching scores:", err);
  }
}

fetchScores();

