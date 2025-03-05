import { JWTPayload } from "../src/auth/interfaces/jwtPayload.interface";

declare global {
    namespace Express {
        interface User extends JWTPayload {}
    }
}

export {};
