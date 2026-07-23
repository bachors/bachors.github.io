const LABELS = {
	today: "Hari ini",
	yesterday: "Kemarin",
	seven_day: "7 hari",
	twentyeight_day: "28 hari",
	this_month: "Bulan ini",
	last_month: "Bulan lalu",
	all_time: "Semua waktu"
};

let admobData = {};

function stat(t, a, e) {
	return `
			<div class="flex items-start gap-2">
				<i class="${t} text-xs mt-1 text-gray-400 dark:text-gray-500 w-3"></i>
				<div>
					<p class="text-xs text-gray-400 dark:text-gray-500">${a}</p>
					<p class="text-sm font-semibold text-gray-800 dark:text-gray-100">${e}</p>
				</div>
			</div>`
}

function renderAdmobCard(t) {
	const a = admobData[t];
	document.getElementById("admob-date").textContent = a.date_range, document.getElementById("admob-stats").innerHTML = stat("fa fa-arrow-pointer", "Peristiwa", a.ad_requests) + stat("fa fa-coins", "Pendapatan", a.earnings.split(",")[0].replace(" ", "")) + stat("fa fa-rectangle-ad", "Tayangan", a.ad_impressions) + stat("fa fa-chart-column", "eCPM", a.ecpm.split(",")[0].replace(" ", "")), document.querySelectorAll(".admob-btn").forEach(a => {
		const e = a.dataset.key === t;
		a.className = "admob-btn text-xs px-3 py-1 rounded-lg transition-colors " + (e ? "bg-red-400 dark:bg-red-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300")
	})
}

function renderCards(t, a) {
	admobData = t;
	const e = new Date,
		s = `${String(e.getDate()).padStart(2,"0")}/${String(e.getMonth()+1).padStart(2,"0")}/${String(e.getFullYear())}`,
		n = Object.keys(t).map(t => `
			<button class="admob-btn" data-key="${t}" onclick="renderAdmobCard('${t}')">${LABELS[t]||t}</button>`).join(""),
		r = `
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-3 mb-2 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider text-center leading-none">
				diperbarui jam • <span class="font-semibold text-sm">${formatTime(a)}</span>
			</div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-2 mb-3 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="bg-white dark:bg-[#1e1f21] rounded-2xl overflow-hidden shadow-md max-w-xs mx-auto">
				<img alt="Placeholder" class="block h-auto w-full" src="img/rp.png">
				<div class="flex items-center gap-3 mb-3 bg-gray-100 dark:bg-white/5 pt-3 pr-5 pb-3 pl-5">
					<div class="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-400/10 flex items-center justify-center">
						<svg style="height: 1rem; width: 1rem; role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<title>Google AdMob</title>
							<path style="fill: #eab000" d="M11.46.033h-.052A11.993 11.993 0 0 0 0 11.922v.052c0 7.475 6.563 11.928 11.447 11.928h.17a3.086 3.086 0 0 0 3.125-3.047c0-1.693-1.433-2.917-3.152-2.917h-.039a6.016 6.016 0 0 1-5.508-6.368v-.052a6.016 6.016 0 0 1 5.573-5.509c1.719 0 3.125-1.237 3.125-2.917A3.086 3.086 0 0 0 11.604.02h-.143zm2.031.026a3.516 3.516 0 0 1 1.746 3.021 3.386 3.386 0 0 1-1.928 3.047c2.865.6 4.532 3.126 4.688 5.378v7.684a3.49 3.49 0 0 1 6.003.026v-7.736A12.046 12.046 0 0 0 13.491.045zm7.475 17.932a2.995 2.995 0 1 0 .04 0z"/>
						</svg>
					</div>
					<div>
						<p class="font-semibold text-gray-900 dark:text-white text-sm">Google AdMob</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Performa · 
							<span id="admob-date">
						</p>
					</div>
				</div>
				<div class="pr-5 pb-5 pl-5">
					<div id="admob-stats" class="grid grid-cols-2 gap-3 mb-3"></div>
					<hr class="h-0.5 bg-gray-100 dark:bg-white/5 border-0 mb-3">
					<div class="flex flex-wrap gap-2">${n}</div>
				</div>
			</div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-3 mb-2 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider text-center leading-none">
				video terbaru
			</div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-2 mb-3 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div id="reels" class="rounded-2xl overflow-hidden shadow-md max-w-xs mx-auto" data-ycp_title="Reels - bachors.id" data-ycp_channel="PLLZytswN8jaU"></div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-3 mb-2 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider text-center leading-none">
				Code with me • <span class="font-semibold text-sm">10PM - 3AM</span>
			</div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-2 mb-3 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<iframe class="rounded-2xl shadow-md max-w-xs mx-auto" data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/59kZpsO6vaSb1p5g1wfp2y?utm_source=generator&si=34b1b61746ed40e3" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 my-3 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider text-center leading-none">
				Hue are you ?
			</div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-3 text-center">
				<i class="fa fa-code"></i>
			</div>`,
		d = `
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-3 mb-2 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider text-center leading-none">
				progres hari ini • <span class="font-semibold text-sm">${s}</span>
			</div>
			<div class="text-sm text-gray-400/70 dark:text-gray-600 mt-2 mb-3 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="bg-white dark:bg-[#1e1f21] rounded-2xl overflow-hidden shadow-md max-w-xs mx-auto">
				<img alt="Placeholder" class="block h-auto w-full" src="img/dv.png">
				<div class="flex items-center gap-3 mb-3 bg-gray-100 dark:bg-white/5 pt-3 pr-5 pb-3 pl-5">
					<div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-400/10 flex items-center justify-center">
						<i class="fa-brands fa-google-play text-blue-500 dark:text-blue-400"></i>
					</div>
					<div>
						<p class="font-semibold text-gray-900 dark:text-white text-sm">Google Play</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Dirilis tanggal · 10/08/2021</p>
					</div>
				</div>
				<div class="pr-5 pb-5 pl-5">
					<div class="grid grid-cols-2 gap-3">${stat("fa fa-download","Download","500 rb+")}${stat("fa fa-tags","Kategori","Hiburan")}${stat("fa fa-star-half-stroke","Rating","4,8 ★")}${stat("fa fa-comment-dots","Ulasan","10 rb+")}</div>
				</div>
			</div>`;
	document.getElementById("cards").innerHTML += d + r, renderAdmobCard("seven_day")
	const apikey = "AIzaSyDP4jj5m879TbJlaP4HFdshQg8oFkJnJME";
	ycp("#reels", { apikey: apikey, playlist: 7, autoplay: true, related: true });
}

async function fetchData() {
	try {
		let t = await fetch("https://script.google.com/macros/s/AKfycbxWqv8sfrNtuqkJ281wRBkiftm_6e7zcAe-oTKzrWs3grLG858sBsYQ2_cpJhBxnHZuQQ/exec", {
			method: "POST",
			body: new URLSearchParams({
				username: "bachors"
			})
		});
		if (!t.ok) throw Error(`HTTP ${t.status}`);
		let a = await t.json();
		renderCards(a.data, a.last_update)
	} catch (t) {}
}

function formatTime(t) {
	let [a, e] = t.split(":").map(Number), s = a >= 12 ? "PM" : "AM";
	return 0 == (a %= 12) && (a = 12), `${String(a).padStart(2,"0")}:${String(e).padStart(2,"0")} ${s}`
}

fetchData();