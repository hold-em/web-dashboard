import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://dev.api.yajasu.kr/v3/api-docs',
  output: 'src/lib/api',
  plugins: ['@hey-api/client-axios']
});
