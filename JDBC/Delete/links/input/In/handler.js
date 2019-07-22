function handler(In) {
    var connection = this.getInputReference("Connection")();
    var statement = "delete from " + this.props["tablename"];
    if (this.props["condition"]) {
        statement += " where " + subSystemTags(subRefProps(In, this.props["condition"]));
    }
    var prepared = connection.prepareStatement(statement);
    prepared.executeUpdate();
    prepared.close();

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
}