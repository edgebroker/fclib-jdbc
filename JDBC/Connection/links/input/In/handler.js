function handler(In) {
    if (this.connection)
        throw "Connection already created!";
    this.create();
    this.executeOutputLink("Out", In);
}