import { Auth0Interceptor } from './auth0.interceptor';

describe('Auth0Interceptor', () => {
  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(new Auth0Interceptor()).toBeDefined();
  });
});
