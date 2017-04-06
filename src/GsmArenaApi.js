/*******************************
 * #### GsmArenaApi.js ####
 * Coded by @bachors 2017.
 
 * param: 'search'
 * query: 'keyword'
 
 * param: 'detail'
 * param: 'slug'
 *******************************/

var GsmArenaApi = function(data, callback) {
	
	if(typeof data === 'object'){
		if(data.param == 'search'){
			search(data.query);
		}else if(data.param == 'detail'){
			detail(data.query);
		}else{
			callback({
				status: 'error',
				message: data.param + 'it is not in accordance'
			});
		}
	}else{
		callback({
			status: 'error',
			message: 'data not object'
		});
	}
	
	function search(query) {
        var d = '';
        $.ajax({
            url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('SELECT content FROM data.headers WHERE url="http://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=' + query + '" and ua="Googlebot/2.1 (http://www.googlebot.com/bot.html)"') + '&format=xml&env=store://datatables.org/alltableswithkeys'
        }).done(function(html) {
            var dom = $(html).find("content").text();
			var result = [];
			var makers = $(dom).find('div.makers:eq(0)');
			$.each($(makers).find('li'), function(i, a) {
				var object = {};
				var grid = $(a).find('a:eq(0)');
				object['title'] = $(grid).find('span:eq(0)').text();
				object['image'] = $(grid).find('img:eq(0)').attr('src');
				object['slug'] = $(grid).attr('href').replace('.php', '').replace(/\&/gi, '_and_').replace(/\+/gi, '_tambah_');
				result.push(object);
			});
            callback(result);
        });
	}
	
	function detail(query) {
        var d = '';
        $.ajax({
            url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('SELECT content FROM data.headers WHERE url="http://www.gsmarena.com/' + query.replace(/\_and\_/gi, '&').replace(/\_tambah\_/gi, '+') + '.php' + '" and ua="Googlebot/2.1 (http://www.googlebot.com/bot.html)"') + '&format=xml&env=store://datatables.org/alltableswithkeys'
        }).done(function(html) {
            var dom = $(html).find("content").text();
			var result = {};
			if($(dom).find('title:eq(0)').text() != '404 Not Found'){
				result['title'] = $(dom).find('h1.specs-phone-name-title:eq(0)').text();
				result['image'] = $(dom).find('div.specs-photo-main:eq(0)').find('img:eq(0)').attr('src');
				$.each($(dom).find('div#specs-list:eq(0)').find('table'), function(i, table) {
					var th = $(table).find('th:eq(0)').text().toLowerCase();
					result[th] = [];
					$.each($(table).find('tr'), function(i, tr) {
						var ttl = $(tr).find('td:eq(0)').text().replace(/\s+/g, '_').toLowerCase();
						var nfo = $(tr).find('td:eq(1)').text();
						var object = {};
						object[ttl] = nfo;
						result[th].push(object);
					});
				});
			}
            callback(result);
        });
	}

}