function handler(In) {
    this.getInputReference("Connection")().connection.close();
    this.executeOutputLink("Out", In);
}