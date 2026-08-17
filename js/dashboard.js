const LABELS = {
	today: {
		a: "Hari ini",
		b: "Sepanjang hari ini"
	},
	yesterday: {
		a: "Kemarin",
		b: "Hari kemarin"
	},
	seven_day: {
		a: "7 hari",
		b: "Selama 7 hari terakhir"
	},
	twentyeight_day: {
		a: "28 hari",
		b: "Selama 28 hari terakhir"
	},
	this_month: {
		a: "Bulan ini",
		b: "Selama bulan ini"
	},
	last_month: {
		a: "Bulan lalu",
		b: "Bulan lalu"
	},
	all_time: {
		a: "Semua waktu",
		b: "Semua waktu"
	}
},
ICONS = {
	peristiwa: {
		a: `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>.kls-1{fill:none;stroke:currentColor;stroke-miterlimit:10;stroke-width:1.85px;}</style></defs><path class="kls-1" d="M11.37,12.73,7.44,8.8a1.86,1.86,0,0,0-2.73.12,1.93,1.93,0,0,0,.19,2.57l5.82,5.82H8.91a2,2,0,0,0-1.39.58A2,2,0,0,0,7,19.27a2,2,0,0,0,2,2h7"/><path class="kls-1" d="M11.37,12.73,7.44,8.8l-.58-.58a1.93,1.93,0,0,1-.35-2.33,1.86,1.86,0,0,1,2.9-.36l4.3,4.3,2.33-2A1.74,1.74,0,0,1,18.4,8h0a16.84,16.84,0,0,1,4,6.54l.06.18"/><path class="kls-1" d="M7.82,14.42a4.42,4.42,0,0,1-1.69.32A4.62,4.62,0,0,1,3.5,6.31a4.63,4.63,0,0,1,9.23.53,4.41,4.41,0,0,1-.32,1.68" stroke="currentColor"/></svg>`,
		b: `<svg class="flex-none w-full mt-auto text-blue-500 dark:text-blue-400" viewBox="0 0 145 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 35.9933C0.560537 33.6796 1.68615 31.6473 3.26892 29.5403C6.01928 25.8791 9.2514 22.3461 13.9141 19.5898C14.7049 19.1223 16.84 17.4956 17.9791 18.4285C20.0522 20.1264 20.8043 22.5656 22.2456 24.492C22.5352 24.879 22.6303 25.6265 23.2858 25.5907C23.7454 25.5656 23.6179 25.0268 23.774 24.7424C24.6811 23.0891 26.3208 21.4779 28.4863 20.4172C29.7966 19.7755 32.917 18.2331 34.5784 19.0821C36.4977 20.063 36.9999 21.6776 37.72 23.1013C38.0592 23.7721 38.5742 24.4172 38.9723 25.0761C39.279 25.5837 39.4286 25.6628 39.9806 25.1735C41.796 23.5643 44.9701 22.0366 47.7178 23.755C48.488 24.2367 48.9709 24.7289 50.0527 24.2834C51.1253 23.8417 51.2652 24.1739 51.7296 24.9023C52.2494 25.7175 52.9022 28.1075 54.5634 26.891C54.7966 26.7202 56.6838 25.072 57.1 25.2152C58.1823 25.5875 58.7779 27.0135 59.1802 27.6907C59.403 28.0657 60.1313 29.8287 60.8571 29.9645C60.9069 29.9738 62.5642 25.9782 63.0435 25.5073C63.6813 24.8804 64.4185 24.2857 65.1237 23.6924C65.34 23.5104 66.3235 22.4855 66.8643 22.3781C66.9505 22.361 67.0893 22.5931 67.1615 22.6146C67.3598 22.6736 67.4413 22.3881 67.5117 22.253C67.7699 21.7576 68.2817 20.5396 68.4457 20.16C69.5291 17.651 70.591 15.1805 72.691 12.9421C73.7644 11.7981 75.5041 10.4654 77.5838 10.0703C79.2454 9.75459 80.9653 11.4363 81.6593 12.1703C82.5062 13.0658 83.2608 14.1834 84.3551 14.9656C85.4969 15.7817 85.493 17.3581 86.2868 18.3312C86.3917 18.4598 87.6371 19.5063 87.6877 19.2629C87.8964 18.2603 88.4845 17.4151 89.7892 16.8222C91.5844 16.0065 92.0692 17.5338 92.9732 18.3729C94.0539 19.3759 94.3624 18.828 95.5947 18.06C95.9984 17.8084 98.7248 15.8087 99.2669 16.5649C100.296 17.9999 99.8895 19.8338 101.103 21.2099C101.335 21.4727 101.61 21.8289 101.888 22.0722C102.034 22.1993 102.016 21.6224 102.016 21.5437C102.016 21.1487 102.494 21.8699 102.515 21.8983C102.933 22.4705 103.353 23.0698 103.353 23.7132C103.353 23.8434 103.259 23.4184 103.396 23.3238C104.144 22.8043 106.353 25.0098 106.558 25.3404C106.883 25.8636 107.539 27.1967 108.66 27.2457C109.15 27.2671 109.627 26.07 109.679 25.9801C110.639 24.3163 111.383 22.6116 112.268 20.9318C113.119 19.3175 114.274 17.9306 115.601 16.4815C116.123 15.9111 116.225 16.8398 116.344 17.156C116.459 17.463 116.689 18.5072 117.044 17.6845C118.236 14.9249 119.086 12.1108 120.165 9.33321C120.383 8.77079 120.633 8.21143 120.897 7.65739C121.055 7.32601 121.332 7.80013 121.46 7.95639C123.197 10.0875 124.085 12.4606 125.811 14.5971C126.443 15.3796 126.251 15.112 126.405 14.3746C126.745 12.7575 127.12 10.974 127.955 9.43056C128.34 8.7188 129.301 10.3947 129.377 10.5014C130.021 11.4015 130.617 12.3139 131.309 13.1994C131.416 13.3367 132.36 14.8051 132.837 14.8335C132.879 14.836 133.765 12.4317 133.845 12.2676C134.508 10.9081 135.602 10.0069 136.764 8.84645C136.971 8.63969 137.152 8.23277 137.486 8.08156C137.956 7.86809 138.262 7.8529 138.558 7.49746C138.825 7.17664 141.705 3.51325 142.177 3.60344C142.515 3.66807 142.432 3.79463 142.559 3.95112C142.695 4.1195 143.164 4.17727 143.376 4.32662C144.149 4.87168 145 4.98058 145 5.82859" stroke="currentColor" stroke-linecap="round" stroke-width="2"></path></svg>`
	},
	pendapatan: {
		a: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.2929 1.29289C14.6834 0.902369 15.3166 0.902369 15.7071 1.29289L23.7071 9.29289C24.0976 9.68342 24.0976 10.3166 23.7071 10.7071L18 16.4142V19C18 20.6569 16.6569 22 15 22H5C2.23858 22 0 19.7614 0 17V8C0 5.79086 1.79086 4 4 4H11.5858L14.2929 1.29289ZM9.58579 6H4C2.89543 6 2 6.89543 2 8V17C2 18.6569 3.34315 20 5 20H15C15.5523 20 16 19.5523 16 19V16.0007C16 16.0002 16 15.9998 16 15.9993V11C16 10.4477 15.5523 10 15 10H8.00069C8.00023 10 7.99977 10 7.99931 10H5C3.89543 10 3 9.10457 3 8V7.5C3 6.94772 3.44772 6.5 4 6.5C4.55228 6.5 5 6.94772 5 7.5V8H7.58579L9.58579 6ZM10.4142 8H15C16.6569 8 18 9.34315 18 11V13.5858L21.5858 10L15 3.41421L12.7071 5.70711L10.4142 8Z" fill="currentColor"/></svg>`,
		b: `<svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-full mt-auto text-blue-500 dark:text-blue-400" viewBox="0 0 64 24" fill="none"><path d="M1 14.4262C2.27408 15.0035 2.86194 15.849 3.73916 15.054C3.94645 14.8661 4.22471 14.3927 4.50431 14.4631C6.47518 14.9593 8.17527 14.4077 9.92829 15.2632C10.4517 15.5187 10.5304 14.5962 10.9425 14.0569C11.0629 13.8992 11.1821 13.7255 11.3907 13.6834C11.6467 13.6319 11.866 13.6184 12.1377 13.6055C14.1658 13.5087 17.4209 13.9502 18.1141 13.9502C18.1473 13.9502 18.1141 13.89 18.1141 13.8599C18.1141 11.5408 20.6245 12.8051 21.3377 14.0979C21.3711 14.1585 21.6032 14.6474 21.718 14.5C21.9474 14.2054 22.387 13.9776 22.6823 13.7573C23.5864 13.0829 24.5502 12.4183 25.0185 11.4594C25.4672 10.5408 27.4715 10.2201 27.6219 10.1053C28.0228 9.79935 28.2797 9.34009 28.6858 9.02615C29.1233 8.68795 29.2817 9.57005 29.365 9.80989C30.2421 12.335 29.5931 12.2105 31.6785 10.9301C32.1906 10.6157 35.8391 14.2258 36.3147 14.7955C36.4359 14.9405 36.2877 14.6625 36.3419 14.4344C36.6317 13.2157 37.9875 12.6263 38.2887 11.3815C38.3131 11.281 38.4656 9.92685 38.5876 9.93299C38.9643 9.95196 39.424 11.7589 39.7285 11.3199C40.8168 9.75068 41.6785 8.28347 43.93 10.052C44.0965 10.1827 46.1396 7.37418 46.6737 8.07828C46.8028 8.24839 47.8523 7.07084 48.1271 6.91703C50.2766 5.71376 52.3351 4.23344 53.0757 4.23344C54.914 4.23344 55.6212 9.27412 59.052 4.29909C60.6329 2.0066 60.3677 2.8416 63 1" stroke="currentColor" stroke-width="0.96" stroke-linecap="round"></path></svg>`
	},
	tayangan: {
		a: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 15V11C7 9.89543 7.89543 9 9 9V9C10.1046 9 11 9.89543 11 11V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 9V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 12H15.5C13.5 12 13.5 15 15.5 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 13H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
		b: `<svg class="flex-none w-full text-blue-500 dark:text-blue-400" viewBox="0 0 81 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 33.3915C1.3054 31.0778 1.91866 29.0455 2.781 26.9385C4.27947 23.2773 6.04042 19.7442 8.58081 16.9879C9.01161 16.5205 10.1749 14.8938 10.7955 15.8267C11.925 17.5245 12.3347 19.9638 13.12 21.8902C13.2778 22.2772 13.3296 23.0247 13.6867 22.9889C13.9372 22.9638 13.8677 22.425 13.9527 22.1406C14.4469 20.4872 15.3403 18.8761 16.5201 17.8154C17.234 17.1737 18.9341 15.6313 19.8393 16.4803C20.8849 17.4611 21.1586 19.0758 21.5509 20.4995C21.7357 21.1703 22.0163 21.8154 22.2332 22.4743C22.4003 22.9819 22.4818 23.061 22.7825 22.5717C23.7716 20.9625 25.5009 19.4348 26.9979 21.1532C27.4176 21.6349 27.6807 22.1271 28.2701 21.6816C28.8545 21.2399 28.9307 21.5721 29.1837 22.3005C29.4669 23.1157 29.8226 25.5056 30.7276 24.2892C30.8547 24.1184 31.8829 22.4702 32.1096 22.6134C32.6993 22.9857 33.0238 24.4117 33.243 25.0889C33.3644 25.4639 33.7612 27.2269 34.1566 27.3627C34.1838 27.372 35.0867 23.3764 35.3478 22.9055C35.6953 22.2786 36.097 21.6839 36.4812 21.0906C36.5991 20.9086 37.1348 19.8837 37.4295 19.7763C37.4765 19.7592 37.5521 19.9913 37.5914 20.0128C37.6995 20.0718 37.7439 19.7863 37.7822 19.6512C37.9229 19.1558 38.2018 17.9378 38.2911 17.5581C38.8814 15.0492 39.4599 12.5787 40.6041 10.3403C41.1889 9.19628 42.1367 7.86363 43.2698 7.46848C44.1751 7.15279 45.1121 8.83453 45.4903 9.56847C45.9517 10.464 46.3628 11.5816 46.959 12.3638C47.5811 13.1799 47.5789 14.7563 48.0114 15.7293C48.0686 15.858 48.7471 16.9045 48.7747 16.6611C48.8884 15.6585 49.2088 14.8133 49.9196 14.2204C50.8977 13.4047 51.1618 14.932 51.6544 15.7711C52.2431 16.7741 52.4112 16.2262 53.0826 15.4582C53.3026 15.2066 54.788 13.2069 55.0834 13.9631C55.6438 15.3981 55.4226 17.232 56.0837 18.6081C56.21 18.8709 56.3599 19.2271 56.5116 19.4704C56.5909 19.5975 56.581 19.0206 56.581 18.9419C56.581 18.5469 56.8415 19.2681 56.8528 19.2965C57.0808 19.8687 57.3096 20.468 57.3096 21.1114C57.3096 21.2416 57.2584 20.8166 57.3327 20.722C57.7408 20.2025 58.9442 22.408 59.0559 22.7386C59.2327 23.2618 59.5903 24.5949 60.2008 24.6439C60.468 24.6653 60.7277 23.4682 60.756 23.3783C61.2789 21.7144 61.6845 20.0098 62.1669 18.33C62.6305 16.7157 63.2596 15.3288 63.9826 13.8797C64.2672 13.3093 64.3228 14.238 64.3873 14.5542C64.45 14.8612 64.5754 15.9054 64.769 15.0827C65.4185 12.3231 65.8814 9.50902 66.469 6.7314C66.588 6.16898 66.724 5.60962 66.868 5.05558C66.9541 4.7242 67.1051 5.19833 67.1745 5.35459C68.1211 7.48573 68.6047 9.85884 69.5453 11.9953C69.8898 12.7778 69.7848 12.5102 69.8691 11.7728C70.054 10.1557 70.2585 8.37219 70.7134 6.82875C70.9231 6.117 71.4466 7.79287 71.4882 7.8996C71.8392 8.79971 72.1635 9.71214 72.5406 10.5976C72.5991 10.7348 73.1136 12.2033 73.3733 12.2317C73.3963 12.2342 73.879 9.82987 73.9226 9.66582C74.2839 8.3063 74.8798 7.40512 75.5128 6.24465C75.6256 6.03789 75.7244 5.63097 75.906 5.47975C76.1624 5.26628 76.3288 5.2511 76.49 4.89565C76.6356 4.57484 78.2047 0.911443 78.4619 1.00164C78.6461 1.06626 78.6011 1.19283 78.67 1.34932C78.7442 1.51769 79 1.57546 79.1153 1.72481C79.5362 2.26987 80 2.37877 80 3.22679" stroke="currentColor" stroke-linecap="round" stroke-width="1.1"></path></svg>`
	},
	ecpm: {
		a: `<svg width="16" height="16" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="Layer_2" data-name="Layer 2"><g id="invisible_box" data-name="invisible box"><rect width="48" height="48" fill="none"/></g><g id="icons_Q2" data-name="icons Q2"><g><path d="M26,19.4V14a2,2,0,0,0-4,0v5.4A5.1,5.1,0,0,0,19,24a5,5,0,0,0,10,0A5.1,5.1,0,0,0,26,19.4Z"/><path d="M24,2A22.1,22.1,0,0,0,2,24,21.6,21.6,0,0,0,8.3,39.4a1.9,1.9,0,0,0,2.8,0h0l3-3a2,2,0,0,0-2.8-2.8L9.8,35.1A19.2,19.2,0,0,1,6.1,26H8a2,2,0,0,0,0-4H6.1a18.5,18.5,0,0,1,3.8-9.2h0l1.4,1.3a1.9,1.9,0,0,0,2.8,0,1.9,1.9,0,0,0,0-2.8L12.8,9.9h0A18.5,18.5,0,0,1,22,6.1h0V8a2,2,0,0,0,4,0V6.1h0a18.5,18.5,0,0,1,9.2,3.8h0l-1.3,1.4a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0l1.4-1.3h0A18.5,18.5,0,0,1,41.9,22H40a2,2,0,0,0,0,4h1.9a19.2,19.2,0,0,1-3.7,9.1l-1.5-1.5a2,2,0,1,0-2.8,2.8L37,39.5a2,2,0,0,0,2.7-.1A21.6,21.6,0,0,0,46,24,22.1,22.1,0,0,0,24,2Z"/></g></g></g></svg>`,
		b: `<svg class="flex-none w-full mt-auto text-blue-500 dark:text-blue-400" viewBox="0 0 57 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.500122 17.9182C0.957196 17.0165 2.22019 15.7164 3.5 16.0771C5.09976 16.528 5.64221 17.9182 6.55636 15.8142C9.25324 9.60692 10.314 16.1023 14.0981 12.2073C18.6775 7.49359 18.5598 -0.941537 20.5 1.46309C26.1456 8.46015 23.3474 9.71093 24.605 12.8724C25.4284 14.9424 28.4025 4.59507 29.3153 6.1957C30.0009 7.39801 32.7338 12.8724 34.105 12.8724C35.4762 12.8724 35.1195 13.6606 36.605 11.8571C38.0905 10.0537 40.6573 11.3055 41.0001 12.2073C41.3429 13.109 43.7338 15.6115 45.105 13.3571C46.202 11.5537 49.2909 14.5241 49.7098 16.0771C51.4641 15.308 52.3075 9.71362 53 12.9925C54.0665 11.9405 55.9285 17.2646 56.4999 13.3571" stroke="currentColor" stroke-linecap="round" stroke-width="0.8"></path></svg>`
	},
	dirilis: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" d="M28 5.25h-1.25v-3.25c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 3.25h-18.5v-3.25c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 3.25h-1.25c-1.518 0.002-2.748 1.232-2.75 2.75v19.998c0.002 1.518 1.232 2.748 2.75 2.75h24c1.518-0.002 2.748-1.232 2.75-2.75v-19.998c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM4 6.75h24c0.69 0.001 1.249 0.56 1.25 1.25v3.25h-26.5v-3.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM28 29.248h-24c-0.69-0.001-1.249-0.56-1.25-1.25v-15.248h26.5v15.248c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM19.939 17.020l-6.211 6.788-1.693-1.681c-0.136-0.135-0.323-0.219-0.53-0.219-0.415 0-0.751 0.336-0.751 0.751 0 0.209 0.086 0.399 0.224 0.535l0 0 2.247 2.23 0.016 0.007 0.006 0.013c0.13 0.122 0.306 0.197 0.499 0.197 0.199 0 0.38-0.080 0.512-0.21l-0 0 0.027-0.011 0.005-0.011 0.017-0.012 6.737-7.365c0.122-0.133 0.197-0.311 0.197-0.506 0-0.414-0.335-0.749-0.749-0.749-0.219 0-0.415 0.094-0.552 0.243l-0 0.001z"></path></svg>`,
	kategori: `<svg width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="var(--ci-primary-color, currentColor)" d="M511.974,271.891a47.744,47.744,0,0,0-14.706-33.008L311.57,57.98a29.9,29.9,0,0,0-21.2-8.731H257.228l217.754,212.6.092.088a15.907,15.907,0,0,1,.741,22.337l-156.4,173.355,21.953,21.356L499.447,305.85A47.748,47.748,0,0,0,511.974,271.891Z" class="ci-primary"/><path fill="var(--ci-primary-color, currentColor)" d="M426.9,283.161a23.924,23.924,0,0,0-5.231-24.742c-.106-.111-.2-.231-.306-.34L224.307,57.716l-.094-.094a31.791,31.791,0,0,0-22.628-9.373H60.194A44.244,44.244,0,0,0,16,92.443v141.1a32.121,32.121,0,0,0,10.045,23.28l210.32,200.2.077.073a23.817,23.817,0,0,0,16.409,6.508q.447,0,.9-.017a24.111,24.111,0,0,0,6.741-1.217,23.854,23.854,0,0,0,10.047-6.517L421.983,291.232A24.033,24.033,0,0,0,426.9,283.161ZM252.5,428.2,48.077,233.612,48,233.54V92.443A12.208,12.208,0,0,1,60.194,80.249h141.39l191.7,194.918Z" class="ci-primary"/><path fill="var(--ci-primary-color, currentColor)" d="M140,112a52,52,0,1,0,52,52A52.059,52.059,0,0,0,140,112Zm0,72a20,20,0,1,1,20-20A20.023,20.023,0,0,1,140,184Z" class="ci-primary"/></svg>`,
	rating: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" d="M25 2C12.309295 2 2 12.309295 2 25C2 37.690705 12.309295 48 25 48C37.690705 48 48 37.690705 48 25C48 12.309295 37.690705 2 25 2 z M 25 4C36.609824 4 46 13.390176 46 25C46 36.609824 36.609824 46 25 46C13.390176 46 4 36.609824 4 25C4 13.390176 13.390176 4 25 4 z M 24.828125 17C21.234125 17 20.208984 19.567484 20.208984 21.021484C20.208984 22.989484 21.749594 24.014484 22.433594 24.271484C21.577594 24.613484 19.695312 25.555031 19.695312 28.207031C19.695312 30.431031 21.064937 32.998047 25.085938 32.998047C26.625937 32.998047 30.304688 32.228031 30.304688 28.207031C30.304688 25.469031 28.421469 24.528484 27.480469 24.271484C28.079469 24.015484 29.619141 22.989484 29.619141 21.021484C29.619141 20.251484 29.363125 17 24.828125 17 z M 15.5 17.25C15.072 19.648 13.399 20.113219 11 20.199219L11 21.740234L15 21.75L15 32.75L17 32.75L17 17.25L15.5 17.25 z M 24.914062 18.710938C27.224062 18.710938 27.566406 20.337422 27.566406 21.107422C27.566406 21.963422 27.139 23.673828 25 23.673828C22.348 23.673828 22.176734 21.535422 22.177734 21.107422C22.177734 20.764422 22.347062 18.710938 24.914062 18.710938 z M 36 21L36 24L33 24L33 26L36 26L36 29L38 29L38 26L41 26L41 24L38 24L38 21L36 21 z M 25 25.298828C27.567 25.298828 28.251953 27.610922 28.251953 28.294922C28.251953 29.748922 27.139 31.373047 25 31.373047C23.374 31.373047 21.662109 30.519922 21.662109 28.294922C21.662109 27.010922 22.519 25.298828 25 25.298828 z"/></svg>`,
	diupdate: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" d="M28 5.25h-1.25v-3.25c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 3.25h-18.5v-3.25c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 3.25h-1.25c-1.518 0.002-2.748 1.232-2.75 2.75v19.998c0.002 1.518 1.232 2.748 2.75 2.75h24c1.518-0.002 2.748-1.232 2.75-2.75v-19.998c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM4 6.75h24c0.69 0.001 1.249 0.56 1.25 1.25v3.25h-26.5v-3.25c0.001-0.69 0.56-1.249 1.25-1.25h0zM28 29.248h-24c-0.69-0.001-1.249-0.56-1.25-1.25v-15.248h26.5v15.248c-0.001 0.69-0.56 1.249-1.25 1.25h-0zM20.262 20.457h-3.512v-3.512c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 3.512h-3.513c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h3.513v3.514c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-3.514h3.512c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0z"></path></svg>`,
	versi: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.klsa-1 {fill: none;}</style></defs><path d="M16,24a.9967.9967,0,0,1-.4741-.12l-13-7L3.4741,15.12,16,21.8643,28.5259,15.12l.9482,1.7607-13,7A.9967.9967,0,0,1,16,24Z" transform="translate(0 0)"/><path d="M16,30a.9967.9967,0,0,1-.4741-.12l-13-7L3.4741,21.12,16,27.8643,28.5259,21.12l.9482,1.7607-13,7A.9967.9967,0,0,1,16,30Z" transform="translate(0 0)"/><path d="M16,18a.9967.9967,0,0,1-.4741-.12l-13-7a1,1,0,0,1,0-1.7607l13-7a.9982.9982,0,0,1,.9482,0l13,7a1,1,0,0,1,0,1.7607l-13,7A.9967.9967,0,0,1,16,18ZM5.1094,10,16,15.8643,26.8906,10,16,4.1358Z" transform="translate(0 0)"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="klsa-1" width="32" height="32"/></svg>`,
	android: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><path d="M535.056 9.512c25.75-17.28 60.987-10.39 78.38 15.586l94.304 141.061c59.859-25.976 123.782-44.61 191.885-50.597a671.282 671.282 0 0 1 314.085 48.226l92.385-138.577c17.167-26.09 52.178-32.979 78.267-15.699 25.976 17.28 32.979 52.404 15.699 78.267l-85.721 128.639c29.251 18.86 57.373 39.415 83.123 63.02 118.474 108.535 183.753 253.324 183.753 407.6v734.107c0 88.206-76.008 160.036-169.41 160.036h-169.409V1920h-112.94v-338.82H790.638V1920h-112.94v-338.82H508.29c-93.401 0-169.41-71.829-169.41-160.035V709.286c0-200.468 107.293-380.268 269.249-488.916L519.583 87.892c-17.393-25.863-10.39-60.987 15.473-78.38Zm424.427 216.392c-16.602 0-33.317.791-50.032 2.26-256.6 22.474-457.632 233.784-457.632 481.122v711.86c0 25.863 25.299 47.095 56.47 47.095h903.518c31.17 0 56.47-21.232 56.47-47.096V687.037c0-122.313-52.179-237.512-147.161-324.363-96.112-88.205-225.766-136.77-361.633-136.77ZM113 1298.832h112.94V734.133H113v564.699Zm1581.156 0h112.94V734.133h-112.94v564.699ZM734.168 474.394c-49.919 0-90.351 40.433-90.351 90.352 0 49.807 40.432 90.352 90.351 90.352 49.92 0 90.352-40.545 90.352-90.352 0-49.92-40.432-90.352-90.352-90.352m451.76 0c-49.92 0-90.353 40.433-90.353 90.352 0 49.807 40.433 90.352 90.352 90.352 49.92 0 90.352-40.545 90.352-90.352 0-49.92-40.432-90.352-90.352-90.352" fill-rule="evenodd"/></svg>`,
	ukuran: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" stroke-width="0.4" stroke-linecap="round" stroke-linejoin="round" d="M9,3 L6.5,3 C5.67157288,3 5,3.67157288 5,4.5 L5,19.5 C5,20.3284271 5.67157288,21 6.5,21 L17.5,21 C18.3284271,21 19,20.3284271 19,19.5 L19,7 L15.5,7 C15.2238576,7 15,6.77614237 15,6.5 L15,3 L10,3 L10,4.5 C10,4.77614237 9.77614237,5 9.5,5 C9.22385763,5 9,4.77614237 9,4.5 L9,3 Z M20,6.52797748 L20,19.5 C20,20.8807119 18.8807119,22 17.5,22 L6.5,22 C5.11928813,22 4,20.8807119 4,19.5 L4,4.5 C4,3.11928813 5.11928813,2 6.5,2 L15.4720225,2 C15.6047688,1.99158053 15.7429463,2.03583949 15.8535534,2.14644661 L19.8535534,6.14644661 C19.9641605,6.25705373 20.0084195,6.39523125 20,6.52797748 L20,6.52797748 Z M16,3.70710678 L16,6 L18.2928932,6 L16,3.70710678 Z M9,15.2928932 L9,14.5 C9,14.2238576 9.22385763,14 9.5,14 C9.77614237,14 10,14.2238576 10,14.5 L10,15.2928932 L10.1464466,15.4393398 C10.6929677,15.9858609 11,16.7271025 11,17.5 C11,18.3284271 10.3284271,19 9.5,19 C8.67157288,19 8,18.3284271 8,17.5 C8,16.7271025 8.30703233,15.9858609 8.85355339,15.4393398 L9,15.2928932 L9,15.2928932 Z M9,17.5 C9,17.7761424 9.22385763,18 9.5,18 C9.77614237,18 10,17.7761424 10,17.5 C10,17.0216617 9.82096347,16.5617825 9.5,16.209953 C9.17903653,16.5617825 9,17.0216617 9,17.5 Z M9,6.5 C9,6.22385763 9.22385763,6 9.5,6 C9.77614237,6 10,6.22385763 10,6.5 L10,8.5 C10,8.77614237 9.77614237,9 9.5,9 C9.22385763,9 9,8.77614237 9,8.5 L9,6.5 Z M9,10.5 C9,10.2238576 9.22385763,10 9.5,10 C9.77614237,10 10,10.2238576 10,10.5 L10,12.5 C10,12.7761424 9.77614237,13 9.5,13 C9.22385763,13 9,12.7761424 9,12.5 L9,10.5 Z"/></svg>`,
	download: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
	ulasan: `<svg width="24" height="24" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"></path></svg>`,
	interaksi: `<svg fill="currentColor" height="24" width="24" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485 485" xml:space="preserve"><g><path d="M303.352,288.552c12.284,7.049,26.497,11.104,41.648,11.104c46.299,0,83.966-37.667,83.966-83.966 S391.299,131.724,345,131.724c-1.026,0-2.042,0.041-3.059,0.078c-8.594-34.742-27.889-66.241-55.295-89.835 C255.212,14.904,215.03,0,173.5,0C77.832,0,0,77.832,0,173.5C0,269.168,77.832,347,173.5,347c27.81,0,54.381-6.386,78.977-18.979 C271.644,318.206,289.008,304.703,303.352,288.552z M398.966,215.689c0,29.757-24.209,53.966-53.966,53.966 s-53.965-24.209-53.965-53.966s24.208-53.965,53.965-53.965S398.966,185.933,398.966,215.689z M30,173.5 C30,94.374,94.374,30,173.5,30c66.658,0,123.283,44.801,139.146,108.215c-30.283,12.694-51.612,42.637-51.612,77.474 c0,20.347,7.279,39.023,19.364,53.571C253.188,299.751,214.889,317,173.5,317C94.374,317,30,252.626,30,173.5z"/><polygon points="158.5,158.346 64.975,158.5 65.025,188.5 188.5,188.296 188.5,65 158.5,65 	"/><path d="M345,330c-77.196,0-140,62.804-140,140v15h280v-15C485,392.804,422.196,330,345,330z M236.019,455 c6.666-48.679,45.302-87.311,93.981-93.978V430h30v-68.978c48.678,6.666,87.315,45.298,93.981,93.978H236.019z"/></g></svg>`,
	error: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.klsb-1{fill:none;}</style></defs><path d="M29.83,20l.34-2L25,17.15V13c0-.08,0-.15,0-.23l5.06-1.36-.51-1.93-4.83,1.29A9,9,0,0,0,20,5V2H18V4.23a8.81,8.81,0,0,0-4,0V2H12V5a9,9,0,0,0-4.71,5.82L2.46,9.48,2,11.41,7,12.77c0,.08,0,.15,0,.23v4.15L1.84,18l.32,2L7,19.18a8.9,8.9,0,0,0,.82,3.57L3.29,27.29l1.42,1.42,4.19-4.2a9,9,0,0,0,14.2,0l4.19,4.2,1.42-1.42-4.54-4.54A8.9,8.9,0,0,0,25,19.18ZM15,25.92A7,7,0,0,1,9,19V13h6ZM9.29,11a7,7,0,0,1,13.42,0ZM23,19a7,7,0,0,1-6,6.92V13h6Z"/><rect class="klsb-1" width="32" height="32"/></svg>`,
	anr: `<svg fill="currentColor" width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.klsc-1 {fill: none;}</style></defs><path d="M29.4148,21.6664,23.08,15.3305l6.3337-6.334a2,2,0,0,0,.0017-2.8281l-.0017-.002-3.58-3.58a2,2,0,0,0-2.8284-.0015l-.0017.0015L16.67,8.9194,10.3352,2.5839a2.0037,2.0037,0,0,0-2.8281.0005L2.5854,7.5063a2.0011,2.0011,0,0,0,0,2.8286l6.3338,6.3345L2,23.5883V30H8.4106l6.919-6.9194,6.3354,6.3364a2.0076,2.0076,0,0,0,2.8291,0l4.9207-4.9223A2.0011,2.0011,0,0,0,29.4148,21.6664Zm-5.0015-17.67,3.59,3.59L21.67,13.92l-3.59-3.59ZM8,28H4V24.4086L10.3291,18.08l3.677,3.6778Zm15.08.0035L4,8.9213,8.9219,4,12.71,7.7875,10.458,10.04l1.4153,1.4141,2.2507-2.252,4.1294,4.1294L16,15.5834l1.416,1.4141,2.2517-2.252,4.13,4.13-2.2517,2.251,1.4141,1.415L25.2117,20.29l2.7907,2.791Z" transform="translate(0 0)"/><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="klsc-1" width="32" height="32"/></svg>`
};

let admobData = {},
atmButton,
atmIcon,
atmText;

function stat(t, a, e) {
	return `
			<div class="hover:${t} bg-white dark:bg-[#1e1f21] flex flex-col gap-0.5 items-start p-4 shadow-md rounded-2xl">
				<div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-200 dark:text-gray-900">
					${ICONS[a.toLowerCase()].a}
				</div>
				<h3 class="font-medium mt-2 ${(a.toLowerCase() == "pendapatan" ? "blur-[3px] hover:blur-none" : "")}">${e}</h3>
				<p class="text-xs text-gray-400 mb-1">${a}</p>
				${ICONS[a.toLowerCase()].b}
			</div>`
}

function stik(a, e) {
	return `
			<div class="bg-white dark:bg-white/5 flex flex-col gap-0.5 items-center py-4">
				${ICONS[a.toLowerCase()]}
				<p class="text-xs text-gray-400 mt-2">${a}</p>
				<h3>${e}</h3>
			</div>`
}

function renderAdmobCard(t) {
	const a = admobData[t];
	document.getElementById("admob-date").textContent = a.date_range, document.getElementById("admob-label").textContent = LABELS[t].b, document.getElementById("admob-stats").innerHTML = stat("rotate-3", "Peristiwa", a.ad_requests) + stat("-rotate-3", "Pendapatan", a.earnings.split(",")[0]) + stat("-rotate-3", "Tayangan", a.ad_impressions) + stat("rotate-3", "eCPM", a.ecpm.split(",")[0]), document.querySelectorAll(".admob-btn").forEach(a => {
		const e = a.dataset.key === t;
		a.className = "admob-btn text-xs px-3 py-1 rounded-lg " + (e ? "bg-red-400 dark:bg-red-500 text-gray-50" : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10")
	})
}

function renderCards(t, k) {
	admobData = t;
	const e = new Date,
		s = `${String(e.getDate()).padStart(2,"0")}/${String(e.getMonth()+1).padStart(2,"0")}/${String(e.getFullYear())}`,
		n = Object.keys(t).map(t => `
			<button class="admob-btn" data-key="${t}" onclick="renderAdmobCard('${t}')">${LABELS[t].a||t}</button>`).join(""),
		r = `
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="h-4 relative text-xs uppercase tracking-wider text-center leading-none">
				<div class="h-8 w-60 -z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-0.5 bg-[#1e1f21] dark:bg-white -rotate-2">&ensp;</div>
				<div class="text-white dark:text-black">
					<span class="inline-flex relative mr-1">
						<span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-500 dark:bg-green-500"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-500 border border-[#1e1f21] dark:border-white"></span>
					</span>
					diperbarui jam • <span class="text-sm font-medium leading-none">${formatTime(k.last_update)}</span>
				</div>
			</div>
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="grid grid-cols-1 gap-1">
				<div class="bg-white dark:bg-[#1e1f21] rounded-t-2xl rounded-b-lg overflow-hidden shadow-md">
					<img alt="Placeholder" class="w-full max-w-full h-[10rem] object-cover" src="https://images.pexels.com/photos/5475814/pexels-photo-5475814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
					<div class="flex items-center gap-4 p-4">
						<svg class="flex-none w-10 h-10" width="40" height="40" viewBox="-23.5 0 157 157" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)" fill="currentColor"><path d="M59.8 86.2V112l1-.6a54 54 0 0 1 35.1-19.2l5.7-1q5.3-.8 6.5 4.6 1 5.7-.3 11.3a41 41 0 0 1-18.5 25.1q-10.5 7.1-22.8 9.6l-6.8.7q.1 2.6-.2 5-.6 3.5-1.8 6.8a3 3 0 0 1-3.5 2.1 3.4 3.4 0 0 1-3.3-3 68 68 0 0 1-1-9.9q-4.5-.4-8.5-1.2a56 56 0 0 1-38.9-30q-1.5-3-2-6c-1-4.4 1-8 5.3-9.1a50 50 0 0 1 37.9 4c2.5 1.4 4.6 3.5 7.2 5.6.9-6.6 1-13.2 1.5-20q-6-.4-11.3-1.3c-15.7-3-26.4-11.9-30.5-27.7a43 43 0 0 1 5-32.4 51 51 0 0 1 12-14.5 46 46 0 0 1 18.9-8.2 53 53 0 0 1 29.2 1.5c7.6 2.4 14 7.7 17.6 14.8a50 50 0 0 1 5.9 34.8A38 38 0 0 1 69.8 84q-4.8 1.2-10 2.1M49.5 8.7c-9.5-.1-14 1.6-20.4 8.5A43 43 0 0 0 17 46.3c-.1 13.3 6.2 26.7 23 30.8a54 54 0 0 0 32-2A29 29 0 0 0 91.4 51c1.4-9.3-.8-17.9-4.8-26a24 24 0 0 0-17.5-13.6c-6.4-1.3-13-1.8-19.6-2.7m.8 126V122q-.1-1-.9-1.8l-5.5-7.1a22 22 0 0 0-10.8-7.6q-10.6-3.6-21.6-2.4l-2.5.6c5.7 19 27.6 31.8 41.3 31M100 99.2q-1-.2-2-.1c-6.7.9-13.2 2.4-19.2 5.9a41 41 0 0 0-16 15q-3.7 6.1-3 13.5h2.9a50 50 0 0 0 32.6-19c3.4-4.3 5.1-9.8 4.7-15.3"/><path d="m59 66.4-.6 4.7q-.7 3.6-3.4 3.6t-3.5-3.4l-1-5-7.2-2.5q-1.3-.5-2.4-1.3-2.2-1.5-1.4-4c.6-1.8 2.3-1.6 3.7-1.3q3.5.7 7.7 1.8l.6-12.5L47 45c-7-2.5-8-8.3-5.2-13.8 1.8-3.4 4-5.2 9.9-8.2l-.2-4.1c0-1.4.5-2.8 1.8-2.8a4 4 0 0 1 3 1.7q1 2 1.4 4l7 3.1a4 4 0 0 1 1.5 2.3c.3 1.2-.7 2-2 2.2l-6 .8-.2 1.3v9.8l2.6.9 3.9 1.2c8.8 3 8.7 9.4 5.2 15.4q-3 4.4-8 6.4zm-.4-18.8V59c3.1-1 5.4-2.4 6.7-5q1.7-3.3-1.5-4.7-2.5-1-5.2-1.7m-7-16Q46 33.8 46.4 37c.5 2.6 2.8 2.7 5.2 3.3z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.1.7h109v156.2H.1z"/></clipPath></defs></svg>
						<div class="flex flex-col items-start w-full">
							<h3 class="text-lg font-medium">Google AdMob</h3>
							<p class="text-gray-400">Performa Aplikasi</p>
						</div>
					</div>
				</div>
				<div class="hover:rotate-3 flex items-start flex-row justify-between rounded-xl shadow-md p-4 text-sm text-white bg-gradient-to-tr from-blue-700 via-violet-800 to-fuchsia-900">
					<div class="flex flex-col items-start gap-2">
						<span class="text-xs text-gray-400">Total Saldo</span>
						<h2 class="text-xl font-medium blur-[4px] hover:blur-none">${t.all_time.earnings.split(",")[0]}</h2>
						<p id="atm-text" class="text-lg font-mono tracking-wider leading-none my-7 md:my-5">•••• •••• •••• 506</p>
						<p class="text-xs text-white/80">Diperbarui pada ${s.replaceAll("/01/", " Jan ").replaceAll("/02/", " Feb ").replaceAll("/03/", " Mar ").replaceAll("/04/", " Apr ").replaceAll("/05/", " Mei ").replaceAll("/06/", " Jun ").replaceAll("/07/", " Jul ").replaceAll("/08/", " Agu ").replaceAll("/09/", " Sep ").replaceAll("/10/", " Okt ").replaceAll("/11/", " Nov ").replaceAll("/12/", " Des ")}, ${formatTime(k.last_update)}</p>
					</div>
					<div class="flex flex-col items-end gap-2">
						<div class="w-10 h-7 rounded-md mt-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"></div>
						<div id="atm-toggle" onclick="toggleAtm()" class="text-[11px] text-white flex items-center justify-center w-7 h-7 rounded-full bg-white/20 dark:bg-white/20 backdrop-blur-md my-7 md:my-5 cursor-pointer">
							<i id="atm-icon" class="far fa-eye"></i>
						</div>
					</div>
				</div>
				<div class="hover:-rotate-2 bg-white dark:bg-[#1e1f21] shadow-md rounded-2xl">
					<div class="flex items-center justify-start gap-1 p-4 border-2 border-dashed border-gray-300 dark:border-blue-100/20 rounded-2xl">
						<div class="flex flex-col w-full gap-0.5">
							<h3 id="admob-label"></h3>
							<p class="text-xs text-gray-400" id="admob-date"></p>
						</div>
						<svg class="flex-none text-gray-500" width="26" height="26" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path>
						</svg>
					</div>
				</div>
				<div id="admob-stats" class="grid grid-cols-2 gap-1"></div>
				<div class="bg-white dark:bg-[#1e1f21] flex flex-wrap gap-2 p-4 shadow-md rounded-2xl">${n}</div>
			</div>
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="h-4 relative text-xs uppercase tracking-wider text-center leading-none">
				<div class="h-8 w-52 -z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-0.5 bg-[#1e1f21] dark:bg-white -rotate-2">&ensp;</div>
				<div class="text-white dark:text-black">code with me • <span class="text-sm font-medium leading-none">12:30 AM</span></div>
			</div>
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div id="reels" class="grid grid-cols-1 shadow-md rounded-2xl overflow-hidden" data-ycp_title="Reels · @bachors" data-ycp_channel="PLLZytswN8jaU"></div>
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="h-4 relative text-xs uppercase tracking-wider text-center leading-none">
				<div class="h-8 w-32 -z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-0.5 bg-[#1e1f21] dark:bg-white -rotate-3">&ensp;</div>
				<div class="text-white dark:text-black">Hue are you ?</div>
			</div>
			<div class="text-gray-400 dark:text-gray-500 mt-4 text-center">
				<i class="fa fa-code"></i>
			</div>`,
		d = `
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="h-4 relative text-xs uppercase tracking-wider text-center leading-none">
				<div class="h-8 w-60 -z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ml-0.5 bg-[#1e1f21] dark:bg-white -rotate-2">&ensp;</div>
				<div class="text-white dark:text-black">progres hari ini • <span class="text-sm font-medium leading-none">${s}</span></div>
			</div>
			<div class="text-gray-400 dark:text-gray-500 my-4 text-center">
				<i class="fa fa-ellipsis-vertical"></i>
			</div>
			<div class="bg-white dark:bg-[#1e1f21] grid grid-cols-1 rounded-2xl overflow-hidden shadow-md">
				<div class="overflow-hidden">
					<img alt="Placeholder" class="w-full max-w-full h-[10rem] object-cover" src="https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
					<div class="flex items-center gap-4 p-4">
						<svg class="flex-none w-10 h-10" width="40" height="40" viewBox="0 -2.5 161 161" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#a)"><path d="M73.4 154.4H52l-30.7.5q-5-.1-10-.5-.7 0-1.3-.2c-8.1-1.8-10.8-7.2-7-14.6q2.7-5.2 6.2-10a720 720 0 0 1 41.5-53.4l1.7-2a8 8 0 0 0 2.1-6c-.2-5.1.2-10.2.3-15.2l.5-38.8q.1-4.4.5-8.7.1-3.5 3.6-4.2a17 17 0 0 1 4-.6q15.2 0 30.3.2c5.7.2 7 1.5 7.5 7.3Q102 19 102.5 30l1.4 37c0 2.1 1.2 3.3 2.4 4.6q10.8 11.6 21.4 23.4 15.8 17.8 29.3 37.3 2.1 3 3 6.7c1.5 5-.3 9.2-5.2 11.3-3.4 1.4-7 2-10.7 2.7-10 1.7-20 1.5-29.9 1.4zm-62-10.4q4.6 2.1 9.8 1.8 14.2-.4 28.6-.4L73 145l17.2.5h28.6q13.8.4 27.5-1.4c7-.9 7.9-2.4 3.8-8q-8.7-11.9-17.5-23.5c-1.6-2-3.1-4-6.3-3.4q-1.1 0-2.2-.5l-10.7-3q-9.6-2.9-18.8 1-2.2.7-4.3 1.8a35 35 0 0 1-23 3q-7.5-1.3-15-3.4a20 20 0 0 0-21.8 7.3L17 134.7c-2 2.9-3.5 6-5.5 9.3M60.9 7.8l.7 16.8q.7 19.7 1.9 39.4a21 21 0 0 1-5 15.5l-2.3 3-13.4 16.8-1.5 2.3q6.8-1.3 13.7.4a108 108 0 0 0 13.2 2.8c6.1.8 12.3.8 18-2.4q3.5-1.6 7.1-3 9.7-3.9 19.9-1.5l8.2 2.2q-5.8-7.5-12-14.2-5.6-6.4-11.5-12.3-2.7-2.4-2.9-5.8l-.6-18.1-.7-35.7q-.1-3-.5-6.2z" fill="currentColor"/></g><defs><clipPath id="a"><path fill="#fff" d="M.6.3h160.1v154.9H.6z"/></clipPath></defs></svg>
						<div class="flex flex-col items-start w-full">
							<h3 class="text-lg font-medium">Google Play</h3>
							<p class="text-gray-400">Statistik Aplikasi</p>
						</div>
						<div class="flex items-center gap-1">
							<svg width="24" height="24" class="-mt-1 fill-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path clip-rule="evenodd" fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"></path>
							</svg>
							<h3 class="font-medium text-xl">${k.apl_rating.replace(" ★", "")}</h3>
							<span class="text-xs mt-1.5 text-gray-500">/5</span>
						</div>
					</div>
				</div>
				<div class="bg-gray-200 dark:bg-[#1e1f21] grid grid-cols-3 gap-px pt-px">${stik("Dirilis","10/08/2021")}${stik("Kategori","Hiburan")}${stik("Rating",k.apl_konten)}${stik("Diupdate",k.apl_update)}${stik("Versi",k.apl_versi)}${stik("Android",k.apl_os)}${stik("Ukuran",k.apl_size)}${stik("Download",k.apl_download)}${stik("Ulasan",k.apl_ulasan)}${stik("Interaksi",k.apl_interaksi)}${stik("Error",k.apl_error)}${stik("ANR",k.apl_anr)}</div>
			</div>`;
	document.getElementById("cards").innerHTML += d + r, renderAdmobCard("seven_day");
	youtube();
}

function updateAtmIcon() {
	atmIcon.className = atmButton.classList.contains("norek") ? "far fa-eye-slash" : "far fa-eye"
}

function updateAtmText() {
	atmText.textContent = atmButton.classList.contains("norek") ? "4180 0100 0414 506" : "•••• •••• •••• 506"
}

function toggleAtm() {
	atmButton = document.getElementById('atm-toggle'),
	atmIcon = document.getElementById('atm-icon'),
	atmText = document.getElementById('atm-text');
	atmButton.classList.toggle("norek");
	updateAtmIcon(), updateAtmText()
}

function youtube() {
	const apikey = "AIzaSyDP4jj5m879TbJlaP4HFdshQg8oFkJnJME";
	ycp("#reels", { apikey: apikey, playlist: 5, autoplay: true, related: false })
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
		renderCards(a.data, a)
	} catch (t) {}
}

function formatTime(t) {
	let [a, e] = t.split(":").map(Number), s = a >= 12 ? "PM" : "AM";
	return 0 == (a %= 12) && (a = 12), `${String(a).padStart(2,"0")}:${String(e).padStart(2,"0")} ${s}`
}

fetchData();