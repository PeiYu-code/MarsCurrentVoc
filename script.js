// 已填入您的 Google Apps Script Web App 部署 URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzlo0feZG57o8F7D2Jj7mPSIX77KG3pjO79PXPgE5ek6K5OBzwI6YaE4_gavdLp_gQosQ/exec';

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
  { eng: "at one’s request", ch: '應某人要求' },
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

let currentQueue = [];
let activeEng = [null, null, null, null, null];
let activeCh = [null, null, null, null, null];
let selectedEngSlot = null;
let selectedChSlot = null;
let startTime = 0;
let timerInterval = null;
let completedCount = 0;

// 追蹤答錯相關數據
let wrongCount = 0;
let wrongWordsSet = new Set();

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initGame() {
  clearInterval(timerInterval);
  completedCount = 0;
  wrongCount = 0;
  wrongWordsSet.clear();
  selectedEngSlot = null;
  selectedChSlot = null;

  document.getElementById('progress').textContent = `0 / ${wordBank.length}`;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('result-modal').classList.add('hidden');

  const indexedWords = wordBank.map((item, index) => ({ ...item, id: index }));
  currentQueue = shuffle(indexedWords);

  // 初始化前 5 個單字
  const initialItems = [];
  for (let i = 0; i < 5 && currentQueue.length > 0; i++) {
    initialItems.push(currentQueue.pop());
  }

  activeEng = [...initialItems];
  activeCh = shuffle([...initialItems]);

  // 開局初始化不執行 fade out 動畫，直接渲染
  updateSlotContentsSmoothly(-1, false);

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateSlotContentsSmoothly(replacedEngIndex = -1, animate = true) {
  const engSlots = document.querySelectorAll('#english-column .slot');
  const chSlots = document.querySelectorAll('#chinese-column .slot');

  // 定義要觸發 fade 動畫的文字元素 (Span)
  let fadingSpans = [];

  if (animate) {
    // 右側全部中文均套用淡入淡出
    chSlots.forEach(slot => {
      const span = slot.querySelector('.slot-text');
      if (span) fadingSpans.push(span);
    });

    // 左側英文只針對「新替補位置」的文字套用淡入淡出
    if (replacedEngIndex !== -1 && engSlots[replacedEngIndex]) {
      const span = engSlots[replacedEngIndex].querySelector('.slot-text');
      if (span) fadingSpans.push(span);
    }
  }

  const updateTexts = () => {
    // 1. 更新左側英文 (維持原位，僅替換指定 Index)
    engSlots.forEach((slot, i) => {
      const span = slot.querySelector('.slot-text');
      if (activeEng[i]) {
        span.textContent = activeEng[i].eng;
        slot.dataset.id = activeEng[i].id;
        slot.style.visibility = 'visible';
      } else {
        slot.style.visibility = 'hidden';
        slot.dataset.id = '';
      }
      slot.classList.remove('selected', 'wrong');
    });

    // 2. 更新右側中文 (全新打亂後的順序)
    chSlots.forEach((slot, i) => {
      const span = slot.querySelector('.slot-text');
      if (activeCh[i]) {
        span.textContent = activeCh[i].ch;
        slot.dataset.id = activeCh[i].id;
        slot.style.visibility = 'visible';
      } else {
        slot.style.visibility = 'hidden';
        slot.dataset.id = '';
      }
      slot.classList.remove('selected', 'wrong');
    });

    // 文字替換後，移除透明度遮罩觸發 Fade In
    fadingSpans.forEach(span => span.classList.remove('text-fade-out'));
  };

  if (animate && fadingSpans.length > 0) {
    // 觸發 Fade Out
    fadingSpans.forEach(span => span.classList.add('text-fade-out'));
    // 等待 Fade Out 完成後更換文字，再 Fade In
    setTimeout(updateTexts, 600);
  } else {
    updateTexts();
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function handleEngClick(e) {
  const slot = e.currentTarget;
  if (!slot.dataset.id) return;

  document.querySelectorAll('#english-column .slot').forEach(s => s.classList.remove('selected', 'wrong'));
  slot.classList.add('selected');
  selectedEngSlot = slot;

  checkMatch();
}

function handleChClick(e) {
  const slot = e.currentTarget;
  if (!slot.dataset.id) return;

  document.querySelectorAll('#chinese-column .slot').forEach(s => s.classList.remove('selected', 'wrong'));
  slot.classList.add('selected');
  selectedChSlot = slot;

  checkMatch();
}

function checkMatch() {
  if (!selectedEngSlot || !selectedChSlot) return;

  const engId = selectedEngSlot.dataset.id;
  const chId = selectedChSlot.dataset.id;

  if (engId === chId) {
    completedCount++;
    document.getElementById('progress').textContent = `${completedCount} / ${wordBank.length}`;

    // 取得配對成功的英文索引
    const engIndex = activeEng.findIndex(item => item && String(item.id) === engId);

    // 抽出一組新單字
    const newItem = currentQueue.length > 0 ? currentQueue.pop() : null;

    // 1. 左側英文：只更新被消除的那格，其他 4 格不變
    activeEng[engIndex] = newItem;

    // 2. 右側中文：扣除舊單字、加入新單字並洗牌
    activeCh = activeCh.filter(item => item && String(item.id) !== chId);
    if (newItem) {
      activeCh.push(newItem);
    }
    activeCh = shuffle(activeCh);

    selectedEngSlot = null;
    selectedChSlot = null;

    // 若英文全數清空，宣告通關
    if (activeEng.every(item => item === null)) {
      setTimeout(showResult, 600);
    } else {
      // 傳入 engIndex，讓系統知道「只有該格英文需要 fade 效果」
      updateSlotContentsSmoothly(engIndex, true);
    }
  } else {
    // 答錯時：紀錄錯題數與錯過的英文單字
    wrongCount++;
    const wrongWordObj = wordBank[parseInt(engId, 10)];
    if (wrongWordObj) {
      wrongWordsSet.add(wrongWordObj.eng);
    }

    selectedEngSlot.classList.add('wrong');
    selectedChSlot.classList.add('wrong');

    const eSlot = selectedEngSlot;
    const cSlot = selectedChSlot;

    setTimeout(() => {
      eSlot.classList.remove('selected', 'wrong');
      cSlot.classList.remove('selected', 'wrong');
    }, 500);

    selectedEngSlot = null;
    selectedChSlot = null;
  }
}

// 發送詳細數據至 Google Sheets
function sendResultToGoogleSheet(timeSpent, correctCount, wrongCount, wrongWords) {
  if (!GOOGLE_SHEET_URL) return;

  const payload = {
    timestamp: new Date().toLocaleString('zh-TW'), // 學生做測驗的時間
    timeSpent: timeSpent,                          // 做了多久
    correctCount: correctCount,                    // 對了幾題
    wrongCount: wrongCount,                        // 錯了幾題
    wrongWords: wrongWords                         // 考錯的單字
  };

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).catch(error => console.error('Error sending data to Google Sheet:', error));
}

function showResult() {
  clearInterval(timerInterval);
  const finalTime = document.getElementById('timer').textContent;
  document.getElementById('final-time').textContent = finalTime;
  document.getElementById('result-modal').classList.remove('hidden');

  // 對題數為總題數 (所有單字皆完成配對)
  const correctCount = wordBank.length;
  // 將錯字 Set 轉為以逗點分隔的字串
  const wrongWordsString = wrongWordsSet.size > 0 ? Array.from(wrongWordsSet).join(', ') : '無';

  // 通關時發送資料
  sendResultToGoogleSheet(finalTime, correctCount, wrongCount, wrongWordsString);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#english-column .slot').forEach(slot => {
    slot.addEventListener('click', handleEngClick);
  });

  document.querySelectorAll('#chinese-column .slot').forEach(slot => {
    slot.addEventListener('click', handleChClick);
  });

  document.getElementById('restart-btn').addEventListener('click', initGame);
  document.getElementById('modal-restart-btn').addEventListener('click', initGame);

  initGame();
});
