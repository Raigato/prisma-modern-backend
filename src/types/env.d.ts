declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number
    HOST: string
    JWT_SECRET: string
  }
}
