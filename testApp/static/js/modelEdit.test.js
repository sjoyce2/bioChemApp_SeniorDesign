const modelEdit = require('./modelEdit');

test("Should return a speed of 2", () => {
    const speed = 0;
    const enzymeName = "enzymeName";
    const document = jest.fn();
    const weight = 2;
    document
        function .getElementById(enzymeName, weight) {
                return 5;
            }
    modelEdit.setSpeed(enzymeName);
    expect(speed).toBe(2);
}); 