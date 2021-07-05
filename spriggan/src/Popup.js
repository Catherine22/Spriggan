const ES = {
    URL: 'http://localhost:9200/',
    CMD_SEARCH: '_search',
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
        showContent(true);
        let dataset = dataBreachList[0]._source;
        let desc = dataset.description;
        let breachDate = dataset.breach_date;
        document.getElementById('breach_date').innerHTML = breachDate;
        document.getElementById('breach_desc').innerHTML = desc;
        document.getElementById('status-trusted').style.display = 'none';
        document.getElementById('status-warning').style.display = 'block';
        document.getElementById('status-scanning').style.display = 'none';
    } else {
        showContent(false);
        document.getElementById('status-trusted').style.display = 'block';
        document.getElementById('status-warning').style.display = 'none';
        document.getElementById('status-scanning').style.display = 'none';
    }
}

function getQueryParams(keyword) {
    return JSON.stringify({
        query: {
            match: {
                domain: {
                    query: keyword,
                },
            },
        },
    });
}

// Query data breaches by the URL of the current tab
function getDataBreachesByDomain() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let current_url = tabs[0].url;
        if (current_url.substring(0, 4) === 'http') {
            let domain = current_url.split('://').pop().split('/')[0];

            const url = `${ES.URL}${ES.CMD_SEARCH}`;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: getQueryParams(domain),
                redirect: 'follow',
            };
            fetch(url, requestOptions)
                .then((response) => {
                    if (response.ok) {
                        response.json().then((result) => {
                            updateStatus(result.hits.hits);
                        });
                    }
                })
                .catch((error) => alert('Error', error.toString()));
        } else {
            updateStatus([]);
        }
    });
}

export default getDataBreachesByDomain;
