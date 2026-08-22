const canvas = document.getElementById('physicsCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const colors = ['#FF6B00', '#FFA800', '#FF8533'];

  class Ball {
    constructor(x, y, radius, color) {
      this.x = x; this.y = y; this.radius = radius; this.color = color;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.vx *= -1;
      if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  const balls = Array.from({ length: 14 }, () => 
    new Ball(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 30 + 20, colors[Math.floor(Math.random() * colors.length)])
  );

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(b => { b.update(); b.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
