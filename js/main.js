function updateThemeIcon() {
	document.getElementById("theme-icon").className = document.documentElement.classList.contains("dark") ? "fa fa-sun" : "fa fa-moon"
}

function updateBg() {
	const dark = document.documentElement.classList.contains("dark");
	document.getElementById("bg").classList.toggle("bg-gelap", dark);
	document.getElementById("bg").classList.toggle("bg-terang", !dark)
}

function toggleTheme() {
	let t = document.documentElement.classList.toggle("dark");
	localStorage.theme = t ? "dark" : "light", updateThemeIcon(), updateBg()
}

updateThemeIcon(),updateBg();

const star_canvas = document.getElementById('stars-canvas');
const star_ctx = star_canvas.getContext('2d');
let star_stars = [];
const star_numStars = 150;
const star_color = ['oklch(50.8% 0.118 165.612)', 'oklch(68.1% 0.162 75.834)', 'oklch(52.5% 0.223 3.958)', 'oklch(51.8% 0.253 323.949)', 'oklch(49.1% 0.27 292.581)', 'oklch(48.8% 0.243 264.376)', 'oklch(52% 0.105 223.128)', 'oklch(53.2% 0.157 131.589)', 'oklch(55.5% 0.163 48.998)', 'oklch(50.5% 0.213 27.518)'];

function star_resizeCanvas() {
	star_canvas.width = window.innerWidth;
	star_canvas.height = window.innerHeight
}

window.addEventListener('resize', star_resizeCanvas);
star_resizeCanvas();

for (let i = 0; i < star_numStars; i++) {
	star_stars.push({
		x: Math.random() * star_canvas.width,
		y: Math.random() * star_canvas.height,
		size: Math.random() * 1.5 + 0.5,
		speed: Math.random() * 0.05 + 0.01,
		twinkleSpeed: Math.random() * 0.02 + 0.005,
		opacity: Math.random(),
		color: star_color[Math.floor(Math.random() * star_color.length)]
	})
}

function star_animateStars() {
	star_ctx.clearRect(0, 0, star_canvas.width, star_canvas.height);
	star_stars.forEach(star => {
		star_ctx.fillStyle = star.color;
		star_ctx.globalAlpha = star.opacity;
		star_ctx.beginPath();
		star_ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
		star_ctx.fill();
		star.opacity += star.twinkleSpeed;
		if (star.opacity > 1 || star.opacity < 0.1) {
			star.twinkleSpeed = -star.twinkleSpeed
		}
		star.y -= star.speed;
		if (star.y < 0) {
			star.y = star_canvas.height;
			star.x = Math.random() * star_canvas.width
		}
	});
	requestAnimationFrame(star_animateStars)
}
star_animateStars();