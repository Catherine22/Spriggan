const HIBP = {
    URL: 'https://haveibeenpwned.com/api/v3/',
    BREACHES: 'breaches/',
};

function showContent(active = true) {
    let content = document.getElementById('content');
    if (active) {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

function updateStatus(dataBreachList) {
    if (dataBreachList.length > 0) {
        showContent();
        let desc = dataBreachList[0].Description;
        let breachDate = dataBreachList[0].BreachDate;
        document.getElementById('breach_date').innerHTML = breachDate;
        document.getElementById('breach_desc').innerHTML = desc;
        document.getElementById('status-trusted').style.display = 'none';
        document.getElementById('status-warning').style.display = 'block';
    } else {
        showContent(false);
        document.getElementById('status-trusted').style.display = 'block';
        document.getElementById('status-warning').style.display = 'none';
    }
}

// GET data breaches by the URL of the current tab
function getDataBreachesByDomain() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let current_url = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!
        if (current_url.substring(0, 4) === 'http') {
            current_url = current_url.replace('://www.', '://');
            let domain = current_url.split('://').pop().split('/')[0];

            const query = new URLSearchParams({ domain: domain }).toString();
            const url = `${HIBP.URL}${HIBP.BREACHES}?${query}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        response.json().then((dataBreachList) => {
                            updateStatus(dataBreachList);
                        });
                    }
                })
                .catch((error) => {
                    alert('Error:', error);
                });
        }
    });
}

getDataBreachesByDomain();
