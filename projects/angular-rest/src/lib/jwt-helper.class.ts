import { IJwtPayload } from './jwt-payload.interface';

export class JwtHelper {

    public static decodeToken(token = ''): IJwtPayload {
        if (token === null || token === '') {
            return null;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }

        return JSON.parse(decoded);
    }

    private static urlBase64Decode(str: string): string {
        let output = str;
        switch (output.length % 4) {
            case 0:
                break;

            case 2:
                output += '==';
                break;

            case 3:
                output += '=';
                break;

            default:
                return null;
        }

        const data = atob(output);

        return decodeURIComponent(data);
    }

}
