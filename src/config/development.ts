const config = {
  app: {
    env: "development",
    port: process.env.PORT || 8192
  },
  wechat: {
    appid: "wx1e8c8f58fe641e5d",
    appsecret: "72a0395a63f52a47b031b91f4f011d4e",
    expires: 5 * 60
  },
  auth: {
    secret: "76a075715eaccaf10cf48d9828f6a22a",
    expires: 60,
    users: [
      {
        username: "user1",
        password: "user1",
        userid: 100001011
      },
      {
        username: "user2",
        password: "user2",
        userid: 200002022
      }
    ]
  },
  live: {
    appid: 1252551103,
    bizid: 19386,
    pushKey: "46a3ded3ef8392f54901775ce9f549fe",
    apiKey: "062cd5985bad65b89a9c5543c2d7d2d0"
  },
  winston: {
    consoleLevel: "debug",
    fileLevel: "info",
    filename: "logs/wxa-sockets-server.log"
  },
  db: {
    client: "mysql",
    connection: {
      host: process.env.NODE_ENV === "production" ? "db" : "dev.snaplingo.com",
      user: "root",
      port: "8980",
      password: "jjjjjj",
      database: process.env.NODE_ENV === "production" ? "typeorm" : "data"
    },
    pool: { min: 0, max: 10 }
  },
  session: {
    name: "crm.sessionId",
    secret: "TP78x5qh3uwPhm5xpEuUlojX",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    host: "redis_Dev",
    port: 6379
  },
  redis: {
    port: 8989,
    host: "dev.snaplingo.com"
  }
}

export { config }
