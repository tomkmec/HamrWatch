var debug = false;

var period = 10 *60*1000;
var watching = ['Braník','Badminton'];
var watched = [
	{
		days: ['Po', 'Út', 'St', 'Čt'],
		cells: [[20,21], [21,22], [22,23]]
	}
]

window.message='(inicializace)';

watch()

function watch() {

	read()

	if (debug) {
		console.log('period: ' + localStorage["period"]);
	}
	setTimeout(watch, period)
}

function read() {
	$.get(
		"http://hodiny.hamrsport.cz/Login.aspx?r=NOTLOGGED",
		function(data,status,jqXHR) {
			parse(data)
		},
		"html"
	)
}

function parse(data) {
	var $d = $(data.substring(data.indexOf('<html')));
	var timeColMap = {}, colTimeMap = {};
	$d.find('#rgTable .rg-header td:parent').each(function() {
		var col = $(this).attr('id').split('_')[1];
		var time = $(this).text();
		timeColMap[time] = col; colTimeMap[col] = time
	})

	var loc = $d.find('#ctl00_workspace_ddlLocality option:selected').text();
	var sport = $d.find('#ctl00_workspace_ddlSport option:selected').text();

	if (watching[0]!=loc || watching[1]!=sport) {
		report(false, "očekávám "+watching[0]+"/"+watching[1]+", ale dostávám "+loc+"/"+sport)
	} else {
		var matches = [];

		$.each(watched,function(i,w) {

			$d
				.find('#rgTable .rg-row')
				.filter(function() {return startsWith($('td',this).first().text(), w.days)})
				.each(function() {
					for (var i=0; i<w.cells.length; i++) {
						if (freeTimes($(this), w.cells[i])) matches.push($('td',this).first().text() + ' ' + colTimeMap[w.cells[i][0]])
					}
				})
		})

		report(matches.length, matches.join('<br>'));
	}

}

function freeTimes($tr, cols) {
	var free = $tr.find('td.rg-item').filter(function() {
		return cols.indexOf(parseInt($(this).attr('id').split('_')[2]))>-1 && parseInt($(this).attr('prms').split('_')[0])>0
	}).size();

	return free==cols.length;
}


function startsWith(text, arr) {
	for (var i=0; i<arr.length; i++) if (text.indexOf(arr[i]) === 0) return true;
	return false;
}

function report(result, message) {
	chrome.browserAction.setBadgeText({text: (result===false? "!" : ''+result)})
	window.message = message;
}
