window.addEventListener("keydown",function (e) {
    if (e.keyCode === 114 || ((e.ctrlKey || e.metaKey) && e.keyCode === 70)) { 
        e.preventDefault();
    }
})

chrome.storage.sync.get('gameInProgress', function (item) {
    if (item.gameInProgress == true) {
        $('head').append('<link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">');
        $('.mw-wiki-logo').attr('href', '#');
        $('#mw-head').remove();
        // $('#mw-page-base').remove();
        $('#coordinates').remove();
        $('.metadata').remove();
        $(".portal").remove();
        $(".sistersitebox").remove();
        $("#footer").remove();
        $('#catlinks').click(function (e) {
            e.preventDefault();
        });
        displayScoreboard();
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "polling") {
        // console.log("DANK");
    }
});

//Detect player win
chrome.storage.sync.get('endPageTitle', function (item) {
    if (item.endPageTitle == $("#firstHeading").text()) {
        for (var i = 0; i < 15; i++) {
            var left = (Math.floor(Math.random() * 80) + 0) + -10;
            $('body').prepend('<img class="solitareCard" src="https://i.imgur.com/67gOiNZ.png" style="width: 110px; position: absolute; top: -549px; z-index: 100; left: ' + left + '%;""></img>')
        }
        $('.solitareCard').solitaireVictory();
    }
});

chrome.runtime.sendMessage({
    type: "add_page", page: $("#firstHeading").text()
});

/* Listener for dialog stuff
 * When the inputs change and the start or end page change, do something.
 * if startPage changes, confirm they want to and change the page.
 * if endPage changes 
 */
chrome.storage.onChanged.addListener(function (changes) {
    console.log(changes["startPage"]);
    for (key in changes) {
        if (key == "endPageTitle") {
            var notifMessage = "You are now going to " + changes[key].newValue;

            chrome.runtime.sendMessage({
                type: "send_notification", options: {
                    type: "basic",
                    iconUrl: "https://en.wikipedia.org/static/images/project-logos/enwiki.png",
                    title: "The end page has been changed.",
                    message: notifMessage
                }
            });
        }
    }
});

function displayScoreboard() {
    chrome.storage.sync.get('userName', function (name) {
        fetch('https://cors.now.sh/http://universe-game.v6p2dfukmp.us-east-1.elasticbeanstalk.com/api/get_current_game').then(res => res.json())
            .then(res => {
                var json = res.status
                var players = json.players;

                var wrapper = '<div class="wikihunt__wrapper">'
                wrapper = wrapper + '<img class="wikihunt__logo_img" src="https://i.imgur.com/67gOiNZ.png" /><h3 class="wikihunt wikihunt__logo">WikiHunt</h3><div class="wikihunt wikihunt__label">Your page history</div>';
                wrapper = wrapper + '<ol class="wikihunt wikihunt__history">';
                json.players[name.userName].forEach(function (elem) {
                    wrapper = wrapper + '<li>' + elem + '</li>';
                }, this);
                wrapper = wrapper + '</ol>';
                $('#mw-panel').append(wrapper + '</div>');
                // $('#mw-head-base').append("<marquee id='playersMarquee'></marquee>");
                // for (key of Object.keys(players)) {
                //     var entries = players[key];
                //     $('#playersMarquee').append(key + " is on page <span style=\"text-decoration=underlined;text-decoration: underline;\">" + entries[entries.length - 1] + "</span>     |     ");
                // }
            });
    });
}