var interval;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "send_notification") {
        chrome.notifications.create('end-page-changed', request.options, function () { });
    }
    if (request.type == "add_page") {
        chrome.storage.sync.get('userName', function (item) {
            fetch('http://universe-game.v6p2dfukmp.us-east-1.elasticbeanstalk.com/api/get_current_game').then(res => res.json())
                .then(res => {
                    var siteList = res.status.players[item.userName];
                    if (siteList[siteList.length - 1] != request.page && request.page != "") {
                        fetch('http://universe-game.v6p2dfukmp.us-east-1.elasticbeanstalk.com/api/submit_update', {
                            method: 'post',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ name: item.userName, page: request.page })
                        }).then(res => res.json())
                            .then(res => console.log(res));
                    }
                });
        });
    }
    if (request.type == "start_game"){
        interval = setInterval(checkIfSomeoneWon, 1000);        
    }
    sendResponse();
});

function checkIfSomeoneWon() {
    chrome.storage.sync.get(['endPageTitle', 'userName'], function (item) {
        fetch('http://universe-game.v6p2dfukmp.us-east-1.elasticbeanstalk.com/api/get_current_game').then(res => res.json())
            .then(res => {
                var json = res.status;
                var players = json.players;
                var winner = "";
                for (key of Object.keys(players)) {
                    var entries = players[key];
                    var latest = entries[entries.length - 1];
                    // console.log(item.endPageTitle);
                    if (latest == item.endPageTitle) {
                        winner = key;
                    }
                }
                if (winner != "" && winner == item.userName) {
                    chrome.notifications.create('game_won', { type: "basic", iconUrl: "https://en.wikipedia.org/static/images/project-logos/enwiki.png", title: "Game won", message: "Congratulations! You won the game!" }, function () { });
                    clearInterval(interval);
                } else if (winner != "") {
                    chrome.notifications.create('game_lost', { type: "basic", iconUrl: "https://en.wikipedia.org/static/images/project-logos/enwiki.png", title: "Game lost", message: "Darn, you lost the game!" }, function () { });
                    clearInterval(interval);
                }
            });
    });
}