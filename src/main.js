function updateThemeIcon() {
	document.getElementById("theme-icon").className = document.documentElement.classList.contains("dark") ? "fa fa-sun" : "fa fa-moon"
}

function toggleTheme() {
	let t = document.documentElement.classList.toggle("dark");
	localStorage.theme = t ? "dark" : "light", updateThemeIcon()
}

updateThemeIcon();