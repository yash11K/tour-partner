import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStratergy extends PassportStrategy(Strategy) {
  public get configService(): ConfigService {
      return this._configService;
  }
  constructor(private _configService: ConfigService) {
    // allow JWT-formatted token to be passed
    // RSA56 signed token to be accepted
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: _configService.get<string>('jwksUri'),
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: _configService.get<string>('audience'),
      issuer: _configService.get<string>('issuer'),
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}

