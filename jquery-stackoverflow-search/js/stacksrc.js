/*********************************************************************
* #### jQuery-Stackoverflow-Search ####
* Coded by Ican Bachors 2016.
* http://ibacor.com/labs/jquery-stackoverflow-search
* Updates will be posted to this site.
*********************************************************************/

$('.stack_title').keydown(function() {
    setTimeout(function() {
        var d = $('.stack_title').val(),
            e = $('.stack_sort').val();
        if (d.length > 2) {
            ibacor_stack(e, d);
        } else {
            $('.stack_output').css("display", "none");
        }
    }, 50)
});

$('.stack_sort').change(function() {
    var d = $('.stack_title').val(),
        e = $(this).val();
    if (d.length > 2) {
        ibacor_stack(e, d);
    }
    return false
});

$(document).mouseup(function(e) {
    var container = $('#stackjs');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.stack_output').css("display", "none")
    }
});

function ibacor_stack(e, d) {
    $.ajax({
        url: 'https://api.stackexchange.com/2.2/search?order=desc&sort=' + e + '&site=stackoverflow&intitle=' + d,
        crossDomain: true,
        dataType: 'json'
    }).done(function(b) {
        var c = '';

        $.each(b.items, function(i, a) {
            var date = new Date(1000 * b.items[i].creation_date),
                time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() + 1) + ':' + date.getSeconds();

            c += '<div><p><a href="' + b.items[i].link + '" target="_BLANK">' + b.items[i].title + '</a></p>';
            c += '<span>Score ' + koma(b.items[i].score) + '</span><span>Answer ' + koma(b.items[i].answer_count) + '</span><span class="date">' + relative_time(time) + ' ago</span></div>';
        });
        if (c == '') {
            $('.stack_output').css("display", "none")
        } else {
            $('.stack_output').css("display", "block")
        }
        $('.stack_output').html(c)
    })
}

function koma(a) {
    var b = parseInt(a, 10);
    if (b === null) {
        return 0
    }
    if (b >= 1000000000) {
        return (b / 1000000000).toFixed(1).replace(/\.0$/, "") + "G"
    }
    if (b >= 1000000) {
        return (b / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
    }
    if (b >= 1000) {
        return (b / 1000).toFixed(1).replace(/\.0$/, "") + "K"
    }
    return b
}

function relative_time(a) {
    if (!a) {
        return
    }
    a = $.trim(a);
    a = a.replace(/\.\d\d\d+/, "");
    a = a.replace(/-/, "/").replace(/-/, "/");
    a = a.replace(/T/, " ").replace(/Z/, " UTC");
    a = a.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2");
    var b = new Date(a);
    var c = (arguments.length > 1) ? arguments[1] : new Date();
    var d = parseInt((c.getTime() - b) / 1000);
    d = (d < 2) ? 2 : d;
    var r = '';
    if (d < 60) {
        r = 'jst now'
    } else if (d < 120) {
        r = 'a min'
    } else if (d < (45 * 60)) {
        r = (parseInt(d / 60, 10)).toString() + ' mins'
    } else if (d < (2 * 60 * 60)) {
        r = 'an hr'
    } else if (d < (24 * 60 * 60)) {
        r = (parseInt(d / 3600, 10)).toString() + ' hrs'
    } else if (d < (48 * 60 * 60)) {
        r = 'a day'
    } else {
        dd = (parseInt(d / 86400, 10)).toString();
        if (dd <= 30) {
            r = dd + ' dys'
        } else {
            mm = (parseInt(dd / 30, 10)).toString();
            if (mm <= 12) {
                r = mm + ' mon'
            } else {
                r = (parseInt(mm / 12, 10)).toString() + ' yrs'
            }
        }
    }
    return r
}
