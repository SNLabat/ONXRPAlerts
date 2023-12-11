// Function to add a new position to the monitoring list
function addPosition() {
    var newPosition = document.getElementById('new-position').value;
    if (newPosition) {
        chrome.storage.local.get({ positions: [] }, function(data) {
            var positions = data.positions;
            var newPositionObj = { position: newPosition, notified: false };
            positions.push(newPositionObj);
            chrome.storage.local.set({ positions: positions }, function() {
                var li = document.createElement('li');
                li.classList.add('positions-list-item'); 

                var textSpan = document.createElement('span');
                textSpan.textContent = newPosition;

                var removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.style.padding = '5px 10px';
                removeButton.style.fontSize = '1em';
                removeButton.onclick = function() {
                    removePosition(newPosition, li);
                };

                li.appendChild(textSpan);
                li.appendChild(removeButton);
                document.getElementById('positions-list').appendChild(li);
            });
        });
    }
}

document.getElementById('add-position').addEventListener('click', addPosition);

// Function to load and display already stored positions
function loadStoredPositions() {
    chrome.storage.local.get({ positions: [] }, function(data) {
        data.positions.forEach(function(positionObj) {
            var li = document.createElement('li');
            li.classList.add('positions-list-item');

            var textSpan = document.createElement('span');
            textSpan.textContent = positionObj.position;

            var removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.style.padding = '5px 10px';
            removeButton.style.fontSize = '1em';
            removeButton.onclick = function() {
                removePosition(positionObj.position, li);
            };

            li.appendChild(textSpan);
            li.appendChild(removeButton);
            document.getElementById('positions-list').appendChild(li);
        });
    });
}

loadStoredPositions();

// Function to remove a position
function removePosition(position, liElement) {
    chrome.storage.local.get({ positions: [] }, function(data) {
        var positions = data.positions;
        var positionIndex = positions.findIndex(p => p.position === position);
        if (positionIndex > -1) {
            positions.splice(positionIndex, 1);
            chrome.storage.local.set({ positions: positions }, function() {
                liElement.remove();
            });
        }
    });
}

// Function to request and display the queue info
function requestQueueInfo() {
    chrome.runtime.sendMessage({ type: 'getQueueInfo' }, function(response) {
        if (response) {
            document.querySelector('.queue-info').textContent = response;
        }
    });
}

// Update queue info when the popup is opened
requestQueueInfo();

// Optional: Continuous update while popup is open
setInterval(requestQueueInfo, 5000);
