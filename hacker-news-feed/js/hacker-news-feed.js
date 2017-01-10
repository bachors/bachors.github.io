/************************************************
 * #### hacker-news-feed.js ####
 * Coded by Ican Bachors 2016.
 * http://ibacor.com/labs/hacker-news-feed-js
 * Updates will be posted to this site.
 
  	Method:
	-	hnfeed(menu, page); 
	
	Parameters:
	-  	{String} menu
			list ("top", "news", "comments", "show", "ask", "jobs")
	-  	{Integer} page
			default (1)
 ************************************************/

var hnfeed = function(m, p = 1) {

    var j = {
        result: []
    };

    m = m.toLowerCase();
    if (m == 'news') {
        m = 'newest';
    } else if (m == 'top') {
        m = 'news';
    } else if (m == 'comments') {
        m = 'newcomments';
    }
    var k = yql('https://news.ycombinator.com/' + m + '?p=' + p);

    $.each($(k).find('table.itemlist tr.athing'), function() {
        var c = $(this);
        var d = {};
        if (m == 'newcomments') {
            d['user'] = {
                by: c.find('td.default a.hnuser').text(),
                link: 'https://news.ycombinator.com/' + c.find('td.default a.hnuser').attr('href')
            };
            d['date'] = c.find('td.default span.age a').text();
            d['on'] = {
                title: c.find('td.default span.storyon a').text(),
                link: 'https://news.ycombinator.com/' + c.find('td.default span.storyon a').attr('href')
            };
            d['comment'] = c.find('td.default div.comment span').html()
			.replace(/\<span\>\n\s+\<\/span\>\<\/p\>\<div class=\"reply\"\>\<\/div\>/, '')
			.replace(/\<span\>\n\s+\<\/span\>\<div class=\"reply\"\>\<\/div\>/, '');
        } else {
            d['title'] = c.find('td.title a').text();
            d['site'] = c.find('span.sitebit span').text();
            d['link'] = c.find('td.title a').attr('href');
            d['date'] = c.next().find('span.age a').text();
            if (m != 'jobs') {
                d['point'] = c.next().find('span.score').text().replace(/\s+point(.*)/, '');
                d['user'] = {
                    by: c.next().find('a.hnuser').text(),
                    link: 'https://news.ycombinator.com/' + c.next().find('a.hnuser').attr('href')
                };
                d['comment'] = {
                    count: (c.next().find('a:last').text() == 'discuss' ? 0 : c.next().find('a:last').text().replace(/\s+comment(.*)/, '')),
                    link: 'https://news.ycombinator.com/' + c.next().find('a:last').attr('href')
                }
            }
        }
        j.result.push(d);

    });

    return j;

    function yql(b) {
        var d = '';
        $.ajax({
            url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('SELECT content FROM data.headers WHERE url="' + b + '" and ua="Googlebot/2.1 (http://www.googlebot.com/bot.html)"') + '&format=xml&env=http://datatables.org/alltables.env',
            async: false
        }).done(function(a) {
            var e = $(a).find("content").text();
            d = removeElements(e);
        });
        return d
    }

    function removeElements(a) {
        var b = $("<div>" + a + "</div>");
        b.find('style').remove();
        b.find("script").remove();
        b.find("iframe").remove();
        b.find("embed").remove();
        return b.html()
    }

}
