chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "send_notification") {
        chrome.notifications.create('end-page-changed', request.options, function () { });
    }
    if (request.type == "add_page") {
        chrome.storage.sync.get('userName', function (item) {
            fetch('http://universe-game.v6p2dfukmp.us-east-1.elasticbeanstalk.com/api/get_current_game').then(res => res.json())
                .then(res => {
                    console.log("Status " + res.status);
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
    sendResponse();
});