export const config = {
  client: "mysql",
  connection: {
    host: process.env.NODE_ENV === "production" ? "db" : "db_dev",
    user: "root",
    password: "my-secret-pw",
    database: process.env.NODE_ENV === "production" ? "typeorm" : "typeorm_dev"
  },
  pool: { min: 0, max: 10 }
}
