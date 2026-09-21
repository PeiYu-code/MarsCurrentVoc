const wordBank = [
  { eng: 'amaze', ch: '使⋯⋯驚訝(v.)' },
  { eng: 'amazement', ch: '驚奇、吃驚(n.)' },
  { eng: 'aside', ch: '在旁邊(adv.)' },
  { eng: 'aside from', ch: '除了⋯⋯之外' },
  { eng: 'aware', ch: '意識到的(adj.)' },
  { eng: 'awareness', ch: '意識、覺醒(n.)' },
  { eng: 'be aware of', ch: '知道' },
  { eng: 'beware', ch: '注意(v.)' },
  { eng: 'bacteria', ch: '細菌' },
  { eng: 'benefit', ch: '好處(v., n.)' },
  { eng: 'citizen', ch: '市民、公民(n.)' },
  { eng: 'be conscious of', ch: '有意識的(adj.)' },
  { eng: 'constant', ch: '持續的(adj.); 永恆的事物(n.)' },
  { eng: 'constantly', ch: '不斷地(adv.)' },
  { eng: 'deposit', ch: '存錢(v.); 訂金、押金(n.)' },
  { eng: 'withdraw', ch: '提領(v.)' },
  { eng: 'engage', ch: '使⋯⋯參與(+in)、訂婚(+to)(v.)' },
  { eng: 'engagement', ch: '訂婚、約定(n.)' },
  { eng: 'extreme', ch: '極端的(adj., n.)' },
  { eng: 'go to extremes', ch: '走向極端' },
  { eng: 'location', ch: '地點(n.)' },
  { eng: 'be located at/in/on', ch: '坐落於' },
  { eng: 'medal', ch: '獎牌(n.)' },
  { eng: 'native to', ch: '本國、本土的(adj.); 原住民(n.)' },
  { eng: 'organic', ch: '有機的(adj.)' },
  { eng: 'organize', ch: '組織、安排(v.)' },
  { eng: 'organization', ch: '組織、機構(n.)' },
  { eng: 'presence', ch: '出席、在場(n.)' },
  { eng: 'present', ch: '呈現、上台報告(v.); 禮物(n.); 在場的(adj.)' },
  { eng: 'process', ch: '過程(v., n.); 加工(v.)' },
  { eng: 'processed food', ch: '加工食品' },
  { eng: 'religion', ch: '宗教(n.)' },
  { eng: 'religious', ch: '宗教的、虔誠的(adj.)' },
  { eng: 'remain', ch: '維持、留下(v.)' },
  { eng: 'remains', ch: '剩餘物、遺骸(n.)' },
  { eng: 'replace A with B', ch: '用 B 取代 A' },
  { eng: 'replacement for', ch: '替代(物)' },
  { eng: 'request', ch: '要求(v., n.)' },
  { eng: 'at one’s request', ch: '應某人要求' },
  { eng: 'resource', ch: '資源(n.)' },
  { eng: 'source', ch: '來源(n.)' },
  { eng: 'risk', ch: '冒⋯⋯的風險(v.); 風險(n.)' },
  { eng: 'risky', ch: '冒險的、有風險的(adj.)' },
  { eng: 'run a/the risk of', ch: '冒⋯⋯的風險' },
  { eng: 'routine', ch: '例行程序(n., adj.)' },
  { eng: 'scientist', ch: '科學家(n.)' },
  { eng: 'scientific', ch: '科學的(adj.)' },
  { eng: 'suffer from', ch: '遭受(苦難)(v.)' },
  { eng: 'suffering', ch: '受苦、痛苦(n.)' },
  { eng: 'talent', ch: '天賦、才能(n.)' },
  { eng: 'talented', ch: '有天賦的(adj.)' },
  { eng: 'threat', ch: '威脅(n.)' },
  { eng: 'threaten', ch: '威脅(v.)' },
  { eng: 'pose a threat to', ch: '對⋯⋯造成威脅' },
  { eng: 'unique to', ch: '獨特的(adj.)' }
];

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDCMJLqxfxnIrNM8WaPZEIoKG08n-egNK-eFutLXT8uY6-mzc0tdi4R7-UjEQEMWbbXg/exec';

let currentQuiz = [];
let currentIndex = 0;
let score = 0;
let wrongWords = [];
let startTime = null;
let endTime = null;

// DOM 元素
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const studentNameInput = document.getElementById('student-name');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score-text');
const wrongList = document.getElementById('wrong-list');

