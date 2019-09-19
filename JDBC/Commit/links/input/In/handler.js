function handler(In) {
    this.getInputReference("Connection")().commit();
    this.executeOutputLink("Out", In);
}