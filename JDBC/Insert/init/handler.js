function handler() {
    this.columnnames = this.props["columnnames"];
    this.types = this.props["types"];
    this.values = this.props["values"];
    this.BOOLEAN = Java.type("java.lang.Boolean");
    this.INTEGER = Java.type("java.lang.Integer");
    this.LONG = Java.type("java.lang.Long");
    this.DOUBLE = Java.type("java.lang.Double");
    this.FLOAT = Java.type("java.lang.Float");

    if (this.columnnames.length !== this.types.length || this.columnnames.length !== this.values.length)
        throw "Invalid number of entries for types or values";

    for (var i = 0; i < this.types.length; i++) {
        var t = this.types[i];
        if (!(t === 'boolean' || t === 'string' || t === 'integer' || t === 'long' || t === 'double' || t === 'float'))
            throw "Invalid column type: " + t;
    }

    this.statement = "insert into " + this.props["tablename"] + " (" + createColumns(this.columnnames) + ") values (" + questionMarks(this.columnnames.length) + ")";

    function createColumns(cols) {
        var result = "";
        for (var i = 0; i < cols.length; i++) {
            if (i > 0)
                result += ", ";
            result += cols[i];
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