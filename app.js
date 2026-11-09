/**
 * AI Video Creation 7-Step Studio
 * Interactive Logic, Prompt Builders & Storyboard Manager
 */

// Application State
let currentStep = 1;
const totalSteps = 7;
let viewMode = 'steps'; // 'steps' | 'prompts' | 'storyboard'

// Default Storyboard Data
const initialStoryboard = [
  {
    id: 1,
    shotNum: '01',
    shotType: '遠景 (Wide Shot)',
    content: '晴空下金黃色草浪翻滾，遠處有藍天白雲與巨大風車，少年牽著老拉布拉多緩緩走入畫面。',
    dialogue: '「我們約好，每年的這個季節都要來這裡。」',
    duration: 5,
    done: false
  },
  {
    id: 2,
    shotNum: '02',
    shotType: '中景 (Medium Shot)',
    content: '少年蹲下身撫摸老拉布拉多的頭部，陽光穿過樹葉在他們身上灑落斑駁光斑，狗狗瞇起眼睛微笑。',
    dialogue: '「謝謝你，一直陪著我長大。」',
    duration: 5,
    done: false
  },
  {
    id: 3,
    shotNum: '03',
    shotType: '特寫 (Close-Up)',
    content: '老拉布拉多溫柔明亮的眼神特寫，眼神倒映著藍天與少年的輪廓，微風輕拂鬍鬚。',
    dialogue: '（狗狗發出安心的輕呼聲）',
    duration: 4,
    done: false
  },
  {
    id: 4,
    shotNum: '04',
    shotType: '跟隨運鏡 (Tracking Shot)',
    content: '少年在草地上小跑步，老狗歡快邁著穩健步伐跟在身後，鏡頭低角度平移跟隨。',
    dialogue: '「再跑慢一點也沒關係喔！」',
    duration: 6,
    done: false
  },
  {
    id: 5,
    shotNum: '05',
    shotType: '仰角 (Low Angle)',
    content: '夕陽西下，天空染成粉紫色與橘金色，少年與老狗並肩坐在山丘頂端看晚霞。',
    dialogue: '「時光會流逝，但約定永遠都在。」',
    duration: 5,
    done: false
  },
  {
    id: 6,
    shotNum: '06',
    shotType: '遠景淡出 (Fade Out)',
    content: '極遠景，暮色沉靜，少年與老狗相依偎的剪影定格，畫面漸次淡出浮現片名。',
    dialogue: '【完 / END】',
    duration: 5,
    done: false
  }
];

let storyboardData = JSON.parse(JSON.stringify(initialStoryboard));

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  updatePrompt1();
  updatePrompt2();
  updatePrompt3();
  updatePrompt4();
  updatePrompt5();
  renderStoryboardTable();
  goToStep(currentStep);
  updateAllChecklistUI();
  updateOverallProgress();
});

// ====================================================
// NAVIGATION & STEP CONTROLLER
// ====================================================

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;
  currentStep = step;

  // Switch to steps view if currently in prompts or storyboard view
  if (viewMode !== 'steps') {
    switchViewMode('steps');
  }

  // Update Step Panels visibility
  for (let i = 1; i <= totalSteps; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    if (panel) {
      if (i === currentStep) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }
  }

  // Update Stepper Navigation buttons
  const stepButtons = document.querySelectorAll('.step-nav-btn');
  stepButtons.forEach(btn => {
    const btnStep = parseInt(btn.getAttribute('data-step'));
    btn.classList.remove('active');
    if (btnStep === currentStep) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });

  // Update Current step indicator text
  const indicator = document.getElementById('current-step-indicator');
  if (indicator) {
    const stepNames = [
      '劇情與主題設定',
      '角色設定表',
      '分鏡腳本設計',
      'AI 圖像生成',
      'AI 動態影片',
      '聲音與配樂',
      '剪輯與整合'
    ];
    indicator.textContent = `階段 ${currentStep} / ${totalSteps}：${stepNames[currentStep - 1]}`;
  }

  // Prev / Next button states
  const prevBtn = document.getElementById('btn-prev-step');
  const nextBtn = document.getElementById('btn-next-step');

  if (prevBtn) {
    prevBtn.disabled = currentStep === 1;
    prevBtn.classList.toggle('opacity-50', currentStep === 1);
    prevBtn.classList.toggle('cursor-not-allowed', currentStep === 1);
  }

  if (nextBtn) {
    if (currentStep === totalSteps) {
      nextBtn.innerHTML = `<span>完成並慶祝</span> <i class="fa-solid fa-trophy text-amber-300"></i>`;
      nextBtn.className = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-teal-500/30 transition flex items-center space-x-2";
    } else {
      nextBtn.innerHTML = `<span>下一步驟</span> <i class="fa-solid fa-arrow-right"></i>`;
      nextBtn.className = "px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2";
    }
  }

  // Auto-scroll window to top of panel smoothly
  window.scrollTo({ top: 120, behavior: 'smooth' });
  saveUserData();
}

function prevStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

function nextStep() {
  if (currentStep < totalSteps) {
    goToStep(currentStep + 1);
  } else {
    celebrateSuccess();
  }
}

// ====================================================
// VIEW MODE SWITCHER
// ====================================================

function switchViewMode(mode) {
  viewMode = mode;

  const stepsContainer = document.getElementById('view-steps-container');
  const promptsContainer = document.getElementById('view-prompts-container');
  const storyboardContainer = document.getElementById('view-storyboard-container');

  const btnSteps = document.getElementById('view-mode-steps');
  const btnPrompts = document.getElementById('view-mode-prompts');
  const btnStoryboard = document.getElementById('view-mode-storyboard');

  // Reset active classes
  [btnSteps, btnPrompts, btnStoryboard].forEach(b => {
    if (b) {
      b.className = "px-3 py-1.5 rounded-md transition-all text-slate-300 hover:text-white hover:bg-slate-700 flex items-center space-x-1";
    }
  });

  stepsContainer.classList.add('hidden');
  promptsContainer.classList.add('hidden');
  storyboardContainer.classList.add('hidden');

  if (mode === 'steps') {
    stepsContainer.classList.remove('hidden');
    if (btnSteps) btnSteps.className = "px-3 py-1.5 rounded-md transition-all bg-indigo-600 text-white shadow-sm flex items-center space-x-1";
  } else if (mode === 'prompts') {
    promptsContainer.classList.remove('hidden');
    if (btnPrompts) btnPrompts.className = "px-3 py-1.5 rounded-md transition-all bg-indigo-600 text-white shadow-sm flex items-center space-x-1";
  } else if (mode === 'storyboard') {
    storyboardContainer.classList.remove('hidden');
    if (btnStoryboard) btnStoryboard.className = "px-3 py-1.5 rounded-md transition-all bg-indigo-600 text-white shadow-sm flex items-center space-x-1";
  }

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// ====================================================
// PROMPT BUILDERS (REACTIVE PROMPT TEMPLATES)
// ====================================================

// 1. 劇情發想提示詞
function updatePrompt1() {
  const duration = document.getElementById('p1-duration').value || '30';
  const tone = document.getElementById('p1-tone').value || '三個溫馨感人';
  const style = document.getElementById('p1-style').value || '新海誠風格';
  const type = document.getElementById('p1-type').value || '動漫';
  const char1 = document.getElementById('p1-char1').value || '少年';
  const char2 = document.getElementById('p1-char2').value || '老拉布拉多';
  const scene = document.getElementById('p1-scene').value || '其中要有草原的場景';

  const promptText = `我正在構思一段【${duration}】秒左右的影片，
請以下面的框架為我建議【${tone}】
的【${style}】的【${type}】影片方案內容，
不需有腳本。

1. 角色：【${char1}】；另一位主角是【${char2}】。
2. 劇情大綱：請您建議。
3. 劇情要點：請您建議。
4. 場景：請您建議，${scene}。
5. 風格：請您建議。`;

  const outputEl = document.getElementById('prompt-output-1');
  if (outputEl) outputEl.textContent = promptText;
  saveUserData();
}

function setPreset1(presetName, dur, tone, style, type, c1, c2, scene) {
  document.getElementById('p1-duration').value = dur;
  document.getElementById('p1-tone').value = tone;
  document.getElementById('p1-style').value = style;
  document.getElementById('p1-type').value = type;
  document.getElementById('p1-char1').value = c1;
  document.getElementById('p1-char2').value = c2;
  document.getElementById('p1-scene').value = scene;
  updatePrompt1();
  showToast(`已載入「${presetName}」範本！`);
}

function resetPrompt1() {
  setPreset1('新海誠動漫', '30', '三個溫馨感人', '新海誠風格', '動漫', '少年', '老拉布拉多', '其中要有草原的場景');
}

// 2. 分鏡設計提示詞
function updatePrompt2() {
  const scheme = document.getElementById('p2-scheme').value || '方案1：草地上的約定';
  const shots = document.getElementById('p2-shots').value || '6';

  const promptText = `請根據您上面建議的【${scheme}】
劇情內容與風格，為我分段為【${shots}】段鏡頭。

我需要您提供以下內容：

1. 中文標題（精簡）。

2. 場景設計與分鏡描述文案：
   - 分鏡編號與類型（例如：01 遠景）
   - 分鏡畫面內容描述
   - 分鏡影片的字幕或台詞
   - 時長

3. 所有鏡頭的 AI 圖像生成提示詞：
   提供中文與英文對照版本。

4. 所有鏡頭的 AI 影片生成提示詞：
   提供中文與英文對照版本。`;

  const outputEl = document.getElementById('prompt-output-2');
  if (outputEl) outputEl.textContent = promptText;
  saveUserData();
}

// 3. 角色設定表 Character Sheet
function updatePrompt3() {
  const char = document.getElementById('p3-char').value || '少年';
  const medium = document.getElementById('p3-medium').value || '動漫';
  const aspect = document.getElementById('p3-aspect').value || '16:9';
  const lighting = document.getElementById('p3-lighting').value || '白色背景，均勻光線';

  const promptText = `1. 請根據您建議的內容，
   生成【${char}】的【${medium}】角色設定表
   （Character Sheet）。

2. 包含上述角色的四個全身視角：
   正面、45度側面、側面，以及背面。

3. 保持原角色面部特徵不變。

4. ${lighting}，${aspect}。`;

  const outputEl = document.getElementById('prompt-output-3');
  if (outputEl) outputEl.textContent = promptText;
  saveUserData();
}

function setPrompt3Dog() {
  document.getElementById('p3-char').value = '老拉布拉多犬（金黃色毛髮，表情溫和柔和）';
  updatePrompt3();
  showToast('已切換為第二主角【老拉布拉多】提示詞！');
}

// 4. 影片片頭海報提示詞
function updatePrompt4() {
  const ratio = document.getElementById('p4-ratio').value || '16:9';
  const title = document.getElementById('p4-title').value || '時光的微風';
  const char1Ref = document.getElementById('p4-char1-ref').value || '上傳圖片1為角色1的樣貌';
  const char2Ref = document.getElementById('p4-char2-ref').value || '上傳圖片2為角色2的樣貌';

  const promptText = `請為我生成這部影片的開始片頭海報圖【${ratio}】，
符合您建議的劇情風格。

1. 場景與人物要極度真實感或符合建議風格。
2. 請以${char1Ref}。
3. 請以${char2Ref}。
4. 要有中文標題文字，中文標題：【${title}】。
5. 除了中文標題以外，海報圖片中不要有其他文字。`;

  const outputEl = document.getElementById('prompt-output-4');
  if (outputEl) outputEl.textContent = promptText;
  saveUserData();
}

// 5. AI 背景配樂提示詞
function updatePrompt5() {
  const name = document.getElementById('p5-name').value || '時光的微風';
  const duration = document.getElementById('p5-duration').value || '30';
  const plot = document.getElementById('p5-plot').value || '少年與老拉布拉多在陽光草地上奔跑互動，回憶與成長的溫馨感人旅程';
  const style = document.getElementById('p5-style').value || '新海誠風格動漫、清澈溫暖的鋼琴、悠揚小提琴弦樂、無人聲、治癒感人';

  const promptText = `請為我提供符合下面劇情的影片配樂，
時長為【${duration}】秒，無人聲。

影片名稱：【${name}】

劇情大綱：【${plot}】

影片風格：【${style}】`;

  const outputEl = document.getElementById('prompt-output-5');
  if (outputEl) outputEl.textContent = promptText;
  saveUserData();
}

// Motion tag appender for Step 5
function appendMotionTag(tag) {
  const textarea = document.getElementById('custom-motion-prompt');
  if (!textarea) return;
  const current = textarea.value.trim();
  if (current.length === 0) {
    textarea.value = tag;
  } else {
    textarea.value = current + ', ' + tag;
  }
  showToast(`已加入運鏡標籤：${tag}`);
}

function clearMotionInput() {
  const textarea = document.getElementById('custom-motion-prompt');
  if (textarea) textarea.value = '';
}

// ====================================================
// STORYBOARD INTERACTIVE TABLE
// ====================================================

function renderStoryboardTable() {
  const tbody = document.getElementById('storyboard-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  let totalSec = 0;
  let doneCount = 0;

  storyboardData.forEach((shot, index) => {
    totalSec += Number(shot.duration) || 0;
    if (shot.done) doneCount++;

    const tr = document.createElement('tr');
    tr.className = `hover:bg-slate-900/60 transition ${shot.done ? 'bg-emerald-950/20' : ''}`;

    tr.innerHTML = `
      <td class="p-3 text-center">
        <input type="checkbox" ${shot.done ? 'checked' : ''} onchange="toggleShotDone(${index})" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700 cursor-pointer">
      </td>
      <td class="p-3 font-mono font-bold text-sky-400">
        <input type="text" value="${shot.shotNum}" onchange="updateShotField(${index}, 'shotNum', this.value)" class="w-10 bg-transparent text-center border-b border-dashed border-slate-700 focus:outline-none focus:border-sky-400">
      </td>
      <td class="p-3 font-medium text-slate-300">
        <input type="text" value="${shot.shotType}" onchange="updateShotField(${index}, 'shotType', this.value)" class="w-full bg-transparent border-b border-dashed border-slate-700 focus:outline-none focus:border-sky-400">
      </td>
      <td class="p-3 text-slate-200">
        <textarea rows="2" onchange="updateShotField(${index}, 'content', this.value)" class="w-full bg-slate-900/70 rounded p-1.5 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-sky-400 resize-none">${shot.content}</textarea>
      </td>
      <td class="p-3 text-slate-300">
        <textarea rows="2" onchange="updateShotField(${index}, 'dialogue', this.value)" class="w-full bg-slate-900/70 rounded p-1.5 text-xs text-slate-300 border border-slate-800 focus:outline-none focus:border-sky-400 resize-none">${shot.dialogue}</textarea>
      </td>
      <td class="p-3 text-center">
        <input type="number" min="1" max="60" value="${shot.duration}" onchange="updateShotField(${index}, 'duration', Number(this.value))" class="w-12 bg-slate-900 rounded p-1 text-center font-bold text-sky-400 border border-slate-800 focus:outline-none focus:border-sky-400">
      </td>
      <td class="p-3 text-center">
        <button onclick="deleteStoryboardRow(${index})" title="刪除此鏡頭" class="text-slate-500 hover:text-red-400 p-1 transition">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Update summary metrics
  const totalShotsEl = document.getElementById('sb-total-shots');
  const totalSecEl = document.getElementById('sb-total-seconds');
  const compRateEl = document.getElementById('sb-completion-rate');

  if (totalShotsEl) totalShotsEl.textContent = storyboardData.length;
  if (totalSecEl) totalSecEl.textContent = totalSec;
  if (compRateEl) {
    const rate = storyboardData.length > 0 ? Math.round((doneCount / storyboardData.length) * 100) : 0;
    compRateEl.textContent = `${rate}% (${doneCount}/${storyboardData.length})`;
  }

  saveUserData();
}

function updateShotField(index, field, value) {
  if (storyboardData[index]) {
    storyboardData[index][field] = value;
    renderStoryboardTable();
  }
}

function toggleShotDone(index) {
  if (storyboardData[index]) {
    storyboardData[index].done = !storyboardData[index].done;
    renderStoryboardTable();
  }
}

function addStoryboardRow() {
  const nextNum = (storyboardData.length + 1).toString().padStart(2, '0');
  storyboardData.push({
    id: Date.now(),
    shotNum: nextNum,
    shotType: '中景 (Medium Shot)',
    content: '新鏡頭畫面內容描繪...',
    dialogue: '（無台詞）',
    duration: 5,
    done: false
  });
  renderStoryboardTable();
  showToast(`已新增鏡頭 ${nextNum}！`);
}

function deleteStoryboardRow(index) {
  if (storyboardData.length <= 1) {
    showToast('至少保留一個鏡頭分鏡！', 'error');
    return;
  }
  storyboardData.splice(index, 1);
  renderStoryboardTable();
  showToast('已刪除鏡頭');
}

function resetStoryboardDemo() {
  storyboardData = JSON.parse(JSON.stringify(initialStoryboard));
  renderStoryboardTable();
  showToast('已恢復預設示範分鏡腳本！');
}

// ====================================================
// CHECKLIST & OVERALL PROGRESS
// ====================================================

function updateStepProgress(stepNum) {
  const checkboxes = document.querySelectorAll(`.step${stepNum}-chk`);
  let checkedCount = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  const countBadge = document.getElementById(`chk-step${stepNum}-count`);
  if (countBadge) {
    countBadge.textContent = `${checkedCount}/${checkboxes.length}`;
  }

  // Update Nav Button Completed Class
  const navBtn = document.querySelector(`.step-nav-btn[data-step="${stepNum}"]`);
  if (navBtn) {
    if (checkedCount === checkboxes.length && checkboxes.length > 0) {
      navBtn.classList.add('completed');
    } else {
      navBtn.classList.remove('completed');
    }
  }

  updateOverallProgress();
  saveUserData();
}

function updateAllChecklistUI() {
  for (let i = 1; i <= totalSteps; i++) {
    updateStepProgress(i);
  }
}

function updateOverallProgress() {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"][class*="-chk"]');
  let checkedCount = 0;
  allCheckboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  const percent = allCheckboxes.length > 0 ? Math.round((checkedCount / allCheckboxes.length) * 100) : 0;

  const bar = document.getElementById('overall-progress-bar');
  const text = document.getElementById('overall-progress-text');
  const stepCount = document.getElementById('step-task-count');

  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `${percent}%`;

  // Calculate completed steps
  let completedSteps = 0;
  for (let i = 1; i <= totalSteps; i++) {
    const stepBoxes = document.querySelectorAll(`.step${i}-chk`);
    const stepDone = Array.from(stepBoxes).every(cb => cb.checked);
    if (stepDone && stepBoxes.length > 0) completedSteps++;
  }

  if (stepCount) {
    stepCount.textContent = `(${completedSteps} / 7 階段已就緒)`;
  }
}

// ====================================================
// CLIPBOARD & TOAST NOTIFICATION
// ====================================================

function copyToClipboard(elementIdOrText, buttonEl) {
  let text = '';
  const el = document.getElementById(elementIdOrText);
  if (el) {
    text = el.value !== undefined ? el.value : el.textContent;
  } else {
    text = elementIdOrText;
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast('已成功複製到剪貼簿！');
    if (buttonEl) {
      const originalHTML = buttonEl.innerHTML;
      buttonEl.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> <span>已複製！</span>`;
      setTimeout(() => {
        buttonEl.innerHTML = originalHTML;
      }, 1800);
    }
  }).catch(() => {
    showToast('複製失敗，請手動反白選取複製', 'error');
  });
}

function copyAllPrompts() {
  const p1 = document.getElementById('lib-prompt-1').textContent;
  const p2 = document.getElementById('lib-prompt-2').textContent;
  const p3 = document.getElementById('lib-prompt-3').textContent;
  const p4 = document.getElementById('lib-prompt-4').textContent;
  const p5 = document.getElementById('lib-prompt-5').textContent;

  const fullText = `# AI 短片創作全套提示詞包（課堂示範架構）

### 1. 劇情發想提示詞
\`\`\`
${p1}
\`\`\`

### 2. 分鏡設計提示詞
\`\`\`
${p2}
\`\`\`

### 3. 角色設定表 Character Sheet
\`\`\`
${p3}
\`\`\`

### 4. 影片片頭海報提示詞
\`\`\`
${p4}
\`\`\`

### 5. AI 背景配樂提示詞
\`\`\`
${p5}
\`\`\`
`;

  navigator.clipboard.writeText(fullText).then(() => {
    showToast('全套 5 組提示詞已複製！');
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item pointer-events-auto px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center space-x-2.5 backdrop-blur-md transition-all ${
    type === 'error'
      ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
      : 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-500/10'
  }`;

  const icon = type === 'error' ? 'fa-triangle-exclamation text-rose-400' : 'fa-circle-check text-emerald-400';
  toast.innerHTML = `<i class="fa-solid ${icon} text-sm"></i><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// ====================================================
// CELEBRATION CONFETTI
// ====================================================

function celebrateSuccess() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }
  showToast('🎉 恭喜完成全流程！您可以匯出專案筆記！');
}

// ====================================================
// PROJECT EXPORT MODAL & DATA PERSISTENCE
// ====================================================

function exportProjectModal() {
  const modal = document.getElementById('export-modal');
  const textarea = document.getElementById('export-modal-textarea');
  if (!modal || !textarea) return;

  const storySynopsis = document.getElementById('project-story-synopsis')?.value || '（未填寫大綱）';
  const p1 = document.getElementById('prompt-output-1')?.textContent || '';
  const p2 = document.getElementById('prompt-output-2')?.textContent || '';
  const p3 = document.getElementById('prompt-output-3')?.textContent || '';
  const p4 = document.getElementById('prompt-output-4')?.textContent || '';
  const p5 = document.getElementById('prompt-output-5')?.textContent || '';

  // Generate Storyboard Table Markdown
  let sbMarkdown = '| 鏡頭編號 | 景別與運鏡 | 畫面描述 | 台詞 / 字幕 | 秒數 | 狀態 |\n|---|---|---|---|---|---|\n';
  let totalSec = 0;
  storyboardData.forEach(shot => {
    totalSec += Number(shot.duration) || 0;
    sbMarkdown += `| ${shot.shotNum} | ${shot.shotType} | ${shot.content} | ${shot.dialogue} | ${shot.duration}s | ${shot.done ? '✅ 已完成' : '⏳ 待處理'} |\n`;
  });

  const fullMarkdown = `# AI 短片創作完整專案筆記
> 匯出時間：${new Date().toLocaleString('zh-TW')}
> 預估總片長：${totalSec} 秒

---

## 📌 一、核心劇情方案大綱
${storySynopsis}

---

## 🎬 二、分鏡腳本清單 (Storyboard)
${sbMarkdown}

---

## 🪄 三、全套課堂提示詞

### 1. 劇情發想提示詞
\`\`\`
${p1}
\`\`\`

### 2. 分鏡設計提示詞
\`\`\`
${p2}
\`\`\`

### 3. 角色設定表 Character Sheet
\`\`\`
${p3}
\`\`\`

### 4. 影片片頭海報提示詞
\`\`\`
${p4}
\`\`\`

### 5. AI 背景配樂提示詞
\`\`\`
${p5}
\`\`\`

---
*Generated by AI 短片創作七階段教學工作台*
`;

  textarea.value = fullMarkdown;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeExportModal() {
  const modal = document.getElementById('export-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function copyExportText(buttonEl) {
  copyToClipboard('export-modal-textarea', buttonEl);
}

function downloadMarkdownFile() {
  const text = document.getElementById('export-modal-textarea').value;
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI短片創作專案_${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('已開始下載 Markdown 專案檔！');
}

// LocalStorage Auto-save
function saveUserData() {
  const state = {
    currentStep,
    storySynopsis: document.getElementById('project-story-synopsis')?.value || '',
    storyboard: storyboardData,
    p1: {
      duration: document.getElementById('p1-duration')?.value,
      tone: document.getElementById('p1-tone')?.value,
      style: document.getElementById('p1-style')?.value,
      type: document.getElementById('p1-type')?.value,
      char1: document.getElementById('p1-char1')?.value,
      char2: document.getElementById('p1-char2')?.value,
      scene: document.getElementById('p1-scene')?.value
    },
    p2: {
      scheme: document.getElementById('p2-scheme')?.value,
      shots: document.getElementById('p2-shots')?.value
    },
    p3: {
      char: document.getElementById('p3-char')?.value,
      medium: document.getElementById('p3-medium')?.value,
      aspect: document.getElementById('p3-aspect')?.value,
      lighting: document.getElementById('p3-lighting')?.value
    },
    p4: {
      ratio: document.getElementById('p4-ratio')?.value,
      title: document.getElementById('p4-title')?.value,
      char1Ref: document.getElementById('p4-char1-ref')?.value,
      char2Ref: document.getElementById('p4-char2-ref')?.value
    },
    p5: {
      name: document.getElementById('p5-name')?.value,
      duration: document.getElementById('p5-duration')?.value,
      plot: document.getElementById('p5-plot')?.value,
      style: document.getElementById('p5-style')?.value
    },
    checkboxes: []
  };

  const allCheckboxes = document.querySelectorAll('input[type="checkbox"][class*="-chk"]');
  allCheckboxes.forEach((cb, idx) => {
    state.checkboxes.push(cb.checked);
  });

  try {
    localStorage.setItem('AI_VIDEO_STUDIO_STATE', JSON.stringify(state));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

function loadSavedData() {
  try {
    const raw = localStorage.getItem('AI_VIDEO_STUDIO_STATE');
    if (!raw) return;
    const state = JSON.parse(raw);

    if (state.currentStep) currentStep = state.currentStep;
    if (state.storySynopsis && document.getElementById('project-story-synopsis')) {
      document.getElementById('project-story-synopsis').value = state.storySynopsis;
    }
    if (state.storyboard && Array.isArray(state.storyboard)) {
      storyboardData = state.storyboard;
    }

    // Restore P1
    if (state.p1) {
      if (state.p1.duration) document.getElementById('p1-duration').value = state.p1.duration;
      if (state.p1.tone) document.getElementById('p1-tone').value = state.p1.tone;
      if (state.p1.style) document.getElementById('p1-style').value = state.p1.style;
      if (state.p1.type) document.getElementById('p1-type').value = state.p1.type;
      if (state.p1.char1) document.getElementById('p1-char1').value = state.p1.char1;
      if (state.p1.char2) document.getElementById('p1-char2').value = state.p1.char2;
      if (state.p1.scene) document.getElementById('p1-scene').value = state.p1.scene;
    }

    // Restore P2
    if (state.p2) {
      if (state.p2.scheme) document.getElementById('p2-scheme').value = state.p2.scheme;
      if (state.p2.shots) document.getElementById('p2-shots').value = state.p2.shots;
    }

    // Restore P3
    if (state.p3) {
      if (state.p3.char) document.getElementById('p3-char').value = state.p3.char;
      if (state.p3.medium) document.getElementById('p3-medium').value = state.p3.medium;
      if (state.p3.aspect) document.getElementById('p3-aspect').value = state.p3.aspect;
      if (state.p3.lighting) document.getElementById('p3-lighting').value = state.p3.lighting;
    }

    // Restore P4
    if (state.p4) {
      if (state.p4.ratio) document.getElementById('p4-ratio').value = state.p4.ratio;
      if (state.p4.title) document.getElementById('p4-title').value = state.p4.title;
      if (state.p4.char1Ref) document.getElementById('p4-char1-ref').value = state.p4.char1Ref;
      if (state.p4.char2Ref) document.getElementById('p4-char2-ref').value = state.p4.char2Ref;
    }

    // Restore P5
    if (state.p5) {
      if (state.p5.name) document.getElementById('p5-name').value = state.p5.name;
      if (state.p5.duration) document.getElementById('p5-duration').value = state.p5.duration;
      if (state.p5.plot) document.getElementById('p5-plot').value = state.p5.plot;
      if (state.p5.style) document.getElementById('p5-style').value = state.p5.style;
    }

    // Restore Checkboxes
    if (state.checkboxes && Array.isArray(state.checkboxes)) {
      const allCheckboxes = document.querySelectorAll('input[type="checkbox"][class*="-chk"]');
      allCheckboxes.forEach((cb, idx) => {
        if (state.checkboxes[idx] !== undefined) {
          cb.checked = state.checkboxes[idx];
        }
      });
    }
  } catch (e) {
    console.error('LocalStorage load error:', e);
  }
}

function loadDemoData() {
  document.getElementById('project-story-synopsis').value = '方案 1【草地上的約定】：少年與老拉布拉多在陽光璀璨的草地上相伴奔跑，走過四季歲月，即使時光漸逝，彼此的信任與約定依然如夏日微風般溫暖長存。';
  resetPrompt1();
  document.getElementById('p2-scheme').value = '方案1：草地上的約定';
  document.getElementById('p2-shots').value = '6';
  updatePrompt2();

  document.getElementById('p3-char').value = '17歲黑髮少年，穿藍白色夏日襯衫與帆布鞋';
  updatePrompt3();

  document.getElementById('p4-title').value = '草地上的約定';
  updatePrompt4();

  document.getElementById('p5-name').value = '草地上的約定';
  document.getElementById('p5-plot').value = '少年與老拉布拉多在金黃草地上奔跑互動，陽光下彼此相依的溫馨感人旅程';
  updatePrompt5();

  storyboardData = JSON.parse(JSON.stringify(initialStoryboard));
  renderStoryboardTable();

  // Mark all Step 1 and Step 2 checkboxes as complete
  const step1Checkboxes = document.querySelectorAll('.step1-chk');
  step1Checkboxes.forEach(cb => cb.checked = true);
  updateStepProgress(1);

  showToast('已成功載入「草地上的約定」講師範例專案！');
}
