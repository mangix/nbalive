#!/usr/bin/env node
var args = process.argv;
var date = args[2];

var live = require("../lib/live");

live("hupu", date);