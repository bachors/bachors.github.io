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
						<svg class="flex-none w-10 h-10" width="40" height="40" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 512 512" xml:space="preserve">
                        <g>
                            <polygon style="fill:#C4C8F5;" points="411.826,272.696 478.609,272.696 478.609,239.304 411.826,239.304 411.826,205.913 
                                0,205.913 0,406.261 33.391,406.261 33.391,439.652 66.783,439.652 66.783,473.043 100.174,473.043 100.174,506.435 
                                311.652,506.435 311.652,473.043 345.043,473.043 345.043,439.652 378.435,439.652 378.435,406.261 411.826,406.261 
                                478.609,406.261 478.609,372.87 411.826,372.87 	"/>
                            <rect x="478.609" y="272.696" style="fill:#C4C8F5;" width="33.391" height="100.174"/>
                        </g>
                        <polygon points="411.826,272.696 478.609,272.696 478.609,239.304 411.826,239.304 411.826,205.913 378.435,205.913 33.391,205.913 
                            0,205.913 0,239.304 0,406.261 33.391,406.261 33.391,239.304 378.435,239.304 378.435,272.696 378.435,372.87 378.435,406.261 
                            411.826,406.261 478.609,406.261 478.609,372.87 411.826,372.87 "/>
                        <rect x="478.609" y="272.696" width="33.391" height="100.174"/>
                        <rect x="345.043" y="406.261" width="33.391" height="33.391"/>
                        <rect x="311.652" y="439.652" width="33.391" height="33.391"/>
                        <rect x="33.391" y="406.261" width="33.391" height="33.391"/>
                        <rect x="66.783" y="439.652" width="33.391" height="33.391"/>
                        <rect x="100.174" y="473.043" width="211.478" height="33.391"/>
                        <rect x="300.522" y="72.348" width="33.391" height="33.391"/>
                        <rect x="300.522" y="139.13" width="33.391" height="33.391"/>
                        <rect x="267.13" y="105.739" width="33.391" height="33.391"/>
                        <rect x="166.957" y="38.957" width="33.391" height="33.391"/>
                        <rect x="200.348" y="72.348" width="33.391" height="33.391"/>
                        <rect x="200.348" y="5.565" width="33.391" height="33.391"/>
                        <rect x="200.348" y="139.13" width="33.391" height="33.391"/>
                        <rect x="166.957" y="105.739" width="33.391" height="33.391"/>
                        <rect x="100.174" y="72.348" width="33.391" height="33.391"/>
                        <rect x="100.174" y="139.13" width="33.391" height="33.391"/>
                        <rect x="66.783" y="105.739" width="33.391" height="33.391"/>
                        <g>
                            <rect x="66.783" y="372.87" style="fill:#FFFFFF;" width="33.391" height="33.391"/>
                            <rect x="66.783" y="272.696" style="fill:#FFFFFF;" width="33.391" height="66.783"/>
                        </g>
                        </svg>
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