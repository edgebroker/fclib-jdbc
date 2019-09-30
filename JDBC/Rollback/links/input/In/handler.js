function handler(In) {
    var connection = this.getInputReference("Connection")().connection.commit();
    this.getInputReference("Connection")().checkClosed();
    this.executeOutputLink("Out", In);
}