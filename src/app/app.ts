import * as express from "express"
import { NextFunction, Request, Response } from "express"
import * as path from "path"
import * as favicon from "serve-favicon"
import * as logger from "morgan"
import * as cookieParser from "cookie-parser"
import * as bodyParser from "body-parser"
import { rootDir } from "../config/"
import routes from "../routes"
import * as session from "express-session"
import * as connectRedis from "connect-redis"
import * as Redis from "ioredis"
import { config as redisConfig } from "../redis/config"
import { redis } from "../redis"

// create the client because of the issue
// https://stackoverflow.com/search?q=docker+redis+express+session
// https://github.com/luin/ioredis/issues/568
const RedisStore = connectRedis(session)
// const redisClient = new Redis(redisConfig.port, redisConfig.host)
const app = express()

// view engine setup
app.set("views", path.join(rootDir(), "views"))
app.set("view engine", "jade")

// uncomment after placing your favicon in /public
app.use(favicon(path.join(rootDir(), "public", "favicon.png")))
app.use(logger("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(redisConfig.secret))
app.use(
  session({
    name: redisConfig.name,
    secret: redisConfig.secret,
    saveUninitialized: true,
    resave: true,
    cookie: redisConfig.cookie,
    // @ts-ignore
    store: new RedisStore({
      client: redis
    })
  })
)
app.use(express.static(path.join(rootDir(), "public")))

// router bind
app.use("/", function(req, res, next) {
  if (req.session.pageCount) req.session.pageCount++
  else req.session.pageCount = 1
  res.render("index", { title: JSON.stringify(req.session) })
})
app.use("/api", routes.api)
app.use("/debug", routes.debug)
app.use("/tencent", routes.tencent)
app.use("/todo", routes.todo)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found")
  // @ts-ignore
  err.status = 404
  next(err)
})

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  // @ts-ignore
  res.status(err.status || 500)
  res.render("error")
})

export default app
