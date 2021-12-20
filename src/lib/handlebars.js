const { format } = require('timeago.js');

const helper = {};

helper.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helper;