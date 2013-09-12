var moment = require('moment');

module.exports = function(hbs) {

	if (!hbs) return;

	var handlebars = hbs.handlebars;

    hbs.registerHelper('average', function(total, count) {
        return Math.round(total / count * 100) / 100;
    });

    hbs.registerHelper('toNumber', function(number) {
        return number || 0;
    });

    hbs.registerHelper('centsToMoney', function(cents) {
        if (!cents) return '0.00';
        return (cents / 100).toFixed(2)
    });

    hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
        if (arguments.length < 4) {
            // Operator omitted, assuming "+"
            options = rvalue;
            rvalue = operator;
            operator = "+";
        }
            
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
            
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

    hbs.registerHelper("key_value", function(obj, opts) {

        var buffer = "",
            key;
     
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += opts.fn({key: key, value: obj[key]});
            }
        }
     
        return buffer;
    });

    hbs.registerHelper('modulo', function(n, options) {
        var m = parseInt(options.hash.m);
        if((n % m) == 0) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    });

    hbs.registerHelper('formatDate', function(date, opts) {
        if (!date) return '';        
        var toFormat = moment(date),
            format;

        if (typeof opts == 'string') {
            format = opts;
        } else if (opts.hash && opts.hash.format) {
            format = opts.hash.format;
        }
        return toFormat.format(format || 'DD-MM-YYYY hh:mm A');
    });

    hbs.registerHelper('if_eq', function(context, options) {
        if (context == options.hash.compare || (context && options.hash.compare && context.toString() == options.hash.compare.toString()))
            return options.fn(this);
        return options.inverse(this);
    });

    hbs.registerHelper('render', function(template, data) {
        var tpl = handlebars.compile((template.content ? template.content : template || ''));
        return tpl(data);
    });    
}