import { defineConfig } from '@vue/cli-service';
export default defineConfig({
  transpileDependencies: true,
});

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/weight-prediction-app/' : '/',
};
