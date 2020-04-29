chrome.storage.local.set({'live' : false});
window.TwitchAlert = new TwitchAlert();

chrome.storage.local.get(['live'],function(res)
{
	setInterval(function(){
		TwitchAlert.isOnAir(function(isOnAir, context) {
			if (isOnAir && !res.live)
			{
				TwitchAlert.pushNotification(TwitchAlert.message, context.title);
				TwitchAlert.setIcon("on");
				chrome.browserAction.setBadgeText({text: "On"});
				chrome.browserAction.setBadgeBackgroundColor({color: "green"});
				res.live = true;
			}
			else if (!isOnAir)
			{
				TwitchAlert.setIcon("off");
				chrome.browserAction.setBadgeText({text: "Off"});
				chrome.browserAction.setBadgeBackgroundColor({color: "red"});
				res.live = false;
			}
		});
	}, TwitchAlert.tickRate);
});
