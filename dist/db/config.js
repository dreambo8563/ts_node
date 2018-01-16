"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    client: "mysql",
    connection: {
        host: "db",
        user: "root",
        password: "my-secret-pw",
        database: "typeorm"
    },
    pool: { min: 0, max: 10 }
};
//# sourceMappingURL=config.js.map