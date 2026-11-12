import { registerAs } from '@nestjs/config';
import { parserEnvOrigins } from 'src/shared/utils/parse-env-origins';

export const APP_CONFIG = 'app';

export default registerAs(APP_CONFIG, () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  corsOrigins: parserEnvOrigins(
    process.env.CLIENT_URL,
    process.env.CORS_OTHER_URL,
  ),
}));
