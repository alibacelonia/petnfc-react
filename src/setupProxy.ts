// src/setupProxy.ts

import { createProxyMiddleware } from 'http-proxy-middleware';
import { Application } from 'express'; // This import might be needed depending on your setup

export default function(app: Application) {
  app.use(
    '/api', // Change '/api' to the appropriate endpoint prefix you want to proxy
    createProxyMiddleware({
      target: 'https://payments-stest.npe.auspost.zone', // Change this to your server's base URL
      changeOrigin: true,
    })
  );
}
