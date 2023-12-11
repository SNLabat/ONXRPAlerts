// Function to scrape the queue information
function scrapeQueueInfo() {
    // Selecting the element based on the provided class
    const queueInfoElement = document.querySelector("[class*='container'] .MuiTypography-body1");
    if (queueInfoElement) {
        return queueInfoElement.textContent; // e.g., "87 / 742 (197 online)"
    }
    return null;
}

// Continuously check for updates in the queue information
function continuouslyScrapeQueueInfo() {
    let lastScrapedInfo = '';

    setInterval(() => {
        const currentQueueInfo = scrapeQueueInfo();
        // Check if the queue information has changed since the last scrape
        if (currentQueueInfo !== lastScrapedInfo) {
            lastScrapedInfo = currentQueueInfo;

            // Send the updated queue information to the background script
            chrome.runtime.sendMessage({
                type: 'queueInfo',
                data: currentQueueInfo
            });
        }
    }, 5000); // Check every 5 seconds - adjust interval as needed
}

// Start the continuous scraping
continuouslyScrapeQueueInfo();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "refreshQueueInfo") {
        sendQueueInfo(); // Assuming sendQueueInfo is the function that scrapes and sends the queue info
    }
});
