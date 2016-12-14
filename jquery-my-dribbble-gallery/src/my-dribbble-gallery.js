/******************************************************
* #### jQuery My dribbble Gallery v01 ####
* Coded by Ican Bachors 2015.
* http://ibacor.com/labs/jquery-my-dribbble-gallery/
* Updates will be posted to this site.
******************************************************/

var bcr_mdg = function(h, j) {
    bcr_mdg_profile(h, j);
    bcr_mdg_gallery(h, 'shots', 1, j);
    bcr_mdg_gallery(h, 'likes', 1, j);
    bcr_mdg_list(h, 'buckets', 1, j);
    bcr_mdg_list(h, 'projects', 1, j);
    bcr_mdg_user(h, 'teams', 1, j);
    bcr_mdg_user(h, 'followers', 1, j);

    function bcr_mdg_user(d, e, f, g) {
        $.ajax({
            url: 'https://api.dribbble.com/v1/users/' + d + '/' + e + '?page=' + f + '&access_token=' + g,
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(b) {
            var c = '';
            if (b.data.length > 0) {
                if (e == 'teams') {
                    $.each(b.data.reverse(), function(i, a) {
                        c += '<div class="drb_img user"><a href="' + a.html_url + '" target="_BLANK"><img src="' + a.avatar_url + '" alt="" title="' + a.name + '"><p>@' + a.username + '</p></a></div>'
                    })
                } else {
                    $.each(b.data.reverse(), function(i, a) {
                        c += '<div class="drb_img user"><a href="' + a.follower.html_url + '" target="_BLANK"><img src="' + a.follower.avatar_url + '" alt="" title="' + a.follower.name + '"><p>@' + a.follower.username + '</p></a></div>'
                    })
                }
                if (b.data.length == 12) {
                    c += '<p class="load_more' + e + '"><input type="submit" class="btn drb_more' + e + '" value="More"></p>'
                }
            } else {
                c += '<h2 align="center">Not found.</h2>'
            }
            $('.bcr_drb_' + e).append(c);
            $('.drb_more' + e).click(function() {
                bcr_mdg_user(d, e, (f) + 1, g);
                $(".load_more" + e).remove();
                return false
            })
        })
    }

    function bcr_mdg_gallery(d, e, f, g) {
        $.ajax({
            url: 'https://api.dribbble.com/v1/users/' + d + '/' + e + '?page=' + f + '&access_token=' + g,
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(b) {
            var c = '';
            if (b.data.length > 0) {
                if (e == 'shots') {
                    $.each(b.data.reverse(), function(i, a) {
                        c += '<div class="drb_img"><a href="' + a.html_url + '" target="_BLANK"><img src="' + a.images.teaser + '" alt="" title="' + a.title + '"></a></div>'
                    })
                } else {
                    $.each(b.data.reverse(), function(i, a) {
                        c += '<div class="drb_img"><a href="' + a.shot.html_url + '" target="_BLANK"><img src="' + a.shot.images.teaser + '" alt="" title="' + a.shot.title + '"></a></div>'
                    })
                }
                if (b.data.length == 12) {
                    c += '<p class="load_more' + e + '"><input type="submit" class="btn drb_more' + e + '" value="More"></p>'
                }
            } else {
                c += '<h2 align="center">Not found.</h2>'
            }
            $('.bcr_drb_' + e).append(c);
            $('.drb_more' + e).click(function() {
                bcr_mdg_gallery(d, e, (f) + 1, g);
                $(".load_more" + e).remove();
                return false
            })
        })
    }

    function bcr_mdg_list(d, e, f, g) {
        $.ajax({
            url: 'https://api.dribbble.com/v1/users/' + d + '/' + e + '?page=' + f + '&access_token=' + g,
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(b) {
            var c = '';
            if (b.data.length > 0) {
                c += '<ul class="tag_nav">';
                $.each(b.data.reverse(), function(i, a) {
                    c += '<li><a href="https://dribbble.com/' + d + '/' + e + '/' + a.id + '" target="_BLANK">' + a.name + ' <span>' + a.shots_count + '</span></a></li>'
                });
                c += '</ul>';
                if (b.data.length == 12) {
                    c += '<p class="load_more' + e + '"><input type="submit" class="btn drb_more' + e + '" value="More"></p>'
                }
            } else {
                c += '<h2 align="center">Not found.</h2>'
            }
            $('.bcr_drb_' + e).append(c);
            $('.drb_more' + e).click(function() {
                bcr_mdg_list(d, e, (f) + 1, g);
                $(".load_more" + e).remove();
                return false
            })
        })
    }

    function bcr_mdg_profile(e, f) {
        $.ajax({
            url: 'https://api.dribbble.com/v1/users/' + e + '?access_token=' + f,
            crossDomain: true,
            dataType: 'jsonp'
        }).done(function(c) {
            var d = '';
            d += '<div class="drb_pr_user"><img src="' + c.data.avatar_url + '" class="drb_pr_img" alt="' + c.data.username + '" title="' + c.data.username + ' on dribbble"></div>';
            d += '<p class="drb_username"><a href="' + c.data.html_url + '" target="_BLANK">@' + c.data.username + '</a></p>';
            d += '<p>Name: ' + c.data.name + '</p>';
            d += '<p>Bio: ' + c.data.bio + '</p>';
            d += '<p>Location: ' + c.data.location + '</p>';
            d += '<p>';
            $.each(c.data.links, function(a, b) {
                d += '<a href="' + b + '" target="_BLANK">' + a + '</a> '
            });
            d += '</p>';
            d += '<div class="tabs"><div class="tab aktip" data-dip="shots">' + c.data.shots_count + ' shots</div><div class="tab" data-dip="buckets">' + c.data.buckets_count + ' buckets</div><div class="tab" data-dip="projects">' + c.data.projects_count + ' projects</div><div class="tab" data-dip="teams">' + c.data.teams_count + ' teams</div><div class="tab" data-dip="likes">' + c.data.likes_count + ' likes</div><div class="tab" data-dip="followers">' + c.data.followers_count + ' followers</div></div>';
            $('.bcr_drb_profile').html(d);
            $('.tab').click(function() {
                $('.tab').removeClass('aktip');
                $('.dribbble').css('display', 'none');
                var a = $(this).data('dip');
                $(this).addClass('aktip');
                $('.bcr_drb_' + a).css('display', 'block');
                return false
            })
        })
    }
}
