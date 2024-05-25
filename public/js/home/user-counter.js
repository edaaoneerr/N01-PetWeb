async function fetchCounts() {
    try {
        const response = await fetch('/get-counts');
        const data = await response.json();
        document.getElementById('online-users-count').textContent = data.onlineCount;
        document.getElementById('visitors-count').textContent = data.visitorCount;
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
}

async function incrementVisitorCount() {
    try {
        await fetch('/increment-visitor', {
            method: 'POST',
        });
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
    }
}

// Increment visitor count and fetch counts every time the page loads
incrementVisitorCount().then(fetchCounts);

// Fetch counts every 5 seconds
setInterval(fetchCounts, 5000);

