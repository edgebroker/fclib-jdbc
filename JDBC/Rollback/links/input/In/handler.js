function handler(In) {
    var connection = this.getInputReference("Connection")().commit();
    connection.checkClosed();
    this.executeOutputLink("Out", In);
}