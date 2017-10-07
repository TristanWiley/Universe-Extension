chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "send_notification") {
        chrome.notifications.create('end-page-changed', request.options, function () { });
    }
    sendResponse();
});