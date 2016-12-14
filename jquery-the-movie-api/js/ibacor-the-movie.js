/*********************************************************************
 * #### jQuery-iBacor-The-Movie-API v01.1 ####
 * Coded by Ican Bachors 2016.
 * http://ibacor.com/labs/jquery-ibacor-the-movie-api
 * Updates will be posted to this site.
 *********************************************************************/

var ibacor_themovie = function(h) {
    var j = getParameterByName('search'),
        get_id = getParameterByName('id');
    if (j != '') {
        $('#search_movie').val(j);
        ibacor_search_movie(j, h, 1)
    } else if (get_id != '') {
        ibacor_the_movie(get_id, h)
    } else {
        ibacor_pop_movie(h, 1)
    }
	$(".ins_popup").fancybox({
		openEffect : 'fade',
		closeEffect : 'fade'
	});
    $('#submit').click(function() {
        $('#ibacor_themovie').html('');
        var a = $('#search_movie').val();
        window.history.pushState(null, null, "?search=" + a);
        ibacor_search_movie(a, h, 1);
        return false
    })

    function getParameterByName(a) {
        a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var b = new RegExp("[\\?&]" + a + "=([^&#]*)"),
            results = b.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
    }

    function ibacor_pop_movie(e, f) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/discover/movie?api_key=' + e + '&sort_by=popularity.desc&page=' + f,
            crossDomain: true,
            dataType: 'json'
        }).done(function(c) {
            var d = '';
            $.each(c.results, function(i, a) {
                var b = '',
                    x = c.results[i].original_title;
                if (c.results[i].poster_path != null) {
                    b += '<img src="http://image.tmdb.org/t/p/w500' + c.results[i].poster_path + '" alt="ibacor" class="poster">'
                } else {
                    b += '<img src="http://ibacor.com/bcr_asset/images/media/547617dc77ece9e196f9093d03312488.jpg" class="poster">'
                }
                d += '<li class="col-md-3 col-sm-4 movie">';
                d += '<a class="themovie" data-idmovie="' + c.results[i].id + '" title="' + x + '" href="#">';
                d += b;
                d += '<h3>' + x.substr(0, 10) + '</h3>';
                d += '</a>';
                d += '</li>'
            });
            if (c.page < c.total_pages) {
                d += '<li id="more_movie"><a href="#" class="btn btn-default more_movie">More</a></li>'
            }
            $('#ibacor_themovie').append(d);
            $(".themovie").click(function() {
                var a = $(this).data("idmovie");
                window.history.pushState(null, null, "?id=" + a);
                ibacor_the_movie(a, e);
                return false
            });
            $(".more_movie").click(function() {
                $('#more_movie').remove();
                ibacor_pop_movie(e, f + 1);
                return false
            })
        })
    }

    function ibacor_search_movie(e, f, g) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/search/movie?query=' + e + '&api_key=' + f + '&page=' + g,
            crossDomain: true,
            dataType: 'json'
        }).done(function(c) {
            var d = '';
            $.each(c.results, function(i, a) {
                var b = '',
                    x = c.results[i].original_title;
                if (c.results[i].poster_path != null) {
                    b += '<img src="http://image.tmdb.org/t/p/w500' + c.results[i].poster_path + '" alt="ibacor" class="poster">'
                } else {
                    b += '<img src="http://ibacor.com/bcr_asset/images/media/547617dc77ece9e196f9093d03312488.jpg" class="poster">'
                }
                d += '<li class="col-md-3 col-sm-4 movie">';
                d += '<a class="themovie" data-idmovie="' + c.results[i].id + '" title="' + x + '" href="#">';
                d += b;
                d += '<h3>' + x.substr(0, 10) + '</h3>';
                d += '</a>';
                d += '</li>'
            });
            if (c.page < c.total_pages) {
                d += '<li id="more_movie"><a href="#" class="btn btn-default more_movie">More</a></li>'
            }
            $('#ibacor_themovie').append(d);
            $('title').html(e + ' - ibacor.com');
            $(".themovie").click(function() {
                var a = $(this).data("idmovie");
                window.history.pushState(null, null, "?id=" + a);
                ibacor_the_movie(a, f);
                return false
            });
            $(".more_movie").click(function() {
                $('#more_movie').remove();
                ibacor_search_movie(e, f, g + 1);
                return false
            })
        })
    }

    function ibacor_the_bek(d, e) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/movie/' + d + '?api_key=' + e + '&append_to_response=images,casts,trailers',
            crossDomain: true,
            dataType: 'json'
        }).done(function(b) {
            var c = '';
            $.each(b.images.backdrops, function(i, a) {
                if (i == 0) {
                    c += '<a href="http://image.tmdb.org/t/p/w500' + b.images.backdrops[i].file_path + '" class="ins_popup" rel="ibacor_gallery" title="Show All"><img src="http://image.tmdb.org/t/p/w500' + b.images.backdrops[i].file_path + '" alt="" class="poster"></a>'
                } else {
                    c += '<a style="display:none" href="http://image.tmdb.org/t/p/w500' + b.images.backdrops[i].file_path + '" class="ins_popup" rel="ibacor_gallery" title="Show All"><img src="http://image.tmdb.org/t/p/w500' + b.images.backdrops[i].file_path + '" alt="" class="poster"></a>'
                }
            });
            $('.bcr_bek').html(c)
        })
    }

    function ibacor_the_cas(d, e) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/movie/' + d + '?api_key=' + e + '&append_to_response=images,casts,trailers',
            crossDomain: true,
            dataType: 'json'
        }).done(function(b) {
            var c = '',
                img = '';
            $.each(b.casts.cast, function(i, a) {
                var x = b.casts.cast[i].name + ' as ' + b.casts.cast[i].character;
                c += '<div class="col-md-3 col-sm-4 movie">';
                if (b.casts.cast[i].profile_path != null) {
                    c += '<a href="http://image.tmdb.org/t/p/w500' + b.casts.cast[i].profile_path + '" class="ins_popup" rel="ibacor_gallerycr" title="' + x + '">';
                    c += '<img src="http://image.tmdb.org/t/p/w500' + b.casts.cast[i].profile_path + '" alt="ibacor" class="poster">'
                } else {
                    c += '<a href="http://ibacor.com/bcr_asset/images/user.jpg" class="ins_popup" rel="ibacor_gallerycr" title="' + x + '">';
                    c += '<img src="http://ibacor.com/bcr_asset/images/user.jpg" alt="ibacor" class="poster">'
                }
                c += '</a>';
                c += '</div>'
            });
            $('.bcr_cast').html(c)
        })
    }

    function ibacor_the_cre(d, e) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/movie/' + d + '?api_key=' + e + '&append_to_response=images,casts,trailers',
            crossDomain: true,
            dataType: 'json'
        }).done(function(b) {
            var c = '';
            $.each(b.casts.crew, function(i, a) {
                var x = b.casts.crew[i].name + ' as ' + b.casts.crew[i].department + ' & ' + b.casts.crew[i].job;
                c += '<div class="col-md-3 col-sm-4 movie">';
                if (b.casts.crew[i].profile_path != null) {
                    c += '<a href="http://image.tmdb.org/t/p/w500' + b.casts.crew[i].profile_path + '" class="ins_popup" rel="ibacor_gallerycr" title="' + x + '">';
                    c += '<img src="http://image.tmdb.org/t/p/w500' + b.casts.crew[i].profile_path + '" alt="ibacor" class="poster">'
                } else {
                    c += '<a href="http://ibacor.com/bcr_asset/images/user.jpg" class="ins_popup" rel="ibacor_gallerycr" title="' + x + '">';
                    c += '<img src="http://ibacor.com/bcr_asset/images/user.jpg" alt="ibacor" class="poster">'
                }
                c += '</a>';
                c += '</div>'
            });
            $('.bcr_crew').html(c)
        })
    }

    function ibacor_the_movie(d, e) {
        $.ajax({
            url: 'https://api.themoviedb.org/3/movie/' + d + '?api_key=' + e + '&append_to_response=images,casts,trailers',
            crossDomain: true,
            dataType: 'json'
        }).done(function(b) {
            var c = '<li class="col-md-12 slid">';
            c += '<div class="col-md-4 col-sm-4">';
            c += '<div class="content isi"><h4>Posters</h4><p>';
            $.each(b.images.posters, function(i, a) {
                if (i == 0) {
                    c += '<a href="http://image.tmdb.org/t/p/w500' + b.images.posters[i].file_path + '" class="ins_popup" rel="ibacor_galleryp" title="Show All"><img src="http://image.tmdb.org/t/p/w500' + b.images.posters[i].file_path + '" class="poster" alt=""></a>'
                } else {
                    c += '<a style="display:none" href="http://image.tmdb.org/t/p/w500' + b.images.posters[i].file_path + '" class="ins_popup" rel="ibacor_galleryp" title="Show All"><img src="http://image.tmdb.org/t/p/w500' + b.images.posters[i].file_path + '" class="poster" alt="ibacor"></a>'
                }
            });
            c += '</p>';
            c += '<h4>Movie Facts</h4><p>';
            c += '<b>Status:</b> ' + b.status + '<br>';
            c += '<b>Runtime:</b> ' + b.runtime + '<br>';
            c += '<b>Budget:</b> $' + b.budget + '<br>';
            c += '<b>Revenue:</b> $' + b.revenue + '<br>';
            c += '<b>Language:</b> ';
            $.each(b.spoken_languages, function(i, a) {
                c += b.spoken_languages[i].name + ' (' + b.spoken_languages[i].iso_639_1 + ') '
            });
            c += '<br><b>Webpage:</b> <a href="' + b.homepage + '" target="_BLANK">Link</a>';
            c += '</p><hr><h4>Production Countries</h4><p>';
            $.each(b.production_countries, function(i, a) {
                c += '<img src="http://flagpedia.net/data/flags/small/' + b.production_countries[i].iso_3166_1.toLowerCase() + '.png" width="30" alt="' + b.production_countries[i].iso_3166_1 + '"> '
            });
            c += '</p><hr><h4>Release Info</h4><p>';
            c += '<span class="label label-info">' + b.release_date + '</span>';
            c += '</p><hr><h4>Tagline</h4><p>';
            c += '<span class="label label-danger">' + b.tagline + '</span>';
            c += '</p><hr><h4>Trailers</h4><p>';
            $.each(b.trailers.youtube, function(i, a) {
                c += '<iframe src="https://www.youtube.com/embed/' + b.trailers.youtube[i].source + '" frameborder="0" allowfullscreen></iframe>'
            });
            c += '</p></div>';
            c += '</div>';
            c += '<div class="col-md-8 col-sm-8">';
            c += '<div class="content isi"><h3>' + b.original_title + '</h3><br>';
            c += '<i class="fa fa-star-half-o" style="color:#FCB04E"></i> ' + b.vote_average + '/10 (' + b.vote_count + ' votes)&nbsp;&nbsp;&nbsp;<i class="fa fa-heart" style="color:#F66767"></i> ' + b.popularity + '<hr>';
            c += '<h4>Overview</h4><p><div class="alert alert-info alert-dismissable" title="Code by ibacor.com. API by themoviedb.org">' + b.overview + '</div></p>';
            c += '<h4>Genres</h4><p>';
            $.each(b.genres, function(i, a) {
                c += '<span class="label label-warning">' + b.genres[i].name + '</span> '
            });
            c += '</p><br><br>';
            c += '<h4>Production Companies</h4><p>';
            $.each(b.production_companies, function(i, a) {
                c += '<span class="label label-success">' + b.production_companies[i].name + '</span> '
            });
            c += '</p><hr><br>';
            c += '<h4>Backdrops</h4><p><div class="col-md-12 col-sm-12 bcr_bek"><a title="Code by ibacor.com. API by themoviedb.org" href="#" class="btn btn-default tingalibek"><i class="fa fa-eye"></i>View All</a></div></p><br><br>';
            c += '<h4>Cast</h4><p><div class="col-md-12 col-sm-12 bcr_cast"><a title="Code by ibacor.com. API by themoviedb.org" href="#" class="btn btn-default tingalicas"><i class="fa fa-eye"></i>View All</a></div></p><br>';
            c += '<h4>Crew</h4><p><div class="col-md-12 col-sm-12 bcr_crew"><a title="Code by ibacor.com. API by themoviedb.org" href="#" class="btn btn-default tingalicre"><i class="fa fa-eye"></i>View All</a>';
            c += '</div></p></div></div>';
            c += '</li>';
            $('#ibacor_themovie').html(c);
            $('title').html(b.original_title + ' - ibacor.com');
            $(".tingalibek").click(function() {
                $('.tingalibek').remove();
                ibacor_the_bek(d, e);
                return false
            });
            $(".tingalicas").click(function() {
                $('.tingalicas').remove();
                ibacor_the_cas(d, e);
                return false
            });
            $(".tingalicre").click(function() {
                $('.tingalicre').remove();
                ibacor_the_cre(d, e);
                return false
            })
        })
    }
}
