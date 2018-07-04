(function(window) {

    $type = String;
    $type.__typeName = 'String';
    $type.__class = true;

    $prototype = $type.prototype;
    $prototype.endsWith = function String$endsWith(suffix) {
        return (this.substr(this.length - suffix.length) === suffix);
    }

    
    $prototype.capitalize = function String$capitalize() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
        
    $prototype.startsWith = function String$startsWith(prefix) {
        return (this.substr(0, prefix.length) === prefix);
    }

    $prototype.trim = function String$trim() {
        return this.replace(/^\s+|\s+$/g, '');
    }

    $prototype.trimEnd = function String$trimEnd() {
        return this.replace(/\s+$/, '');
    }

    $prototype.trimStart = function String$trimStart() {
        return this.replace(/^\s+/, '');
    }

    $type.format = function String$format(format, args) {
        return String._toFormattedString(false, arguments);
    }

    $type._toFormattedString = function String$_toFormattedString(useLocale, args) {
        var result = '';
        var format = args[0];

        for (var i = 0; ; ) {

            var open = format.indexOf('{', i);
            var close = format.indexOf('}', i);
            if ((open < 0) && (close < 0)) {
                result += format.slice(i);
                break;
            }
            if ((close > 0) && ((close < open) || (open < 0))) {

                if (format.charAt(close + 1) !== '}') {
                    throw new Error('format stringFormatBraceMismatch');
                }

                result += format.slice(i, close + 1);
                i = close + 2;
                continue;
            }


            result += format.slice(i, open);
            i = open + 1;


            if (format.charAt(i) === '{') {
                result += '{';
                i++;
                continue;
            }

            if (close < 0) throw new Error('format stringFormatBraceMismatch');


            var brace = format.substring(i, close);
            var colonIndex = brace.indexOf(':');
            var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;

            if (isNaN(argNumber)) throw new Error('format stringFormatInvalid');

            var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);

            var arg = args[argNumber];
            if (typeof (arg) === "undefined" || arg === null) {
                arg = '';
            }

            // If it has a toFormattedString method, call it.  Otherwise, call toString()
            if (arg.toFormattedString) {
                result += arg.toFormattedString(argFormat);
            }
            else if (useLocale && arg.localeFormat) {
                result += arg.localeFormat(argFormat);
            }
            else if (arg.format) {
                result += arg.format(argFormat);
            }
            else
                result += arg.toString();

            i = close + 1;
        }

        return result;
    }

})(window);