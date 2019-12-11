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
        self.connection.setAutoCommit(self.props["autocommit"]);
        if (self.props["schema"])
            self.connection.setSchema(self.props["schema"]);
        if (self.props["keepaliveselect"])
            self.aliveSQL = self.connection.prepareStatement(self.props["keepaliveselect"]);
    };

    this.checkClosed = function () {
        if (self.connection.isClosed())
            self.create();
    };

    this.checkAlive = function () {
        self.checkClosed();
        if (self.aliveSQL !== null)
            self.aliveSQL.executeQuery();
    };

    this.commit = function () {
        if (self.props["autocommit"] === true)
            throw "Connection is in auto commit state, explicit commit not allowed.";
        self.connection.commit();
    };

    this.rollback = function () {
        if (self.props["autocommit"] === true)
            throw "Connection is in auto commit state, explicit rollback not allowed.";
        self.connection.rollback();
    };

    function execRef() {
        return self;
    }

    if (this.props["createoninit"])
        this.create();

}