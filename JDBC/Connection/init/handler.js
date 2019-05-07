function handler() {
    var self = this;
    this.Driver = Java.type(this.props["driver-classname"]);
    this.DriverManager = Java.type("java.sql.DriverManager");
    this.connection;
    this.aliveSQL = null;

    this.setOutputReference("Connection", execRef);

    this.create = function () {
        if (self.props["username"])
            self.connection = self.DriverManager.getConnection(self.props["url"]);
        else
            self.connection = self.DriverManager.getConnection(self.props["url"], self.props["username"], self.props["password"]);
        if (self.props["schema"])
            self.connection.setSchema(self.props["schema"]);
        if (self.props["keepaliveselect"])
            self.aliveSQL = self.connection.prepareStatement(self.props["keepaliveselect"]);
    };

    this.checkAlive = function () {
        if (self.connection.isClosed())
            self.create();
        if (self.aliveSQL === null)
            self.aliveSQL.executeQuery().close();
    };

    function execRef() {
        return self.connection;
    }

    if (this.props["createoninit"])
        this.create();

}