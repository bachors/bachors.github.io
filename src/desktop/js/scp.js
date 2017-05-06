/******************************************************
* #### jQuery Soundcloud Player v0.02 ####
* Coded by Ican Bachors 2016.
* https://github.com/bachors/Soundcloud-Player
* Updates will be posted to this site.
******************************************************/

var scp = function(g, f) {
    var d = '<div class="scp-unit scp-play-kenca"><div class="scp_track_play"></div></div>';
    d += '<div class = "scp-unit scp-play-katuhu"><div class="scp_track">';
    d += '<div class="scp-play-top">';
    d += '<input type="text" id="scp-input" value="" placeholder="Title"/>';
    d += '</div><div class="scp-play-bottom">';
    d += '</div>';
    d += '</div></div>';
    $('#scp').html(d);
    scp_track('q', 'dangdut koplo');

    function scp_track(c, e) {
        $.ajax({
            url: 'http://api.soundcloud.com/tracks?' + c + '=' + e + '&format=json&client_id=' + f,
            crossDomain: true,
            dataType: 'json'
        }).done(function(b) {
            var d = '';
            $.each(b, function(i, a) {
                var x = '';
                if (i == 0) {
                    x += 'scp-play-active'
                }
                d += '<div class="scp-play ' + x + '" data-play="' + b[i].id + '" data-title="' + b[i].title + '"><div class="title">' + b[i].title + '</div><span>by ' + b[i].user.username + '</span></div>'
            });
            $('.scp-play-bottom').html(d);
            $('#scp-rf').html(b[0].title);
            $('.scp_track_play').html('<iframe class="scp-play-iframe" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + b[0].id + '&amp;auto_play=' + g + '&amp;hide_related=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>');
            $("body").on('keypress', '#scp-input', function(e){
				if (e.which == 13) {
					scp_track('q', $("#scp-input").val());
					return false; 
				}
			});
            $(".scp-play").each(function() {
                $(this).click(function() {
                    var a = $(this).attr("data-play");
                    var x = $(this).attr("data-title");
                    $('#scp-rf').html(x);
                    $('div').removeClass('scp-play-active');
                    $(this).addClass('scp-play-active');
                    $('.scp_track_play').html('<iframe class="scp-play-iframe" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + a + '&amp;auto_play=' + g + '&amp;hide_related=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>');
                    return false
                })
            })
        })
    }
}
