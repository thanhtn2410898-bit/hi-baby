// Story timing (ms)
const T_VOID_MS = 5000;          // "khoảng trống" 5s
const T_OUTSIDE_AUTO_MS = 0;     // outside xuất hiện ngay sau void
const T_INSIDE_DELAY_MS = 400;   // delay khi bấm cửa
const T_SANTA_IN_MS = 1800;      // thời gian santa đi xuống
const T_THROW_MS = 900;          // delay sau khi santa tới
const T_END_DELAY_MS = 1200;     // delay trước end

const $ = (sel) => document.querySelector(sel);

const sceneVoid = $("#scene-void");
const sceneOutside = $("#scene-outside");
const sceneInside = $("#scene-inside");
const sceneEnd = $("#scene-end");

const door = $("#scene-outside .door");
const startStoryBtn = $("#startStory");
const openLetterBtn = $("#openLetter");
const restartBtn = $("#restart");
const restartBtn2 = $("#restart2");

const santa = $("#santa");
const gifts = $("#gifts");
const modal = $("#letterModal");
const closeLetter = $("#closeLetter");
const letterText = $("#letterText");

let storyStarted = false;
let letterUnlocked = false;

const letterContent = `
Cảm ơn em đã đến bên anh.

Anh không hứa sẽ cho em cả thế giới,
nhưng anh hứa sẽ luôn chọn em —
bằng sự chân thành, bằng sự dịu dàng,
và bằng tất cả những gì anh có.

Anh sẽ không bao giờ cố ý làm em buồn hay phiền lòng.
Nếu một ngày anh lỡ vụng về,
anh vẫn mong mình là người đầu tiên
được nắm tay em và nói: “Xin lỗi, để anh sửa.”

Cảm ơn em vì đã ở đây.
Chỉ cần em còn muốn, anh vẫn sẽ ở lại.
`;

function showScene(sceneEl){
  [sceneVoid, sceneOutside, sceneInside, sceneEnd].forEach(s => s.classList.remove("on"));
  sceneEl.classList.add("on");
}

function transition(fromEl, toEl){
  fromEl.classList.add("zoomOut");
  setTimeout(() => {
    fromEl.classList.remove("zoomOut");
    showScene(toEl);
  }, 700);
}

function resetInside(){
  santa.classList.remove("show");
  gifts.classList.remove("show");
  modal.classList.remove("on");
  openLetterBtn.disabled = true;
  letterUnlocked = false;
  storyStarted = false;
}

function openLetter(){
  if(!letterUnlocked) return;
  letterText.textContent = letterContent.trim();
  modal.classList.add("on");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.classList.remove("on");
  modal.setAttribute("aria-hidden", "true");
}

// 0) Start at void, after 5s => outside
function boot(){
  resetInside();
  showScene(sceneVoid);

  setTimeout(() => {
    // void -> outside
    transition(sceneVoid, sceneOutside);
  }, T_VOID_MS + T_OUTSIDE_AUTO_MS);
}

// 1) Outside: click door -> inside
door.addEventListener("click", () => {
  transition(sceneOutside, sceneInside);
  setTimeout(() => {
    // focus inside
  }, T_INSIDE_DELAY_MS);
});

// 2) Inside: run story
startStoryBtn.addEventListener("click", () => {
  if(storyStarted) return;
  storyStarted = true;

  // Santa appears via chimney
  santa.classList.add("show");
  santa.setAttribute("aria-hidden", "false");

  // After santa down, "throw" gifts + unlock letter
  setTimeout(() => {
    gifts.classList.add("show");
    gifts.setAttribute("aria-hidden", "false");

    // Noel disappears (fade)
    santa.style.transition = "opacity 700ms ease";
    santa.style.opacity = "0";

    setTimeout(() => {
      letterUnlocked = true;
      openLetterBtn.disabled = false;

      // show letter automatically once
      openLetter();

      // move to end later (optional)
      setTimeout(() => transition(sceneInside, sceneEnd), T_END_DELAY_MS);
    }, 700);

  }, T_SANTA_IN_MS + T_THROW_MS);
});

openLetterBtn.addEventListener("click", openLetter);
closeLetter.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if(e.target === modal) closeModal();
});

restartBtn.addEventListener("click", () => {
  resetInside();
  transition(sceneInside, sceneVoid);
  setTimeout(boot, 760);
});

restartBtn2.addEventListener("click", () => {
  transition(sceneEnd, sceneVoid);
  setTimeout(boot, 760);
});

// Go
boot();
