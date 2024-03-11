const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config/config.json')

let parseContributionDayinLastMonth = (user) => {
    let url = 'https://github.com/' + user;
    const headers = {
        cookie: `tz=Asia%2FSeoul; user_session=${config.user_session};`
    }
    let $conts = [];
    let today = new Date().toLocaleDateString('en-US').split('/');
    let lastMonth = {
        'year': (parseInt(today[2]) - (today[0] === '1')).toString(),
        'month': (parseInt(today[0]) - 1 + 12 * (today[0] === '1')).toString()
    };
    let contributionDay = 0;

    return axios({
        url: url,
        method: 'get',
        headers: headers
    })
    .then((res) => {
        const $ = cheerio.load(res.data);
        $('svg.js-calendar-graph-svg>g>g>rect').each((index, item) => {
            $conts.push({
                "year": item.attribs['data-date'].substring(0, 4),
                "month": item.attribs['data-date'].substring(5, 7).replace('0', ''),
                "count": item.attribs['data-count']
            });
        });
    })
    .then(() => {
        for (let i in $conts) {
            if ($conts[i].year === lastMonth.year &&
                $conts[i].month === lastMonth.month &&
                $conts[i].count !== '0') {
                contributionDay++;
            }
        }
        return contributionDay;
    })
    .catch((err) => {
        // console.error(err);
        return 'Invalid Github ID';
    });
}

let parseCommitinLastMonth = (user) => {
    const headers = {
        cookie: `tz=Asia%2FSeoul; user_session=${config.user_session};`
    }
    let today = new Date().toLocaleDateString('en-US').split('/');
    let lastMonth = {
        'year': (parseInt(today[2]) - (today[0] === '1')).toString(),
        'month': (parseInt(today[0]) - 1 + 12 * (today[0] === '1')).toString(),
    };
    if (lastMonth.month.length === 1) {
        lastMonth.month = '0' + lastMonth.month;
    }
    lastMonth.date = new Date(lastMonth.year, lastMonth.month, 0).getDate().toString();
    let url = `https://github.com/${user}?tab=overview&from=${lastMonth.year}-${lastMonth.month}-01&to=${lastMonth.year}-${lastMonth.month}-${lastMonth.date}`;
    let commits;

    return axios({
        url: url,
        method: 'get',
        headers: headers
    })
    .then((res) => {
        const $ = cheerio.load(res.data);
        let $commits = $('.color-text-primary').filter('.ws-normal').filter('.text-left');
        if ($commits.html() === null || $commits.html().includes('commit') === false) {
            return '0\n';
        }
        let $commitMessage = $commits.html().split(' ').reduce((pre, val) => {
            if (val !== '')
            pre.push(val);
            return pre;
        }, []);
        commits = $commitMessage[2];
        return commits;
    })
    .catch((err) => {
        // console.error(err);
        return 'Invalid Github ID\n';
    });
}

parseCommitinLastMonth('nant0313');

module.exports = {
    parseContributionDayinLastMonth,
    parseCommitinLastMonth
};