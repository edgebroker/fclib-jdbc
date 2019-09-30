function handler(In) {
    this.getInputReference("Connection")().connection.commit();
    this.getInputReference("Connection")().checkClosed();
    this.executeOutputLink("Out", In);
}