function handler(In) {
    this.getInputReference("Connection")().close();
    this.executeOutputLink("Out", In);
}