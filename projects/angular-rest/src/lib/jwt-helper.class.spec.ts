import { JwtHelper } from './jwt-helper.class';

// tslint:disable-next-line: max-line-length
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('JwtHelper', () => {

  it('should be able to detect an undecodable token', () => {
    expect(JwtHelper.decodeToken(null)).toBeNull();
    expect(JwtHelper.decodeToken('')).toBeNull();
    expect(JwtHelper.decodeToken('xxxx')).toBeNull();
    expect(JwtHelper.decodeToken('xxxx.xxx')).toBeNull();
    expect(JwtHelper.decodeToken('xxxx.xxxx.xxxx.xxxxx')).toBeNull();
  });

  it('should be able to decode a value', () => {
    const decoded = JwtHelper.decodeToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded).toEqual(jasmine.objectContaining({
      sub: '1234567890', name: 'John Doe', iat: 1516239022
    }));
  });
});
