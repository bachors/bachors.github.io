<?php

$a = '<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://bachors.github.io/jquery-my-instagram-gallery/css/my-instagram-gallery.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.css">
	</head>
	<body>
		<div class="demo"></div>
		<script type="text/javascript" src="//code.jquery.com/jquery-2.1.3.min.js"></script><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js"></script><script type="text/javascript" src="https://bachors.github.io/jquery-my-instagram-gallery/js/my-instagram-gallery.js"></script><script>$(function() {

    $(".myig_popup").fancybox({
        openEffect: "fade",
        closeEffect: "fade"
    });

    $(".demo").myig(
        503807090, // your user_id
        10, // Count of media to return
        "2227436581.3a81a9f.4e37b9951fb344ffbbd57bac6aa0dca1" // your token
    );

});</script>
	</body>
</html>';

echo htmlentities($a);