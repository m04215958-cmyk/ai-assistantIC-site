const matrixCanvas = document.getElementById('matrix');
const matrixCtx = matrixCanvas.getContext('2d');

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const chars = 'アイウエオカキクケコサシスシセソタチツテト01ABCDEF';
const fontSize = 16;
const columns = matrixCanvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

let matrixPaused = false;

function drawMatrix() {
  if (matrixPaused) return;

  matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  matrixCtx.fillStyle = '#ffffff';
  matrixCtx.font = fontSize + 'px monospace';

  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    matrixCtx.fillText(text, i * fontSize, y * fontSize);
    if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
});

let sparksCanvas, sparksCtx;
const sparks = [];
let paidEl = null;
let sparksPaused = false;

function initSparks() {
  sparksCanvas = document.querySelector('.sparks');
  if (!sparksCanvas) return;
  sparksCtx = sparksCanvas.getContext('2d');
  paidEl = document.querySelector('.paid');

  const resizeSparks = () => {
    if (!paidEl) return;
    const rect = paidEl.getBoundingClientRect();
    sparksCanvas.width = rect.width;
    sparksCanvas.height = rect.height;
  };
  resizeSparks();
  window.addEventListener('resize', resizeSparks);
}

function spawnSpark() {
  if (sparksPaused) return;
  if (!sparksCanvas || !sparksCanvas.width || !paidEl) return;

  const canvasRect = sparksCanvas.getBoundingClientRect();
  const titleEl = paidEl.querySelector('.plan-title');
  if (!titleEl) return;

  const titleRect = titleEl.getBoundingClientRect();

  const titleCenterX = titleRect.left - canvasRect.left + titleRect.width / 2;
  const titleCenterY = titleRect.top - canvasRect.top + titleRect.height / 2;

  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.8 + 0.3;

  const offsetX = (Math.random() - 0.5) * titleRect.width * 1.1;
  const offsetY = (Math.random() - 0.5) * titleRect.height * 1.2;

  sparks.push({
    x: titleCenterX + offsetX,
    y: titleCenterY + offsetY,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: Math.random() * 1.8 + 0.5,
    a: 1,
    life: Math.random() * 60 + 60,
    maxLife: 120
  });
}

function drawSparks() {
  if (sparksPaused) {
    requestAnimationFrame(drawSparks);
    return;
  }

  if (sparksCtx && sparksCanvas) {
    sparksCtx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];

      sparksCtx.beginPath();
      sparksCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sparksCtx.fillStyle = `rgba(255, 215, 0, ${s.a})`;
      sparksCtx.shadowColor = '#ffd700';
      sparksCtx.shadowBlur = 15;
      sparksCtx.fill();
      sparksCtx.shadowBlur = 0;

      s.x += s.vx;
      s.y += s.vy;
      s.life--;
      s.a = Math.max(0, s.life / s.maxLife);

      if (s.life <= 0) sparks.splice(i, 1);
    }
  }
  requestAnimationFrame(drawSparks);
}

initSparks();
drawSparks();
setInterval(spawnSpark, 60);

const box = document.querySelector('.box');
const title = document.querySelector('.title');
const btn = document.getElementById('getBtn');
const plans = document.getElementById('plans');
const zoomWrapper = document.getElementById('zoomWrapper');

btn.addEventListener('click', () => {
  box.classList.add('expand');
  title.classList.add('fade');
  btn.classList.add('fade');

  setTimeout(() => {
    box.classList.add('shrink');
  }, 500);

  setTimeout(() => {
    document.querySelector('.container').style.display = 'none';
    plans.classList.add('show');

    setTimeout(() => {
      initSparks();
    }, 100);
  }, 1100);
});

const btnPaid = document.querySelector('.btn-paid');
const btnFree = document.querySelector('.btn-free');

function typeMessage(text, side) {
  return new Promise(resolve => {
    const messagesEl = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-${side}`;
    messagesEl.appendChild(msg);

    requestAnimationFrame(() => {
      msg.classList.add('show');
    });

    let i = 0;
    const textSpan = document.createElement('span');
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    msg.appendChild(textSpan);
    msg.appendChild(cursorSpan);

    const interval = setInterval(() => {
      if (i < text.length) {
        textSpan.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
        cursorSpan.remove();
        resolve();
      }
    }, 45);
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

if (btnPaid) {
  btnPaid.addEventListener('mouseenter', () => {
    document.body.classList.add('screen-shake');
    zoomWrapper.classList.add('zoom-paid');
    zoomWrapper.classList.add('box-shake');
  });

  btnPaid.addEventListener('mouseleave', () => {
    document.body.classList.remove('screen-shake');
    zoomWrapper.classList.remove('zoom-paid');
    zoomWrapper.classList.remove('box-shake');
  });

  btnPaid.addEventListener('click', async () => {
    matrixPaused = true;
    sparksPaused = true;

    document.body.classList.remove('screen-shake');
    zoomWrapper.classList.remove('box-shake');

    const btnPaidEl = document.querySelector('.btn-paid');
    btnPaidEl.style.animation = 'none';
    btnPaidEl.style.transform = 'none';
    btnPaidEl.style.boxShadow = `
      0 0 15px #ffd700,
      0 0 35px #ffd700,
      0 0 70px #ffd700,
      inset 0 0 15px rgba(255, 215, 0, 0.4)
    `;

    const planTitle = document.querySelector('.plan-title.gold');
    if (planTitle) planTitle.style.animation = 'none';

    document.querySelectorAll('.plans, .box').forEach(el => {
      el.style.animation = 'none';
    });

    document.body.classList.add('fade-out-all');

    await wait(3000);

    const chatScreen = document.getElementById('chatScreen');
    chatScreen.classList.add('show');

    await wait(300);

    await typeMessage('Hello!', 'right');
    await wait(500);
    await typeMessage('Hello! How can I help you?', 'left');
    await wait(500);
    await typeMessage('What can you do?', 'right');

    await wait(1000);

    const whiteScreen = document.getElementById('whiteScreen');
    whiteScreen.classList.add('show');

    await wait(5000);

    whiteScreen.classList.remove('show');

    await wait(2000);

    chatScreen.classList.remove('show');

    const messagesEl = document.getElementById('chatMessages');
    messagesEl.innerHTML = '';

    matrixPaused = false;
    sparksPaused = false;

    document.body.classList.remove('fade-out-all');

    zoomWrapper.classList.remove('zoom-paid');
    zoomWrapper.classList.remove('box-shake');
    zoomWrapper.style.display = '';
    document.querySelectorAll('.plans').forEach(el => {
      el.style.animation = '';
    });
    document.querySelectorAll('.box').forEach(el => {
      el.style.animation = '';
    });

    const btnPaidEl2 = document.querySelector('.btn-paid');
    btnPaidEl2.style.animation = '';
    btnPaidEl2.style.transform = '';
    btnPaidEl2.style.boxShadow = '';

    const planTitle2 = document.querySelector('.plan-title.gold');
    if (planTitle2) planTitle2.style.animation = '';
  });
}

if (btnFree) {
  btnFree.addEventListener('click', () => {
  });
}
