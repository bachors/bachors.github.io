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

updateThemeIcon(), updateBg()