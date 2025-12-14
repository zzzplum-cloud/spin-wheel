/* ================== ตั้งค่าล็อก ================== */
const LOCK_INDEX = 2; // 0 = ชื่อแรก, 1 = ชื่อถัดไป
/* ================================================= */

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const r  = canvas.width / 2;

const spinBtn = document.getElementById("spinBtn");

let names = [];
let angle = 0;
let spinning = false;

/* โหลดรายชื่อ */
function loadNames() {
  names = document.getElementById("nameInput").value
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

/* วาดวงล้อ */
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (names.length === 0) return;

  const slice = (Math.PI * 2) / names.length;

  for (let i = 0; i < names.length; i++) {
    const start = angle + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.fillStyle = `hsl(${i * 360 / names.length},70%,60%)`;
    ctx.fill();

    // ข้อความ
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.font = "23px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(names[i], r - 10, 5);
    ctx.restore();
  }

  // ลูกศรด้านบน
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx - 10, 20);
  ctx.lineTo(cx + 10, 20);
  ctx.closePath();
  ctx.fill();
}

/* หมุนวงล้อ (ล็อกผลลัพธ์) */
function spin() {
  if (spinning) return;
  loadNames();
  if (names.length === 0) return alert("กรุณาใส่รายชื่อ");

  const slice = (Math.PI * 2) / names.length;
  const spins = 5;

  const targetAngle =
    Math.PI * 2 * spins
    - Math.PI / 2
    - (LOCK_INDEX * slice)
    - (slice / 2);

  const startAngle = angle;
  const startTime = performance.now();
  const duration = 3000;

  spinning = true;

  function animate(time) {
    const t = Math.min((time - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    angle = startAngle + (targetAngle - startAngle) * ease;
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      alert("🎯 ได้ชื่อ: " + names[LOCK_INDEX]);
    }
  }

  requestAnimationFrame(animate);
}

/* ปุ่มหมุน */
spinBtn.addEventListener("click", spin);

/* วาดวงล้อตั้งแต่เปิดหน้า */
loadNames();
drawWheel();
const nameInput = document.getElementById("nameInput");

/* เมื่อผู้เล่นแก้ไขชื่อ → วงล้อเปลี่ยนทันที */
nameInput.addEventListener("input", () => {
  loadNames();
  drawWheel();

});


