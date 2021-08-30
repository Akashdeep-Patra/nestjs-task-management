import * as joi from '@hapi/joi';

export const configValidationSchema = joi.object({
  STAGE: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required().default(5000),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.number().required().default(3600),
});
