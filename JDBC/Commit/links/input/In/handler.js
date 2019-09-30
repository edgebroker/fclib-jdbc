function handler(In) {
    this.getInputReference("Connection")().commit();
    this.getInputReference("Connection")().checkClosed();
    this.executeOutputLink("Out", In);
}