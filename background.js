let userPositions = [];
let currentQueueInfo = '';
let previousQueueInfo = '';

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
    if (currentQueueInfo) {
        if (currentQueueInfo.includes("Connect") && !previousQueueInfo.includes("Connect")) {
            sendConnectNotification();
        }
        previousQueueInfo = currentQueueInfo;

        const [position, total] = currentQueueInfo.split('/').map(num => num.trim());
        userPositions.forEach((positionObj, index) => {
            if (parseInt(position) <= parseInt(positionObj.position) && !positionObj.notified) {
                sendNotification(positionObj.position);
                userPositions[index].notified = true;
                saveUpdatedPositions(); // Save the updated state
            }
        });

        chrome.action.setBadgeText({ text: position });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

function sendNotification(position) {
    let notificationId = 'position_' + position;
    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'Queue Alert',
        message: `Your position is now ${position} or better!`
    });
}

function sendConnectNotification() {
    let notificationId = 'connect_notification';
    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'Connect Now!',
        message: 'You can connect to ONX RP! You have 15 minutes or your position will reset!'
    });
}

function sendQueueInfoToPopup(callback) {
    callback(currentQueueInfo);
}

chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.tabs.create({ url: "https://onx.gg" });
});

chrome.storage.local.get({ positions: [] }, function(data) {
    userPositions = data.positions;
});

function saveUpdatedPositions() {
    chrome.storage.local.set({ positions: userPositions });
}
