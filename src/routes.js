import { Router } from 'express'

import multer from'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionsController from './app/controllers/SessionsController'
import ProductsController from './app/controllers/ProductsController'
import CategoryController from './app/controllers/CategoryController'

import authMiddleware from './app/middlewares/auth'
import OrderController from './app/controllers/OrderController'


const upload = multer(multerConfig)

const routes = new Router()

routes.post('/users', UserController.store)

routes.post('/sessions', SessionsController.store)

routes.use(authMiddleware) // Será chamado por todas as rotas abaixo //

routes.post('/products', upload.single('file'), ProductsController.store)
routes.get('/products',  ProductsController.index)

routes.post('/categories', CategoryController.store)
routes.get('/categories',  CategoryController.index) 

routes.post('/orders', OrderController.store)

 
export default routes
 