function startQuiz() {
  const name = studentNameInput ? studentNameInput.value.trim() : '';
  if (studentNameInput && !name) {
    alert('請輸入姓名！');
    return;
  }

  // 紀錄開始時間
  startTime = new Date();

  // 隨機排序單字
  currentQuiz = [...wordBank].sort(() => Math.random() - 0.5);
  currentIndex = 0;
  score = 0;
  wrongWords = [];

  if (startScreen) startScreen.classList.add('hidden');
  if (resultScreen) resultScreen.classList.add('hidden');
  if (quizScreen) quizScreen.classList.remove('hidden');

  showNextQuestion();
}

function showNextQuestion() {
  if (currentIndex >= currentQuiz.length) {
    endQuiz();
    return;
  }

  const currentWord = currentQuiz[currentIndex];
  if (progressText) progressText.innerText = `題目 ${currentIndex + 1} / ${currentQuiz.length}`;
  if (questionText) questionText.innerText = currentWord.eng;

  // 產生 4 個選項（1 正確 + 3 錯誤）
  const options = [currentWord.ch];
  const otherWords = wordBank.filter(w => w.eng !== currentWord.eng);
  const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
    options.push(shuffledOthers[i].ch);
  }

  options.sort(() => Math.random() - 0.5);

  if (optionsContainer) {
    optionsContainer.innerHTML = '';
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = option;
      btn.onclick = () => checkAnswer(option, currentWord);
      optionsContainer.appendChild(btn);
    });
  }
}

function checkAnswer(selectedOption, currentWord) {
  if (selectedOption === currentWord.ch) {
    score++;
  } else {
    wrongWords.push({
      eng: currentWord.eng,
      ch: currentWord.ch,
      userAnswer: selectedOption
    });
  }

  currentIndex++;
  showNextQuestion();
}

function endQuiz() {
  // 紀錄結束時間
  endTime = new Date();

  if (quizScreen) quizScreen.classList.add('hidden');
  if (resultScreen) resultScreen.classList.remove('hidden');

  if (scoreText) scoreText.innerText = `答對：${score} 題 / 答錯：${wrongWords.length} 題（共 ${currentQuiz.length} 題）`;

  // 顯示錯題清單
  if (wrongList) {
    wrongList.innerHTML = '';
    if (wrongWords.length === 0) {
      wrongList.innerHTML = '<li>太棒了！完全沒有答錯的題目！</li>';
    } else {
      wrongWords.forEach(item => {
        const li = document.createElement('li');
        li.innerText = `${item.eng} - 正確答案：${item.ch} (你的回答：${item.userAnswer})`;
        wrongList.appendChild(li);
      });
    }
  }

  // 上傳成績至 Google Sheet
  uploadResult();
}

// 計算耗時格式（例如：1分25秒 或 45秒）
function calculateDuration(start, end) {
  const durationMs = end - start;
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}分${seconds}秒`;
  }
  return `${seconds}秒`;
}

function uploadResult() {
  const name = studentNameInput ? studentNameInput.value.trim() : '未填寫姓名';
  const statusDiv = document.getElementById('upload-status') || createStatusDiv();

  statusDiv.innerText = '正在傳送成績至 Google Sheet...';
  statusDiv.style.color = '#666';

  // 格式化考錯的單字字串 (格式如: "amaze (使驚訝), beware (注意)")
  const wrongWordsString = wrongWords.length > 0
    ? wrongWords.map(w => `${w.eng} (${w.ch})`).join(', ')
    : '無';

  const payload = {
    name: name,
    timestamp: endTime ? endTime.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : new Date().toLocaleString(),
    duration: calculateDuration(startTime, endTime),
    correctCount: score,
    wrongCount: wrongWords.length,
    wrongWordsList: wrongWordsString
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    statusDiv.innerText = '成績已成功傳送！';
    statusDiv.style.color = 'green';
  })
  .catch(error => {
    console.error('上傳失敗:', error);
    statusDiv.innerText = '成績上傳失敗，請檢查網路連線。';
    statusDiv.style.color = 'red';
  });
}

function createStatusDiv() {
  const div = document.createElement('div');
  div.id = 'upload-status';
  div.style.marginTop = '15px';
  div.style.fontWeight = 'bold';
  if (resultScreen) resultScreen.appendChild(div);
  return div;
}

function restartQuiz() {
  if (resultScreen) resultScreen.classList.add('hidden');
  if (startScreen) startScreen.classList.remove('hidden');
}
