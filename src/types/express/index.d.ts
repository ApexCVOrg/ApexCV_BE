import 'express-session'

declare module 'express-session' {
  interface SessionData {
    pendingOrder?: any;
    state?: string;
  }
}

declare namespace Express {
  export interface Request {
    userId?: string
    user?: any
  }
}
