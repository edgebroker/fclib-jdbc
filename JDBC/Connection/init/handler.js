function handler() {
    var self = this;
    var DRIVER = Java.type(this.props["driver-classname"]);
    var PROPS = Java.type("java.util.Properties");
    var driver = new DRIVER();
    this.connection;
    this.aliveSQL = null;

    this.setOutputReference("Connection", execRef);

    this.create = function () {
        var properties = new PROPS();
        if (self.props["username"] && self.props["password"]) {
            properties.setProperty("user", self.props["username"]);
            properties.setProperty("password", self.props["password"]);
        }
        self.connection = driver.connect(self.props["url"], properties);
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
        if (!self.connection)
            self.create();
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
        if (!self.connection)
            self.create();
        return self;
    }

    if (this.props["createoninit"])
        this.create();

}