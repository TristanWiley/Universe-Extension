window.onload=function(){    
    chrome.storage.sync.get('endPage', function (item) {
        if(item.endPage == window.location.href){
            alert("YO BRO U WON");
        }
    });
}

/* Listener for dialog stuff
 * When the inputs change and the start or end page change, do something.
 * if startPage changes, confirm they want to and change the page.
 * if endPage changes 
 */

chrome.storage.onChanged.addListener(function (changes) {
    for (key in changes) {
        if(key == "startPage"){
            if(confirm("You're about to change your start page, you sure you want to do that?")){
                window.location.href = changes[key].newValue;                
            }
        }else if(key == "endPage"){
            var notifMessage = "You are now going to " + getTitle(changes[key].newValue);
            
              chrome.runtime.sendMessage({type: "send_notification", options: {
                  type: "basic",
                  iconUrl: "https://en.wikipedia.org/static/images/project-logos/enwiki.png",
                  title: "The end page has been changed.",
                  message: notifMessage
              }});
            
        }
    }
});

//Get title from Wikipedia url
function getTitle(url){
    console.log();
    return url.split("/wiki/")[1].replace(/_/g, " ");
}