import express from 'express';
import { resolve } from 'node:path';
import cors from 'cors';
import routes from '../routes.js';
import '../database/index.js';

const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.options('*', cors(corsOptions));
    this.app.use(express.json());

    this.app.use((req, res, next) => {
      console.log('Request URL:', req.originalUrl);
      next();
    });

    
    this.app.use(
      '/product-file',
      express.static(resolve('uploads'))
    );
    this.app.use(
      '/category-file',
      express.static(resolve('uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
