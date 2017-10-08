chrome.storage.sync.get('gameInProgress', function (item) {
    if (item.gameInProgress == true) {
        $('#mw-head').remove();
        $(".portal").remove();
        $('#catlinks').click(function (e) {
            e.preventDefault();
        });
        displayScoreboard();
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "polling") {
        console.log("DANK");
    }
});

//Detect player win
chrome.storage.sync.get('endPageTitle', function (item) {
    if (item.endPageTitle == $("#firstHeading").text()) {
        overlayConfetti();
    }
});

chrome.runtime.sendMessage({
    type: "add_page", page: $("#firstHeading").text()
});
console.log($("#firstHeading").text());

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
                $("#mw-panel").append("<br><br><h4>Current Pages: " + json.players[name.userName].length + "</h4>");
                $('#mw-head-base').append("<marquee id='playersMarquee'></marquee>");
                for (key of Object.keys(players)) {
                    var entries = players[key];
                    $('#playersMarquee').append(key + " is on page <span style=\"text-decoration=underlined;text-decoration: underline;\">" + entries[entries.length - 1] + "</span>     |     ");
                }
            });
    });
}