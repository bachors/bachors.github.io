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

    const els = selector.startsWith('#')
        ? [document.querySelector(selector)]
        : [...document.querySelectorAll(selector)];

    els.forEach((el, i) => {
        const b = el.id ? `#${el.id}` : `.${el.className.split(' ')[0]}`;
        const title   = el.dataset.ycp_title   || 'ycp.js';
        const channel = el.dataset.ycp_channel;
        el.innerHTML  = `<div class="ycp"><div class="belah ycp_vid_play bg-white dark:bg-[#1e1f21] rounded-t-xl overflow-hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]" title="Play video"></div><div class="belah grid grid-cols-1 gap-1" id="ycp_youtube_channels${i}"></div></div>`;

        if (channel.substring(0, 2) === 'PL' || channel.substring(0, 2) === 'UU') {
            ycp_list(title, channel, '', i, b);
        } else {
            const d = channel.substring(0, 2) === 'UC' ? 'id' : 'forUsername';
            ycp_play(title, channel, d, i, b);
        }
    });

    function get(url) {
        return fetch(url).then(r => r.json());
    }

    function ycp_play(g, c, d, e, f) {
        get(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&${d}=${c}&key=${j.apikey}`)
            .then(a => {
                const b = a.items[0].contentDetails.relatedPlaylists.uploads;
                ycp_list(g, b, '', e, f);
            });
    }

    function ycp_list(h, f, g, k, l) {
        get(`https://www.googleapis.com/youtube/v3/playlistItems?part=status,snippet&maxResults=${j.playlist}&playlistId=${f}&key=${j.apikey}&pageToken=${g}`)
            .then(c => {
                let d = '<div class="luhur p-4 bg-white dark:bg-[#1e1f21] rounded-b-xl shadow-xl">';
                d += `
					<div class="flex items-center gap-4 border-b border-gray-200 dark:border-blue-100/10 pb-4 mb-4">
						<svg class="flex-none w-10 h-10" width="40" height="40" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                            <path d="m435.57 444.12h-359.15c-37.781 0-68.409-30.628-68.409-68.409v-239.43c0-37.781 30.628-68.409 68.409-68.409h359.15c37.781 0 68.409 30.628 68.409 68.409v239.43c0 37.781-30.628 68.409-68.409 68.409z" fill="#E35336"/>
                            <path d="m469.78 409.92h-376.25c-28.336 0-51.307-22.971-51.307-51.307v-256.54c0-10.036 2.178-19.558 6.061-28.144-23.738 10.733-40.265 34.604-40.265 62.349v239.43c0 37.781 30.628 68.409 68.409 68.409h359.15c27.745 0 51.616-16.527 62.349-40.265-8.587 3.882-18.108 6.061-28.144 6.061z" fill="#D93C1C"/>
                            <polygon points="358.61 256 187.59 367.16 187.59 144.84" fill="#fff"/>
                            <polygon points="213.24 161.51 187.59 144.84 187.59 367.16 213.24 350.49" fill="#E5E5E5"/>
                            <path d="m435.57 59.858h-359.15c-42.141 0-76.426 34.285-76.426 76.426v171.02c0 4.427 3.589 8.017 8.017 8.017s8.017-3.589 8.017-8.017v-171.02c0-33.3 27.092-60.392 60.392-60.392h359.15c33.3 0 60.392 27.092 60.392 60.392v239.43c0 33.3-27.092 60.392-60.392 60.392h-359.15c-33.3 0-60.392-27.092-60.392-60.392v-34.205c0-4.427-3.589-8.017-8.017-8.017s-8.017 3.59-8.017 8.017v34.205c0 42.141 34.285 76.426 76.426 76.426h359.15c42.141 0 76.426-34.285 76.426-76.426v-239.43c0-42.141-34.285-76.426-76.426-76.426z"/>
                            <path d="m294.39 223.81c3.711 2.411 8.678 1.359 11.09-2.353 2.414-3.712 1.36-8.677-2.353-11.091l-111.16-72.256c-5.24-3.407-12.384 0.491-12.384 6.721v222.33c0 6.226 7.142 10.131 12.385 6.721l171.02-111.16c4.779-3.106 4.778-10.336 0-13.443l-34.205-22.233c-3.712-2.412-8.677-1.359-11.091 2.353-2.412 3.712-1.36 8.677 2.353 11.091l23.864 15.511-148.3 96.394v-192.79l98.779 64.206z"/>
                        </svg>
						<div class="flex flex-col items-start w-full">
							<h3 class="text-lg font-medium">YouTube</h3>
							<p class="text-gray-400">${h}</p>
						</div>
					</div>`;
                d += '<span class="tombol text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 vid-prev mr-2" title="Sebelumnya"><i class="fa fa-backward-step"></i></span> ';
                d += '<span class="tombol text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 vid-next" title="Berikutnya"><i class="fa fa-forward-step"></i></span><span class="about text-xs text-gray-400 mt-1" title="ycp.js"><a href="https://bachors.id/ycp.js" target="_BLANK"><i class="fa fa-code-fork"></i></a></span></div><div class="handap bg-white dark:bg-[#1e1f21] rounded-xl shadow-xl">';
                c.items.forEach((item, i) => {
                    if (item.status.privacyStatus === 'public') {
                        const b = item.snippet.resourceId.videoId;
                        ycp_part(b, i, k, l);
                        d += `<div class="play hover:bg-gray-100 dark:hover:bg-white/5 p-4 border-b border-gray-200 dark:border-blue-100/10 gap-3 overflow-hidden" data-vvv="${b}" data-img="${item.snippet.thumbnails.high.url}" title="${item.snippet.title}"><div class="thumb rounded-lg overflow-hidden hover:-rotate-3"><img src="${item.snippet.thumbnails.default.url}" alt=" "><span class="rounded-md tm${i}"></span></div>`;
                        d += `<div class="meta"><div class="title text-sm font-medium block">${item.snippet.title}</div><span class="text-xs text-gray-400 block by${i}"></span><span class="text-xs text-gray-400 block"><span class="views${i}"></span> • <span class="date${i}"></span></span></div></div>`;
                    }
                });
                d += '</div>';

                const container = document.querySelector(`${l} .ycp div#ycp_youtube_channels${k}`);
                container.innerHTML = d;

                const vidPlay = document.querySelectorAll(`${l} .ycp div.ycp_vid_play`)[k];

                function setPlayer(videoId, imgUrl) {
                    if (!j.autoplay) {
                        vidPlay.innerHTML = '<a href="#"></a>';
                        vidPlay.style.cssText = `background:url(${imgUrl}) no-repeat center/cover`;
                    } else {
                        vidPlay.innerHTML = `<iframe src="//www.youtube.com/embed/${videoId}?rel=${j.related ? 1 : 0}&amp;autoplay=1" allowfullscreen="" frameborder="0" class="bingkay"></iframe>`;
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
                        ycp_list(h, f, c.prevPageToken, k, l);
                    });
                }

                container.querySelector('span.vid-next').addEventListener('click', e => {
                    e.preventDefault();
                    ycp_list(h, f, c.nextPageToken, k, l);
                });

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
                    vidPlay.innerHTML = `<iframe src="//www.youtube.com/embed/${active.dataset.vvv}?rel=${j.related ? 1 : 0}&amp;autoplay=1" allowfullscreen="" frameborder="0" class="bingkay"></iframe>`;
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
}