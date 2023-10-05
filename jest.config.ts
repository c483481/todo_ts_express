import { Config } from "@jest/types";

const config: Config.InitialOptions = {
    automock: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/__test__/*.ts", "!**/node_modules/**", "!vendor/**/*.js", "!coverage/*"],
    coverageProvider: "babel",
    maxConcurrency: 5,
    testEnvironment: "node",
    preset: "ts-jest",
    verbose: true,
};

export default config;
