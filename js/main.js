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

function pindahTab(e) {
	["con-html", "con-css", "con-js"].forEach(t => {
		const n = document.getElementById(t),
			s = document.getElementById("tab-btn-" + t),
			r = t === e;
		n.style.display = r ? "" : "none", s.classList.toggle("bg-white/10", r), s.classList.toggle("bg-[#1e1f21]", !r), s.classList.toggle("border-[#343537]", r),  s.classList.toggle("border-white/10", !r),s.setAttribute("aria-selected", r)
	})
}