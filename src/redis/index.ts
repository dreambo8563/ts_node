import * as Redis from "ioredis"
import { config } from "./config"
import Logger from "../utils/logger"

export class RedisController {
  private keyTitle: string
  private redis: Redis.Redis
  constructor(redis: Redis.Redis, keyTitle: string) {
    this.keyTitle = keyTitle
    this.redis = redis
  }
  async set(module: string, key: string, value: any) {
    try {
      const keyPath = `${this.keyTitle}:${module}:${key}`
      return await this.redis.set(keyPath, JSON.stringify(value))
    } catch (e) {
      Logger.error("error when save redis , error info is :%", e)
    }
  }
  async get(module: string, key: any) {
    try {
      const keyPath = `${this.keyTitle}:${module}:${key}`
      const value = await this.redis.get(keyPath)
      if (!value) {
        return
      }
      return JSON.parse(value)
    } catch (e) {
      Logger.error("error when read redis , error info is :%", e)
    }
  }

  async multiSet(module: string, value: { [key: string]: string }) {
    try {
      //   if (!utils.isObject(value)) {
      //     throw new Error("multi set key must be a object")
      //   }
      if (Object.keys(value).length < 1) {
        throw new Error("multi set  at least have one key")
      }
      const toBeSavedObj: string[] = []
      Object.keys(value).forEach(key => {
        const keyPath = `${this.keyTitle}:${module}:${key}`
        toBeSavedObj.push(keyPath)
        toBeSavedObj.push(JSON.stringify(value[key]))
      })
      const [a, b, ...arr] = toBeSavedObj
      return await this.redis.mset(a, b, ...arr)
    } catch (e) {
      Logger.error("error when multi save redis , error info is :%", e)
    }
  }

  async multiGet(module: string, key: string[]) {
    try {
      if (!Array.isArray(key) || !key) {
        throw new Error("multi get key must be a array")
      }
      key.forEach((current, index) => {
        key[index] = `${this.keyTitle}:${module}:${current}`
      })
      const value = await this.redis.mget(...key)
      console.log(value, "value")
      if (!value || !Array.isArray(value)) {
        return
      }
      // if key is not exit in redis, you will get null
      value.forEach((current, index) => {
        if (current) {
          value[index] = JSON.parse(current)
        } else {
          value[index] = null
        }
      })
      const result: { [key: string]: string } = {}
      key.forEach((subKey, index) => {
        result[subKey] = value[index]
      })
      return result
    } catch (e) {
      Logger.error("error when multi read redis , error info is :%", e)
    }
  }
  async delete(module: string, key: string) {
    try {
      const keyPath = `${this.keyTitle}:${module}:${key}`
      console.log(keyPath, "del")
      return await this.redis.del(keyPath)
    } catch (e) {
      Logger.error("error when delete redis , error info is :%", e)
    }
  }
}
export default new RedisController(
  new Redis(config.port, config.host),
  "node_server"
)