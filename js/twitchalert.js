var TwitchAlert = function () {
	this.imgPath = "img/";
	this.iconStatusName = "offline.png";
	this.status = null;
	this.message = "🔴 Psyko LIVE";
	this.apiTwitchUrl = "https://api.twitch.tv/kraken/streams/Psyko_live";
	this.tickRate = 30000;
	this.viewers = 0;
	this.title = null;
	this.liveUrl = "http://twitch.com/Psyko_live";
	this.apiBotUrl = "https://twitchbot-api.azurewebsites.net/v1/";
}

TwitchAlert.prototype.updateExtensionPage = function () {
	this.isOnAir(function (isOnAir, context) {
		if (isOnAir) {
			document.getElementById("title").textContent = context.title;
			document.getElementById("game").textContent = context.game;
			document.getElementById("viewers").textContent = context.viewers;
			document.getElementById("imgGame").style.visibility = 'visible';
			document.getElementById("imgViewers").style.visibility = 'visible';
		}
		else {
			document.getElementById("imgGame").style.visibility = 'hidden';
			document.getElementById("imgViewers").style.visibility = 'hidden';
			document.getElementById("offline").textContent = "Psyko n'est pas en live";
		}
	});

	this.getNews(function (extension) {
		document.getElementById("newsName").textContent = extension.newsName;
		document.getElementById("newsText").textContent = extension.newsText;
	});
}

TwitchAlert.prototype.isOnAir = function (callback) {
	let req = new XMLHttpRequest();
	let streamData = null;
	let channelData = null;

	req.onreadystatechange = function () {
		if (req.readyState != 4 || req.status != 200)
			return;

		let data = JSON.parse(req.responseText);

		if (callback && typeof (callback) === "function") {
			if (data["stream"] !== null) {
				streamData = data["stream"];
				channelData = streamData["channel"];
				this.viewers = streamData.viewers;
				this.game = streamData.game;
				this.title = channelData.status;
			}
			callback(data["stream"] !== null, this);
		}
	}

	req.open("GET", this.apiTwitchUrl, true);
	req.setRequestHeader('Client-ID', 'i8eceqrr9nem1er5xa9yewo11kdq1c');
	req.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
	req.send();
}

TwitchAlert.prototype.setIcon = function (status) {
	chrome.browserAction.setIcon({ path: this.imgPath.concat(status).concat(this.iconStatusName) });
}

TwitchAlert.prototype.openTab = function (notificationId) {
	chrome.tabs.create({
		url: this.liveUrl
	});
}

TwitchAlert.prototype.pushNotification = function (title, message) {
	chrome.browserAction.setIcon({ path: this.imgPath.concat("on").concat(this.iconStatusName) });
	chrome.notifications.create({
		type: "basic",
		iconUrl: this.imgPath.concat("on").concat(this.iconStatusName),
		title: title,
		message: message,
		isClickable: false
	});
}

TwitchAlert.prototype.getNews = function (callback) {
	let req = new XMLHttpRequest();

	req.onreadystatechange = function () {
		if (req.readyState != 4 || req.status != 200)
			return;

		let extension = JSON.parse(req.responseText);

		if (callback && typeof (callback) === "function") {
			callback(extension[0]);
		}
	}

	req.open("GET", this.apiBotUrl.concat("extension").concat("/Psyko_live"), true);
	req.send();
}
