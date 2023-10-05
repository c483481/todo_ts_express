const { parseToString, parseToNumber } = jest.requireActual("../module/parse.module");

it("test parser function", () => {
    expect(parseToString(123)).toStrictEqual("123");
    expect(parseToNumber("123")).toBe(123);
    expect(parseToString(null)).toStrictEqual("");
    expect(parseToNumber(undefined)).toBe(0);
});
