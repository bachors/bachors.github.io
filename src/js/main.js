// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
// Check for saved user preference or use system preference
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.classList.add(savedTheme);
// Update icon based on current theme
updateThemeIcon();
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (html.classList.contains('dark')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}
// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        }
    });
});
// Highlight active navigation link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
});

// Get all the img elements in the grid
var images = document.querySelectorAll('.grid img');

// Loop through each img element
images.forEach(function(img) {

    // Add a click event listener to each img element
    img.addEventListener('click', function() {
        showModal(img.src);
    });
});

// Get the modal by id
var modal = document.getElementById("modal");

// Get the modal image tag
var modalImg = document.getElementById("modal-img");

// This function is called when a small image is clicked
function showModal(src) {
    modal.classList.remove('hidden');
    modalImg.src = src;
}

// This function is called when the close button is clicked
function closeModal() {
    modal.classList.add('hidden');
}

$.fn.ycp=function(e){const t=10,a=!1,s=!1;function i(t,a,s,l,c){$.ajax({url:`https://www.googleapis.com/youtube/v3/playlistItems?part=status,snippet&maxResults=${e.playlist}&playlistId=${a}&key=${e.apikey}&pageToken=${s}`,dataType:"json"}).done((p=>{let n="";if(n+='<div class="luhur">',n+=`<div class="title">${t}</div>`,n+='<span class="tombol vid-prev" title="Previous videos">Prev</span> ',n+='<span class="tombol vid-next" title="Next videos">Next</span><span class="about" title="ycp.js"><a href="https://github.com/bachors/jQuery-Youtube-Channels-Playlist" target="_BLANK">♥</a></span></div><div class="handap">',$.each(p.items,((t,a)=>{if("public"==p.items[t].status.privacyStatus){const a=p.items[t].snippet.resourceId.videoId;!function(t,a,s,i){$.ajax({url:`https://www.googleapis.com/youtube/v3/videos?id=${t}&key=${e.apikey}&part=contentDetails,snippet,statistics`,dataType:"json"}).done((e=>{const t=e.items[0].contentDetails.duration;let l="",c="",p="";t.match(/M/g)?(l=t.split("M"),c=l[0].replace("PT",""),p=""!=l[1]?l[1].replace("S",""):"00"):(l=t.split("PT"),c="00",p=l[1].replace("S","")),p=p.length>1?p:`0${p}`,$(`${i} .ycp div#ycp_youtube_channels${s} span.tm${a}`).html(`${c}:${p}`),$(`${i} .ycp div#ycp_youtube_channels${s} span.by${a}`).html(`by ${e.items[0].snippet.channelTitle}`),$(`${i} .ycp div#ycp_youtube_channels${s} span.views${a}`).html(`${function(e){e+="",x=e.split("."),x1=x[0],x2=x.length>1?`.${x[1]}`:"";const t=/(\d+)(\d{3})/;for(;t.test(x1);)x1=x1.replace(t,"$1,$2");return x1+x2}(e.items[0].statistics.viewCount)} views`),$(`${i} .ycp div#ycp_youtube_channels${s} span.date${a}`).html(function(e){const t=Math.floor((new Date-e)/1e3);let a=Math.floor(t/31536e3);if(a>1)return`${a} years ago`;if(a=Math.floor(t/2592e3),a>1)return`${a} months ago`;if(a=Math.floor(t/86400),a>1)return`${a} days ago`;if(a=Math.floor(t/3600),a>1)return`${a} hours ago`;if(a=Math.floor(t/60),a>1)return`${a} minutes ago`;return`${Math.floor(t)} seconds ago`}(new Date(e.items[0].snippet.publishedAt).getTime()))}))}(a,t,l,c),n+=`<div class="play" data-vvv="${a}" data-img="${p.items[t].snippet.thumbnails.high.url}" title="${p.items[t].snippet.title}"><div class="thumb"><img src="${p.items[t].snippet.thumbnails.default.url}" alt=" "><span class="tm${t}"></span></div>`,n+=`<div class="title">${p.items[t].snippet.title}</div><span class="mute by${t}"></span><br><span class="mute views${t}"></span> <span class="mute">-</span> <span class="mute date${t}"></span></div>`}})),n+="</div>",$(`${c} .ycp div#ycp_youtube_channels${l}`).html(n),null==p.prevPageToken||null==p.prevPageToken){const t=$(`${c} .ycp div#ycp_youtube_channels${l} div.play`).attr("data-vvv"),a=$(`${c} .ycp div#ycp_youtube_channels${l} div.play`).attr("data-img");0==e.autoplay?($(`${c} .ycp div.ycp_vid_play:eq(${l})`).html('<a href="#"></a>'),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("background",`url(${a}) no-repeat`),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("-webkit-background-size","cover"),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("-moz-background-size","cover"),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("-o-background-size","cover"),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("background-size","cover")):$(`${c} .ycp div.ycp_vid_play:eq(${l})`).html(`<iframe src="//www.youtube.com/embed/${t}?rel=${e.related?1:0}&amp;autoplay=1" allowfullscreen="" frameborder="0" class="bingkay"></iframe>`),$(`${c} .ycp div#ycp_youtube_channels${l} div`).removeClass("vid-active"),$(`${c} .ycp div#ycp_youtube_channels${l} div.play:eq(0)`).addClass("vid-active")}else $(`${c} .ycp div#ycp_youtube_channels${l} span.vid-prev`).click((()=>(s=p.prevPageToken,i(t,a,s,l,c),!1)));$(`${c} .ycp div#ycp_youtube_channels${l} span.vid-next`).click((()=>(s=p.nextPageToken,i(t,a,s,l,c),!1))),$(`${c} .ycp div#ycp_youtube_channels${l} div.play`).each((function(){$(this).click((function(){const t=$(this).attr("data-vvv"),a=$(this).attr("data-img");return $(`${c} .ycp div#ycp_youtube_channels${l} div`).removeClass("vid-active"),$(this).addClass("vid-active"),0==e.autoplay?($(`${c} .ycp div.ycp_vid_play:eq(${l})`).html('<a href="#"></a>'),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("background",`url(${a}) no-repeat`),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("-webkit-background-size","cover"),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("-moz-background-size","cover"),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("-o-background-size","cover"),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).css("background-size","cover")):$(`${c} .ycp div.ycp_vid_play:eq(${l})`).html(`<iframe src="//www.youtube.com/embed/${t}?rel=${e.related?1:0}&amp;autoplay=1" allowfullscreen="" frameborder="0" class="bingkay"></iframe>`),!1}))})),$(`${c} .ycp div.ycp_vid_play:eq(${l})`).click((function(){const t=$(`${c} .ycp div#ycp_youtube_channels${l} div.play.vid-active`).attr("data-vvv");return $(this).html(`<iframe src="//www.youtube.com/embed/${t}?rel=${e.related?1:0}&amp;autoplay=1" allowfullscreen="" frameborder="0" class="bingkay"></iframe>`),!1}))}))}e.playlist=null==e.playlist?t:e.playlist,e.autoplay=null==e.autoplay?a:e.autoplay,e.related=null==e.related?s:e.related,$(this).each((function(t,a){const s=null!=$(this).attr("id")&&null!=$(this).attr("id")?`#${$(this).attr("id")}`:`.${$(this).attr("class")}`,l=null==$(this).data("ycp_title")?"YCP.js":$(this).data("ycp_title"),c=$(this).data("ycp_channel"),p=`<div class="ycp"><div class="belah ycp_vid_play" title="Play video"></div><div class="belah" id="ycp_youtube_channels${t}"></div></div>`;if($(this).html(p),"PL"==c.substring(0,2)||"UU"==c.substring(0,2)){i(l,c,"",t,s)}else{const a="UC"==c.substring(0,2)?"id":"forUsername";!function(t,a,s,l,c){$.ajax({url:`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&${s}=${a}&key=${e.apikey}`,crossDomain:!0,dataType:"json"}).done((e=>{const a=e.items[0].contentDetails.relatedPlaylists.uploads;i(t,a,"",l,c)}))}(l,c,a,t,s)}}))};
		
$(function() {

    $("#unix").ycp({
        apikey: "AIzaSyA0XdFjyX0c5pTAxNCIEPSnuGQ-cL2PLE0",
        playlist: 7,
        autoplay: true,
        related: true
    });

});