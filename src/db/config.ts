export const config = {
  client: "mysql",
  connection: {
    host: "db",
    user: "root",
    password: "my-secret-pw",
    database: "typeorm"
  },
  pool: { min: 0, max: 10 }
}
