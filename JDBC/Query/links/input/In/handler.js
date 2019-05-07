function handler(In) {
    var UTIL = Java.type("com.swiftmq.impl.streams.comp.jdbc.Util");
    var connection = this.getInputReference("Connection")();
    var statement = subSystemTags(subRefProps(In, this.props["query"]));
    this.executeOutputLink("Out", UTIL.query(stream, connection, statement));

    function subSystemTags(value) {
        var result = value;
        if (result.indexOf("[time]") !== -1)
            result = replaceAll(result, "\\[time\\]", time.currentTime() + "");
        return result;
    }

    function subRefProps(In, value) {
        var result = value;
        In.properties().forEach(function (p) {
            result = replaceAll(result, "\\{" + p.name() + "\\}", p.value().toString());
        });
        return result;
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
}