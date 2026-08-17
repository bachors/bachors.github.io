/***************************************
* #### ycp.js v8.0 ####
* Coded by Ican Bachors 2014.
* https://github.com/bachors/ycp.js
* Updates will be posted to this site.
***************************************/

function ycp(selector, j) {
    const n = { playlist: 10, autoplay: false, related: false };
    j.playlist = j.playlist ?? n.playlist;
    j.autoplay = j.autoplay ?? n.autoplay;
    j.related  = j.related  ?? n.related;

    let hitung = 0,
    play = !0,
    v,
    vidPlay;

    const els = selector.startsWith('#')
        ? [document.querySelector(selector)]
        : [...document.querySelectorAll(selector)];

    els.forEach((el, i) => {
        const b = el.id ? `#${el.id}` : `.${el.className.split(' ')[0]}`;
        const title   = el.dataset.ycp_title   || 'ycp.js';
        const channel = el.dataset.ycp_channel;
        el.innerHTML  = `<div class="ycp"><div class="belah ycp_vid_play rounded-t-2xl overflow-hidden" title="Play video"></div><div class="belah grid grid-cols-1" id="ycp_youtube_channels${i}"></div></div>`;

        if (channel.substring(0, 2) === 'PL' || channel.substring(0, 2) === 'UU') {
            ycp_list(title, channel, '', i, b, 1);
        } else {
            const d = channel.substring(0, 2) === 'UC' ? 'id' : 'forUsername';
            ycp_play(title, channel, d, i, b);
        }
    });

    function ifPlay() {
        vidPlay.innerHTML = `<iframe src="//www.youtube.com/embed/${v}?rel=${j.related ? 1 : 0}&amp;autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" class="bingkay"></iframe>`;
    }

    function get(url) {
        return fetch(url).then(r => r.json());
    }

    function ycp_play(g, c, d, e, f) {
        get(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&${d}=${c}&key=${j.apikey}`)
            .then(a => {
                const b = a.items[0].contentDetails.relatedPlaylists.uploads;
                ycp_list(g, b, '', e, f, 1);
            });
    }

    function ycp_list(h, f, g, k, l, xyz) {
        get(`https://www.googleapis.com/youtube/v3/playlistItems?part=status,snippet&maxResults=${j.playlist}&playlistId=${f}&key=${j.apikey}&pageToken=${g}`)
            .then(c => {
                hitung = hitung + xyz;
                let d = '<div class="luhur bg-white dark:bg-[#1e1f21]">';
                d += `
					<div class="flex items-center gap-4 p-4">
						<svg class="flex-none w-10 h-10" width="40" height="40" viewBox="0 -1.5 159 159" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M158.34 106.17c-.56-10.19-1.14-20.72-1.9-31.07a117 117 0 0 0-6.81-31.89 67 67 0 0 0-12.45-21.33C125.84 9.08 111 1.85 93.07.38c-11.9-.96-23.38 1.53-33.04 4.09-17.39 4.6-31.4 14.24-41.66 28.64C7.77 48 2.1 65.28 1.55 84.44l-.15 4.63c-.18 5.03-.37 10.22-.16 15.34.2 4.63.8 9.3 1.38 13.82l.59 4.68c.34 2.9 2.29 4.74 5.48 5.19q1.74.2 3.48.2c.83.02 1.7.04 2.52.11q1.25.15 2.47.44l.72.15.1 1.66c.1 1.42.2 2.77.2 4.09.02 3.9 1.12 7.82 3.46 12.31 2.97 5.7 8.04 8.71 14.67 8.73h.08c6.96 0 12.13-3.18 14.97-9.2 2.53-5.37 3.66-9.58 3.66-13.66q.12-12.32-1.04-24.6c-1-9.5-7.97-15.6-17.75-15.6h-.17c-5.42.03-10.01 1.84-13.27 5.23-3.28 3.41-4.93 8.12-4.75 13.62l.08 1.42c.13 2 .24 3.9-.69 5.8l-1.19-.06c-1.72-.06-3.35-.12-4.82-1.37-.35-11.7.18-23.58.76-34.73A90 90 0 0 1 18 55.04C23.4 41.02 31.61 30.54 43.17 23c15.72-10.24 33.28-12.26 48.4-12.88 25.78 2.73 41.85 15.43 49.12 38.82a124 124 0 0 1 5.09 29.2l.13 2.18c.37 5.8.75 11.8.96 17.7q.06 1.35.15 2.7.4 4.07-.11 8.12l-6.17 1.53-.16-.33a4 4 0 0 1-.41-1.04c-.82-5.8-4.08-10.24-10.58-14.42a17.6 17.6 0 0 0-19.7 1.1c-3.7 2.95-5.99 7.42-6.6 12.92a78 78 0 0 0-.23 11.38l.11 3.53q.1 7.9 1.06 15.73c1.3 9.18 7.52 15 17.05 15.98 6.2.63 11.19-1.63 14.41-6.56 4.2-6.4 5.6-12.33 4.31-18.12-.69-3.02-.5-6.17.54-9.09q1.54 0 3.05.06 3.71.15 7.42-.13c5.55-.57 7.99-3.48 7.67-9.16zm-113.8 16.56a41 41 0 0 0-.02 1.92 18.7 18.7 0 0 1-1.46 13.82l-.19.39q-.57 1.25-1.37 2.38a7.7 7.7 0 0 1-6.7 3.02 7.3 7.3 0 0 1-5.93-3.97c-.8-1.46-1.3-3.07-1.44-4.72-.44-7.6-.76-15.39-.95-23.14-.1-4.51 2.2-7.42 6.5-8.18q1.07-.2 2.16-.2c3.43 0 5.75 1.74 7.07 5.28a51 51 0 0 1 2.24 9.47q.24 1.96.1 3.93m84.06-6.23q.02 1.14 0 2.3-.18 3.58.6 7.09c1.24 4.6-.58 8.47-2.35 12.21-1.3 2.78-3.04 4-5.48 3.8-3.63-.28-5.8-1.64-6.82-4.27a21 21 0 0 1-1.6-6.18 446 446 0 0 1-.8-23.14c-.01-1.66 1-3.35 2.75-4.64a9 9 0 0 1 5.26-1.76q1.06 0 2.08.31 2.28.86 4.31 2.21.96.6 2.03 1.2l-.01 3.39c-.02 2.6-.03 5.06.03 7.48" fill="currentColor"/></g><defs><clipPath id="a"><path fill="#fff" d="M.78 0h158v156H.78z"/></clipPath></defs></svg>
						<div class="flex flex-col items-start w-full">
							<h3 class="text-lg font-medium">YouTube</h3>
							<p class="text-gray-400">${h}</p>
						</div>
					</div>`;
                d += `<div class="px-4 pb-2"><span class="tombol text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 vid-prev" title="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></span><span class="hitung tombol mx-4 text-xs font-medium text-gray-700 dark:text-gray-300">${hitung}</span>`;
                d += '<span class="tombol text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 vid-next" title="Berikutnya"><i class="fa-solid fa-chevron-right"></i></span><span class="about text-xs text-gray-400 mt-1" title="ycp.js"><a href="https://bachors.id/ycp.js" target="_BLANK"><i class="fa fa-code-fork"></i></a></span></div></div><div class="handap bg-white dark:bg-[#1e1f21]">';
                c.items.forEach((item, i) => {
                    if (item.status.privacyStatus === 'public') {
                        const b = item.snippet.resourceId.videoId;
                        ycp_part(b, i, k, l);
                        d += `<div class="play hover:bg-gray-100 dark:hover:bg-white/5 px-4 py-2 gap-3 overflow-hidden" data-vvv="${b}" data-img="${item.snippet.thumbnails.high.url}" title="${item.snippet.title}"><div class="thumb rounded-lg overflow-hidden hover:-rotate-3"><img src="${item.snippet.thumbnails.default.url}" alt=" "><span class="rounded-md tm${i}"></span></div>`;
                        d += `<div class="overflow-hidden"><div class="title text-sm block">${item.snippet.title}</div><span class="text-xs text-gray-400 block by${i}"></span><span class="text-xs text-gray-400 block"><span class="views${i}"></span> • <span class="date${i}"></span></span></div></div>`;
                    }
                });
                d += '</div>';

                const container = document.querySelector(`${l} .ycp div#ycp_youtube_channels${k}`);
                container.innerHTML = d;

                vidPlay = document.querySelectorAll(`${l} .ycp div.ycp_vid_play`)[k];

                function setPlayer(videoId, imgUrl) {
                    v = videoId;
                    if (play) {
                        vidPlay.innerHTML = '<a href="#"></a>';
                        vidPlay.style.cssText = `background:url(${imgUrl}) no-repeat center/cover`;
                    } else {
                        ifPlay();
                    }
                }

                if (!c.prevPageToken) {
                    const firstPlay = container.querySelector('div.play');
                    setPlayer(firstPlay.dataset.vvv, firstPlay.dataset.img);
                    container.querySelectorAll('div').forEach(el => el.classList.remove('vid-active'));
                    container.querySelectorAll('div.play')[0].classList.add('vid-active');
                } else {
                    container.querySelector('span.vid-prev').addEventListener('click', e => {
                        e.preventDefault();
                        ycp_list(h, f, c.prevPageToken, k, l, -1);
                    });
                }

                if (c.nextPageToken) {
                    container.querySelector('span.vid-next').addEventListener('click', e => {
                        e.preventDefault();
                        ycp_list(h, f, c.nextPageToken, k, l, 1);
                    });
                }

                container.querySelectorAll('div.play').forEach(el => {
                    el.addEventListener('click', e => {
                        e.preventDefault();
                        container.querySelectorAll('div').forEach(d => d.classList.remove('vid-active'));
                        el.classList.add('vid-active');
                        setPlayer(el.dataset.vvv, el.dataset.img);
                    });
                });

                vidPlay.addEventListener('click', e => {
                    e.preventDefault();
                    const active = container.querySelector('div.play.vid-active');
                    v = active.dataset.vvv;
                    ifPlay();
                });
            });
    }

    function ycp_part(c, i, d, e) {
        get(`https://www.googleapis.com/youtube/v3/videos?id=${c}&key=${j.apikey}&part=contentDetails,snippet,statistics`)
            .then(a => {
                const b = a.items[0].contentDetails.duration;
                let menit, detik;
                if (b.includes('M')) {
                    const parts = b.split('M');
                    menit = parts[0].replace('PT', '');
                    detik = parts[1] ? parts[1].replace('S', '') : '00';
                } else {
                    menit = '00';
                    detik = b.split('PT')[1].replace('S', '');
                }
                detik = detik.length > 1 ? detik : `0${detik}`;
                const sel = `${e} .ycp div#ycp_youtube_channels${d}`;
                document.querySelector(`${sel} span.tm${i}`).innerHTML    = `${menit}:${detik}`;
                document.querySelector(`${sel} span.by${i}`).innerHTML    = `${a.items[0].snippet.channelTitle}`;
                document.querySelector(`${sel} span.views${i}`).innerHTML = `▷ ${addCommas(a.items[0].statistics.viewCount)}`;
                document.querySelector(`${sel} span.date${i}`).innerHTML  = _timeSince(new Date(a.items[0].snippet.publishedAt).getTime());
            });
    }

    function _timeSince(a) {
        const s = Math.floor((Date.now() - a) / 1000);
        let i;
        if ((i = Math.floor(s / 31536000)) > 1) return `${i} thn lalu`;
        if ((i = Math.floor(s / 2592000))  > 1) return `${i} bln lalu`;
        if ((i = Math.floor(s / 86400))    > 1) return `${i} h lalu`;
        if ((i = Math.floor(s / 3600))     > 1) return `${i} jam lalu`;
        if ((i = Math.floor(s / 60))       > 1) return `${i} mnt lalu`;
        return `${Math.floor(s)} dtk lalu`;
    }

    function addCommas(a) {
        return String(a).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    window.addEventListener("scroll", function() {
		play && (play = !1, ifPlay())
	}, {
		once: !0
	}), document.addEventListener("click", function() {
		play && (play = !1, ifPlay())
	}, {
		once: !0
	});

}