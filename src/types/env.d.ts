declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test'
    PORT: number
    HOST: string
    JWT_SECRET: string
  }
}
