document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('startPage', function (item) {
        var startPage = document.getElementById('startPage');
        startPage.value = item.startPage;
    });

    chrome.storage.sync.get('endPage', function (item) {
        var endPage = document.getElementById('endPage');
        endPage.value = item.endPage;
    });

    document.getElementById("startGame").onclick = function() {
        chrome.storage.sync.set({ 'startPage': document.getElementById("startPage").value }, function () { });
        chrome.storage.sync.set({ 'endPage': document.getElementById("endPage").value }, function () { });
    }
});

