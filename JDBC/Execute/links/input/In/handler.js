function handler(In) {
    var UTIL = Java.type("com.swiftmq.impl.streams.comp.jdbc.Util");
    var connection = this.getInputReference("Connection")().connection;
    this.getInputReference("Connection")().checkClosed();
    var sql = subSystemTags(subRefProps(In, this.props["statement"]));
    var stmt = connection.createStatement();
    stmt.execute(sql);
    stmt.close();
    this.executeOutputLink("Out", In);

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