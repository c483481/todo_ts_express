"use strict";

const Constants = {
    SALT_ROUNDS: 14,
    DEFAULT_TIMESTAMP: "2000-01-01 00:00:00",
    DEFAULT_JSON: "{}",
    DEFAULT_JSON_MYSQL: "JSON_OBJECT()",
    DEFAULT_VERSION: 1,
    DEFAULT_MODIFIED_BY: {
        xid: "anonymus",
        email: "anonymus@anonymus.com",
    },
};

module.exports = {
    Constants
};
