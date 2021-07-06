import React, { useEffect, useState } from 'react';
import { ES, STATUS } from './constants';
import './app.css';

function App() {
    const [desc, setDesc] = useState('');
    const [breachDate, setBreachDate] = useState('');
    const [severity, setSeverity] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Query data breaches by the URL of the current tab
        chrome.tabs &&
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                let current_url = tabs[0].url;
                if (current_url.substring(0, 4) === 'http') {
                    let domain = current_url.split('://').pop().split('/')[0];
                    let url = `${ES.URL}${ES.CMD_SEARCH}`;
                    let requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: getQueryParams(domain),
                        redirect: 'follow'
                    };
                    fetch(url, requestOptions)
                        .then(response => {
                            if (response.ok) {
                                response.json().then(result => {
                                    let dataBreachList = result.hits.hits;
                                    if (dataBreachList.length > 0) {
                                        // showContent(true);
                                        let dataset = dataBreachList[0]._source;
                                        let desc = dataset.description;
                                        let breachDate = dataset.breach_date;
                                        let severity = dataset.severity;

                                        setDesc(desc);
                                        setBreachDate(breachDate);
                                        setSeverity(severity);
                                    } else {
                                        setDesc('');
                                        setBreachDate('');
                                        setSeverity(0);
                                    }
                                });
                            }
                        })
                        .catch(error => {
                            setDesc(error);
                            setBreachDate('');
                            setSeverity(0);
                        });
                } else {
                    setDesc('');
                    setBreachDate('');
                    setSeverity(0);
                }
            });
    }, []);

    let styles = {
        title: {
            color: STATUS[severity].color
        }
    };

    return (
        <div className="App">
            <header className="header">
                <h1 className="title" style={styles.title}>
                    {STATUS[severity].title}
                </h1>
            </header>
            <body className="content">
                {breachDate.length > 0 ? (
                    <div className="item">
                        Breach date: <a className="breachDate">{breachDate}</a>
                    </div>
                ) : null}
                <div className="breachDesc">{desc}</div>
            </body>
        </div>
    );
}

function getQueryParams(keyword) {
    return JSON.stringify({
        query: {
            match: {
                domain: {
                    query: keyword
                }
            }
        }
    });
}

export default App;
