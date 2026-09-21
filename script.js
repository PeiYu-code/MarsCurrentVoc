const wordBank = [
  // --- 第一張圖片 (44 個) ---
  { eng: 'fossil', ch: '化石、頑固的人(n.)' },
  { eng: 'dinosaur', ch: '恐龍、老古董(人)(n.)' },
  { eng: 'knot', ch: '結(n.); 打結(v.)' },
  { eng: 'bride', ch: '新娘(n.)' },
  { eng: 'groom', ch: '新郎(n.)' },
  { eng: 'scout', ch: '童子軍、星探(n.)' },
  { eng: 'puppet', ch: '木偶、傀儡(n.)' },
  { eng: 'junk', ch: '垃圾(n.)' },
  { eng: 'monk', ch: '和尚、修道士(n.)' },
  { eng: 'nun', ch: '尼姑、修女(n.)' },
  { eng: 'sack', ch: '大袋子(n.)' },
  { eng: 'tide', ch: '潮汐、趨勢(n.)' },
  { eng: 'loan', ch: '貸款、出借(v., n.)' },
  { eng: 'welfare', ch: '社會福利(n.)' },
  { eng: 'consistent', ch: '始終如一的、一致的(adj.)' },
  { eng: 'remark', ch: '評論(v., n.)' },
  { eng: 'remarkable', ch: '傑出的(adj.)' },
  { eng: 'curl', ch: '使...捲曲(v.); 捲髮、捲曲物(n.)' },
  { eng: 'gaze', ch: '凝視(v., n.) +at' },
  { eng: 'portable', ch: '手提的、可攜帶的(adj.)' },
  { eng: 'port', ch: '港口(n.)' },
  { eng: 'deserve', ch: '值得(v.)' },
  { eng: 'bait', ch: '誘餌、誘惑物(n.)' },
  { eng: 'battery', ch: '電池(n.)' },
  { eng: 'bead', ch: '珠子(n.)' },
  { eng: 'crown', ch: '皇冠(n.); 加冕(v.)' },
  { eng: 'lace', ch: '蕾絲、鞋帶(n.); 幫...綁鞋帶(v.)' },
  { eng: 'temper', ch: '脾氣(n.)' },
  { eng: 'necklace', ch: '項鍊(n.)' },
  { eng: 'be laced with', ch: '(食物、飲料裡)摻有...' },
  { eng: 'quick-tempered', ch: '急躁的(adj.)' },
  { eng: 'lose one\'s temper', ch: '發脾氣' },
  { eng: 'research', ch: '研究(n., v.)' },
  { eng: 'carry out', ch: '執行 (實驗、研究)' },
  { eng: 'popularity', ch: '流行、人氣、普及(n.)' },
  { eng: 'fantasy', ch: '奇幻作品、幻想(n.)' },
  { eng: 'fantastic', ch: '極好的(adj.)' },
  { eng: 'fancy', ch: '空想、喜愛(v., n.) +Ving; 花俏的(adj.)' },
  { eng: 'yawn', ch: '哈欠(n.); 打哈欠(v.)' },
  { eng: 'accompany', ch: '陪伴、伴奏、伴隨(發生)(v.)' },
  { eng: 'companion', ch: '同伴(n.)' },
  { eng: 'depart', ch: '離開、出發(v.)' },
  { eng: 'departure', ch: '離開、出發(n.)' },
  { eng: 'accomplish', ch: '完成、達成(v.)' },

  // --- 第二張圖片 (20 個) ---
  { eng: 'fragile', ch: '易碎的、脆弱的(adj.)' },
  { eng: 'complete', ch: '完成(v.); 完整的(adj.)' },
  { eng: 'fulfill', ch: '實現、履行(v.)' },
  { eng: 'fulfillment', ch: '實現、履行(n.)' },
  { eng: 'frustrate', ch: '使...挫折(v.)' },
  { eng: 'possess', ch: '擁有、(鬼魂)附身(v.)' },
  { eng: 'possession', ch: '擁有、所有物、附身(n.)' },
  { eng: 'recall', ch: '回想、(瑕疵品)召回(v., n.)' },
  { eng: 'mountainous', ch: '多山的、像山一樣的(adj.)' },
  { eng: 'oral', ch: '口腔的、口頭的(adj.); 口試(n.)' },
  { eng: 'accomplishment', ch: '完成、成就(n.)' },
  { eng: 'a sense of accomplishment', ch: '成就感(n.)' },
  { eng: 'slender', ch: '修長苗條的(adj.)' },
  { eng: 'slim', ch: '苗條的、渺茫的(adj.)' },
  { eng: 'frustration', ch: '挫折(n.)' },
  { eng: 'embarrass', ch: '使...尷尬(v.)' },
  { eng: 'embarrassment', ch: '尷尬(n.)' },
  { eng: 'launch', ch: '發射、發行、啟動(v., n.)' },
  { eng: 'diligent', ch: '勤勉的(adj.)' },
  { eng: 'diligence', ch: '勤勉(n.)' }
];

let currentQueue = [];
let activeEng = [null, null, null, null, null];
let activeCh = [null, null, null, null, null];
let selectedEngSlot = null;
let selectedChSlot = null;
let startTime = 0;
let timerInterval = null;
let completedCount = 0;

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

function showResult() {
  clearInterval(timerInterval);
  const finalTime = document.getElementById('timer').textContent;
  document.getElementById('final-time').textContent = finalTime;
  document.getElementById('result-modal').classList.remove('hidden');
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
