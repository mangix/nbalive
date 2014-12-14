#!/usr/bin/env node
var program = require('commander');
var util = require("../lib/util");

var defaultDate = util.format(new Date());

program
    .version('1.0.0')
    .option('-d, --date [date]', 'choose date', checkDate)
    .parse(process.argv);

var live = require("../lib/live");

live("hupu", program.date || defaultDate);


function checkDate(aDate) {
    if (/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(aDate)) {
        return util.format(new Date(aDate));
    } else {
        return defaultDate;
    }

}