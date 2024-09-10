import { HttpModuleInterceptor } from './http-module.interceptor';

describe('HttpModuleInterceptor', () => {
  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(new HttpModuleInterceptor()).toBeDefined();
  });
});
