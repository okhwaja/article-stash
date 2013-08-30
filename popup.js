document.addEventListener('DOMContentLoaded', function () {
	getLinks();
	initButtonEvents();
})
function getLinks() {
	chrome.runtime.sendMessage({method: "getLinks"}, function(response) {
		processLinks(response);
	})
}
function processLinks(items) {
	var l = items.length;
	if (l <= 0) return;
	var table = $('#links');
	for (var i = 0; i < l; i++) {
		var li = items[i]; 
		table.append("<tr data-id='" + li.num + "'> \
						<td> \
							<img class='fav' height='32' width='32' src='" + li.fav + "'> \
						</td> \
						<td class='lnk'> \
							<a href='" + li.url + "'>" + li.title + "</a> \
						</td> \
						<td> \
							<button class='cls'>&times</button> \
						</td> \
					</tr>")
	}
	table.find('button.cls').click(function(e) {
		e.stopPropagation();
		var tr = $(this).parents('tr');
		tr.fadeOut(200, function() {
			tr.remove();
			chrome.runtime.sendMessage({method: 'removeLink', num: tr.data('id')});
		});
	});
	table.find('tr').click(function() {
		var tr = $(this);
		tr.fadeOut(200, function() {
			chrome.runtime.sendMessage({method: 'openLink', num: tr.data('id')}, function() {
				window.close();
			});
		})
	});
}
function initButtonEvents() {
	$('#clear').click(function() {
		$('#links').find('tr').fadeOut(200).remove();
		chrome.runtime.sendMessage({method: 'clearLinks'});
	});
	$('#random').click(function() {
		chrome.runtime.sendMessage({method: 'randomLink'}, function() {
			window.close();
		});
	});
	$('#add').click(function() {
		chrome.runtime.sendMessage({method: 'saveLink'}, function() {
			window.close();
		})
	})
}