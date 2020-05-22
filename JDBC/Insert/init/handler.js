function handler() {
    this.columns = this.props["columns"];

    for (var i = 0; i < this.columns.length; i++) {
        var type = this.columns[i]["type"];
        if (!(type === 'boolean' || type === 'string' || type === 'integer' || type === 'long' || type === 'double' || type === 'float'))
            throw "Invalid column type: " + type;
    }

    this.statement = "insert into " + this.props["tablename"] + " (" + createColumns(this.columns) + ") values (" + questionMarks(this.columns.length) + ")";

    function createColumns(cols) {
        var result = "";
        for (var i = 0; i < cols.length; i++) {
            if (i > 0)
                result += ", ";
            var name = cols[i]["name"];
            result += name;
        }
        return result;
    }

    function questionMarks(n) {
        var result = "";
        for (var i = 0; i < n; i++) {
            if (i > 0)
                result += ", ";
            result += "?";
        }
        return result;
    }
}