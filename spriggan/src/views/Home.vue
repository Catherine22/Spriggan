<template>
    <div id="home">
        <header class="header">
            <h1
                v-if="isDataLoaded"
                class="status"
                :style="{ color: status ? status[severity].color : '#222222' }"
            >
                {{ status[severity].title }}
            </h1>
            <h1 c-else class="status">Loading...</h1>
        </header>
        <div class="content">
            <div v-if="isDataLoaded">
                Breach date: <a class="breach_date">{{ breachDate }}</a>
            </div>
            <div class="breach_desc">{{ desc }}</div>
        </div>
    </div>
</template>

<script>
export default {
    el: '#home',
    props: {
        APIs: {
            URL: 'http://localhost:9200/',
            CMD_SEARCH: '_search'
        },
        status: [
            {
                title: 'Trusted',
                color: '#37beb0'
            },
            {
                title: 'Warning',
                color: '#f9d342'
            },
            {
                title: 'Warning',
                color: '#e7625f'
            }
        ]
    },
    data: function() {
        return {
            isDataLoaded: false,
            title: '',
            breachDate: '',
            severity: '',
            desc: ''
        };
    },
    methods: {
        getQueryParams(keyword) {
            return JSON.stringify({
                query: {
                    match: {
                        domain: {
                            query: keyword
                        }
                    }
                }
            });
        },
        clearMessages(error = '') {
            this.isDataLoaded = false;
            this.title = '';
            this.breachDate = '';
            this.severity = 0;
            this.desc = error;
        },
        queryDataBreaches() {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
                let current_url = tabs[0].url;
                if (current_url.substring(0, 4) === 'http') {
                    let domain = current_url
                        .split('://')
                        .pop()
                        .split('/')[0];
                    let url = `${this.APIs.ES.URL}${this.APIs.ES.CMD_SEARCH}`;
                    let requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: this.getQueryParams(domain),
                        redirect: 'follow'
                    };
                    fetch(url, requestOptions)
                        .then(response => {
                            if (response.ok) {
                                response.json().then(result => {
                                    let dataBreachList = result.hits.hits;
                                    if (dataBreachList.length > 0) {
                                        let dataset = dataBreachList[0]._source;
                                        let desc = dataset.description;
                                        let breachDate = dataset.breach_date;
                                        let severity = dataset.severity;

                                        this.isDataLoaded = true;
                                        this.title = '';
                                        this.breachDate = breachDate;
                                        this.severity = severity;
                                        this.desc = desc;

                                        alert(desc);
                                    } else {
                                        this.clearMessages();
                                    }
                                });
                            }
                        })
                        .catch(error => {
                            this.clearMessages(error.toString());
                        });
                } else {
                    this.clearMessages();
                }
            });
        }
    },
    mounted() {
        this.queryDataBreaches();
    }
};
</script>

<style>
#home {
}

.status {
    color: #222222;
    font-size: 32px;
}

.content {
    font-size: 16px;
    line-height: normal;
    padding-top: 8px;
}
</style>
