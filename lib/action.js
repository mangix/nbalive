/**
 * Module Action
 * commander for Scene
 * */
var Grid = require("term-grid");

var Action = function (prefix) {
    this.actions = {};
    this.prefix = prefix || "/";
    this.parse = this.parse.bind(this);
};

Action.prototype = {
    constructor: Action,
    /**
     * @param name
     * @param params ....
     * @param description
     * @param action
     * */
    add: function () {
        var actionName , action, desc, params = [];
        if (arguments.length < 3) {
            return;
        }

        actionName = arguments[0];
        action = arguments[arguments.length - 1];
        desc = arguments[arguments.length - 2];

        params = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
        if (actionName) {
            this.actions[this.prefix + actionName] = {
                params: params,
                action: action,
                desc: desc
            }
        }
    },
    parse: function (commander) {
        commander = commander.toString();
        if (typeof commander !== "string" || !commander.trim()) {
            return;
        }
        var args = commander.split(/\s/);
        var actionName = args[0];
        var params = args.slice(1);
        if (actionName && actionName in this.actions) {
            var action = this.actions[actionName];
            // match a command
            var param = {};
            var paramNames = action.params;
            paramNames.forEach(function (name, i) {
                param[name] = params[i];
            });
            action.action.call(this, param);
        } else {
            console.error("\033[031munknown command: " + commander + "\033[0m");
            this.info();
        }
    },
    start: function () {
        process.stdin.on("data", this.parse);
        process.stdin.resume();
    },
    stop: function () {
        process.stdin.removeListener("data", this.parse);
    },
    info: function () {
        console.log("\033[031m您可以输入:\033[0m");
        var actions = this.actions;
        var list = [];
        Object.keys(this.actions).forEach(function (action) {
            list.push( [action + " " + actions[action].params.map(function (param) {
                return "{" + param + "}";
            }) , actions[action].desc ]);
        });

        var grid = new Grid(list);
        grid.setColor("yellow");
        grid.draw();

    }
};

module.exports = Action;