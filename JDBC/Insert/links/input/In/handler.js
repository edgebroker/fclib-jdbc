function handler(In) {
    var self = this;
    if (!this.prepared)
        this.prepared = this.getInputReference("Connection")().prepareStatement(this.statement);

    for (var i = 0; i < this.columnnames.length; i++) {
        convert(i + 1, subSystemTags(subRefProps(In, this.values[i])), this.types[i]);
    }
    try {
        this.prepared.executeUpdate();
    } catch (e) {
        try {
            this.prepared = this.getInputReference("Connection")().prepareStatement(this.statement);
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