import {AppConfig} from '../config/env';

export const BASE_URL = AppConfig.BASE_URL;

export const BUILD_IMAGE_URL = (name: string) =>
  `https://d33d0argf0d4xk.cloudfront.net/${name}`;
