export enum TypeTokenStorage {
  cookie = 'cookie',
  localStorage = 'localStorage',
  sessionStorage = 'sessionStorage',
}

export class RestServiceConfig {
  public endPoint?: string;
  public mockData?: boolean;
  public tokenStorage?: TypeTokenStorage;
  public tokenName?: string;
  public secureCookie?: boolean;
  public language?: string;
  public authUri?: string;
  public validationTokenUri?: string;
  public UnauthorizedRedirectUri?: string;
}
