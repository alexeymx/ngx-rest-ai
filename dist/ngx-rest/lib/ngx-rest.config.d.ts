export declare enum TypeTokenStorage {
    cookie = "cookie",
    localStorage = "localStorage",
    sessionStorage = "sessionStorage"
}
export declare class RestServiceConfig {
    endPoint?: string;
    mockData?: boolean;
    tokenStorage?: TypeTokenStorage;
    tokenName?: string;
    secureCookie?: boolean;
    language?: string;
    authUri?: string;
    validationTokenUri?: string;
    UnauthorizedRedirectUri?: string;
    UnauthenticatedRedirectUri?: string;
}
