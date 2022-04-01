import pino from 'pino'

declare namespace Express {
  export interface Request {
    log: pino.Logger
  }
}
