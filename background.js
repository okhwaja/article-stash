var controller = function() {
	var links = [];
	var count = 0;
	var init = function() {
		initEvents();
		updateBadge();
	}
	var initEvents = function() {
		chrome.commands.onCommand.addListener(function(command) {
			if (command == "save") {
				saveLink();
			} else if (command == "random") {
				createTab(Math.floor(Math.random() * links.length));
			}
		});

		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
			if (message.method == "getLinks") {
				sendResponse(links);
			} else if (message.method == "removeLink") {
				var id = message.num;
				for (var i = 0; i < links.length; i++) {
					if (links[i].num == id) {
						links.splice(i, 1);
						updateBadge();
						break;
					}
				}
			} else if (message.method == 'openLink') {
				var id = message.num;
				for (var i = 0; i < links.length; i++) {
					if (links[i].num == id) {
						createTab(i);
						break;
					}
				}
				sendResponse();
			} else if (message.method == 'saveLink') {
				saveLink();
				sendResponse();
			} else if (message.method == 'clearLinks') {
				links = [];
				updateBadge();
			} else if (message.method == 'randomLink') {
				if (links.length == 0) return;
				createTab(Math.floor(Math.random() * links.length))
				sendResponse();
			}
		});
	}
	var saveLink = function() {
		chrome.tabs.query({'active': true, 'currentWindow': true}, function (tab) {
			if (tab == undefined || tab.length == 0) return;
			var added = {
				url: tab[0].url,
				title: tab[0].title,
				num: ++count
			};
			tab[0].favIconUrl == undefined ? added.fav = 'article-icon.png' : added.fav = tab[0].favIconUrl;
			links.push(added);
			updateBadge();
		});
	}
	var updateBadge = function() {
		var l = links.length;
		if (l > 0) {
			chrome.browserAction.setBadgeText({text: "" + l});
		} else {
			chrome.browserAction.setBadgeText({text: ""});
		}
		
	}
	var createTab = function(index) {
		chrome.tabs.create({url: links[index].url, active: true}, function(tab) {
			links.splice(index, 1);
			updateBadge();
		});
	}
	init();
}

document.addEventListener('DOMContentLoaded', function () {
	controller();
});
