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
routes.put('/products/:id', upload.single('file'), ProductsController.update)

routes.post('/categories', upload.single('file'), CategoryController.store)
routes.get('/categories',  CategoryController.index) 
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', OrderController.update)




 
export default routes
 