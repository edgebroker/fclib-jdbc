function handler(In) {
    var self = this;
    this.getInputReference("Connection")().checkClosed();
    if (!this.prepared)
        this.prepared = this.getInputReference("Connection")().connection.prepareStatement(this.statement);

    for (var i = 0; i < this.columns.length; i++) {
        var type = this.columns[i]["type"];
        var value = this.columns[i]["value"];
        convert(i + 1, subSystemTags(subRefProps(In, value)), type);
    }

    try {
        this.prepared.executeUpdate();
    } catch (e) {
        try {
            this.prepared = this.getInputReference("Connection")().connection.prepareStatement(this.statement);
        } catch (e) {
        }
        throw e;
    }

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
                self.prepared.setBoolean(columnNumber, typeconvert.toBoolean(value));
                break;
            case 'string':
                self.prepared.setString(columnNumber, value);
                break;
            case 'integer':
                self.prepared.setInt(columnNumber, typeconvert.toInteger(value));
                break;
            case 'long':
                self.prepared.setLong(columnNumber, typeconvert.toLong(value));
                break;
            case 'double':
                self.prepared.setDouble(columnNumber, typeconvert.toDouble(value));
                break;
            case 'float':
                self.prepared.setFloat(columnNumber, typeconvert.toFloat(value));
                break;
        }
    }

}