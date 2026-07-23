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
        el.innerHTML  = `<div class="ycp"><div class="belah ycp_vid_play" title="Play video"></div><div class="belah" id="ycp_youtube_channels${i}"></div></div>`;

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
                let d = '<div class="luhur">';
                d += `<div class="title">${h}</div>`;
                d += '<span class="tombol vid-prev" title="Previous videos">Prev</span> ';
                d += '<span class="tombol vid-next" title="Next videos">Next</span><span class="about" title="ycp.js"><a href="https://github.com/bachors/ycp.js" target="_BLANK">❤︎</a></span></div><div class="handap">';
                c.items.forEach((item, i) => {
                    if (item.status.privacyStatus === 'public') {
                        const b = item.snippet.resourceId.videoId;
                        ycp_part(b, i, k, l);
                        d += `<div class="play" data-vvv="${b}" data-img="${item.snippet.thumbnails.high.url}" title="${item.snippet.title}"><div class="thumb"><img src="${item.snippet.thumbnails.default.url}" alt=" "><span class="tm${i}"></span></div>`;
                        d += `<div class="meta"><div class="title">${item.snippet.title}</div><span class="mute by${i}"></span><span class="mute"><span class="views${i}"></span> • <span class="date${i}"></span></span></div></div>`;
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
                document.querySelector(`${sel} span.by${i}`).innerHTML    = `by ${a.items[0].snippet.channelTitle}`;
                document.querySelector(`${sel} span.views${i}`).innerHTML = `${addCommas(a.items[0].statistics.viewCount)} views`;
                document.querySelector(`${sel} span.date${i}`).innerHTML  = _timeSince(new Date(a.items[0].snippet.publishedAt).getTime());
            });
    }

    function _timeSince(a) {
        const s = Math.floor((Date.now() - a) / 1000);
        let i;
        if ((i = Math.floor(s / 31536000)) > 1) return `${i} years ago`;
        if ((i = Math.floor(s / 2592000))  > 1) return `${i} months ago`;
        if ((i = Math.floor(s / 86400))    > 1) return `${i} days ago`;
        if ((i = Math.floor(s / 3600))     > 1) return `${i} hours ago`;
        if ((i = Math.floor(s / 60))       > 1) return `${i} minutes ago`;
        return `${Math.floor(s)} seconds ago`;
    }

    function addCommas(a) {
        return String(a).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}