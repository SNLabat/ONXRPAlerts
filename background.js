let userPositions = [];
let currentQueueInfo = '';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'queueInfo') {
        currentQueueInfo = request.data;
        checkForAlert();
    } else if (request.type === 'updatePositions') {
        chrome.storage.local.get({ positions: [] }, function(data) {
            userPositions = data.positions;
        });
    } else if (request.type === 'getQueueInfo') {
        sendQueueInfoToPopup(sendResponse);
        return true; // Asynchronous response
    }
});

function checkForAlert() {
    let notificationCount = 0;

    if (currentQueueInfo) {
        const [position, total] = currentQueueInfo.split('/').map(num => num.trim());
        userPositions.forEach((positionObj, index) => {
            if (parseInt(position) <= parseInt(positionObj.position) && !positionObj.notified) {
                sendNotification(positionObj.position);
                userPositions[index].notified = true;
                notificationCount++;
            }
        });
    }

    if (notificationCount > 0) {
        chrome.browserAction.setBadgeText({ text: notificationCount.toString() });
    } else {
        chrome.browserAction.setBadgeText({ text: '' }); // Clear badge
    }
}

function sendNotification(position) {
    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'Queue Alert',
        message: `Your position is now ${position} or better!`
    });
}

function sendQueueInfoToPopup(callback) {
    callback(currentQueueInfo);
}

chrome.storage.local.get({ positions: [] }, function(data) {
    userPositions = data.positions;
});
