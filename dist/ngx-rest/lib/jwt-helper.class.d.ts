import { IJwtPayload } from './jwt-payload.interface';
export declare class JwtHelper {
    static decodeToken(token?: string): IJwtPayload;
    private static urlBase64Decode;
}
