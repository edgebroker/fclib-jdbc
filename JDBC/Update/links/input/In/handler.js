function handler(In) {
    var self = this;
    var connection = this.getInputReference("Connection")().connection;
    this.getInputReference("Connection")().checkClosed();
    var currentStatement = this.statement;
    if (this.props["condition"]) {
        currentStatement += " where " + subSystemTags(subRefProps(In, this.props["condition"]));
    }
    this.prepared = connection.prepareStatement(currentStatement);

    for (var i = 0; i < this.columns.length; i++) {
        var type = this.columns[i]["type"];
        var value = this.columns[i]["value"];
        convert(i + 1, subSystemTags(subRefProps(In, value)), type);
    }

    this.prepared.executeUpdate();
    this.prepared.close();

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

    function convert(columnNumber, value, type) {
        switch (type) {
            case 'boolean':
                self.prepared.setBoolean(columnNumber, new self.BOOLEAN(value));
                break;
            case 'string':
                self.prepared.setString(columnNumber, value);
                break;
            case 'integer':
                self.prepared.setInt(columnNumber, new self.INTEGER(value));
                break;
            case 'long':
                self.prepared.setLong(columnNumber, new self.LONG(value));
                break;
            case 'double':
                self.prepared.setDouble(columnNumber, new self.DOUBLE(value));
                break;
            case 'float':
                self.prepared.setFloat(columnNumber, new self.FLOAT(value));
                break;
        }
    }

}