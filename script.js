const vocab = [
  {es:"hola", pl:"cześć"},
  {es:"adiós", pl:"do widzenia"},
  {es:"gracias", pl:"dziękuję"},
  {es:"por favor", pl:"proszę"},
  {es:"sí", pl:"tak"},
  {es:"no", pl:"nie"},
  {es:"agua", pl:"woda"},
  {es:"casa", pl:"dom"},
  {es:"perro", pl:"pies"},
  {es:"gato", pl:"kot"},
  {es:"libro", pl:"książka"},
  {es:"amigo", pl:"przyjaciel"},
  {es:"familia", pl:"rodzina"},
  {es:"comida", pl:"jedzenie"},
  {es:"tiempo", pl:"czas / pogoda"},
  {es:"trabajo", pl:"praca"},
  {es:"escuela", pl:"szkoła"},
  {es:"ciudad", pl:"miasto"},
  {es:"amor", pl:"miłość"},
  {es:"feliz", pl:"szczęśliwy"},
  {es:"triste", pl:"smutny"},
  {es:"grande", pl:"duży"},
  {es:"pequeño", pl:"mały"},
  {es:"rojo", pl:"czerwony"},
  {es:"azul", pl:"niebieski"},
  {es:"mañana", pl:"jutro / rano"},
  {es:"noche", pl:"noc"},
  {es:"sol", pl:"słońce"},
  {es:"luna", pl:"księżyc"},
  {es:"comer", pl:"jeść"},
  {es:"beber", pl:"pić"},
  {es:"dormir", pl:"spać"},
  {es:"hablar", pl:"mówić"},
  {es:"leer", pl:"czytać"},
  {es:"escribir", pl:"pisać"},
  {es:"correr", pl:"biegać"},
  {es:"vivir", pl:"żyć / mieszkać"},
  {es:"viajar", pl:"podróżować"},
  {es:"cocina", pl:"kuchnia"},
  {es:"calle", pl:"ulica"}
];

const TOTAL_QUESTIONS = 10;
let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const qNumEl = document.getElementById('qNum');
const qTotalEl = document.getElementById('qTotal');
const scoreEl = document.getElementById('score');
const esWordEl = document.getElementById('esWord');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const playArea = document.getElementById('playArea');
const finalScreen = document.getElementById('finalScreen');
const finalScore = document.getElementById('finalScore');
const finalMsg = document.getElementById('finalMsg');
const restartBtn = document.getElementById('restartBtn');

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(){
  const pool = shuffle(vocab).slice(0, TOTAL_QUESTIONS);
  questions = pool.map(item => ({ es: item.es, correct: item.pl }));
}

function startGame(){
  buildQuestions();
  currentIndex = 0;
  score = 0;
  scoreEl.textContent = score;
  qTotalEl.textContent = TOTAL_QUESTIONS;
  finalScreen.style.display = 'none';
  playArea.style.display = 'block';
  showQuestion();
}

function showQuestion(){
  answered = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';

  const q = questions[currentIndex];
  qNumEl.textContent = currentIndex + 1;
  esWordEl.textContent = q.es;
  progressBar.style.width = ((currentIndex) / TOTAL_QUESTIONS * 100) + '%';

  answerInput.value = '';
  answerInput.disabled = false;
  answerInput.className = 'answer-input';
  submitBtn.disabled = false;
  answerInput.focus();
}

function normalize(str){
  return str.toLowerCase().trim()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e').replace(/ł/g,'l')
    .replace(/ń/g,'n').replace(/ó/g,'o').replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z');
}

function checkAnswer(){
  if(answered) return;
  const userValue = answerInput.value.trim();
  if(userValue === '') return;
  answered = true;

  const q = questions[currentIndex];
  const acceptedAnswers = q.correct.split('/').map(s => normalize(s));
  const isCorrect = acceptedAnswers.includes(normalize(userValue));

  answerInput.disabled = true;
  submitBtn.disabled = true;

  if(isCorrect){
    answerInput.classList.add('correct');
    score++;
    feedbackEl.textContent = '¡Correcto! Dobrze!';
    feedbackEl.className = 'feedback good';
  } else {
    answerInput.classList.add('wrong');
    feedbackEl.textContent = 'Niepoprawnie. Prawidłowa odpowiedź: ' + q.correct;
    feedbackEl.className = 'feedback bad';
  }

  scoreEl.textContent = score;
  nextBtn.disabled = false;
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    if(!answered){
      checkAnswer();
    } else {
      nextBtn.click();
    }
  }
});

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if(currentIndex >= TOTAL_QUESTIONS){
    endGame();
  } else {
    showQuestion();
  }
});

function endGame(){
  progressBar.style.width = '100%';
  playArea.style.display = 'none';
  finalScreen.style.display = 'block';
  finalScore.textContent = score + '/' + TOTAL_QUESTIONS;

  let msg;
  const pct = score / TOTAL_QUESTIONS;
  if(pct === 1) msg = '¡Perfecto! Idealny wynik!';
  else if(pct >= 0.8) msg = '¡Muy bien! Świetna robota!';
  else if(pct >= 0.5) msg = 'Dobrze! Trenuj dalej!';
  else msg = 'Nie poddawaj się, spróbuj jeszcze raz!';
  finalMsg.textContent = msg;
}

restartBtn.addEventListener('click', startGame);

startGame();
