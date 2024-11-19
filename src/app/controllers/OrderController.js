import * as Yup from 'yup'
import Order from '../schemas/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array().required().of(
        Yup.object().shape({
          id: Yup.number().required(),
          quantity: Yup.number().required(),   
        })
      ),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { products } = request.body

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ['name'],
        },
      ]
    })

    const formattedProducts = findProducts.map((product) => ({
      id: product.id,  // Adicionar o id aqui
      name: product.name,
      category: product.category.name,
      price: product.price,
      url: product.url,
      path: product.path,
      quantity: products.find(p => p.id === product.id).quantity
    }));
    

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProducts,
      status: 'Pedido realizado',
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder)
  }

  async index( request, response){
    const orders = await Order.find();

    return response.json(orders)
  }

  async update(request, response) {
      const schema = Yup.object().shape({
        status: Yup.string().required()
          
      });
  
      try {
        await schema.validateSync(request.body, { abortEarly: false })
      } catch (err) {
        return response.status(400).json({ error: err.errors })
      }

      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json();
      }

      const { id } = request.params;
      const { status } = request.body;

    try {
      await Order.updateOne({ _id: id}, { status});
    } catch(err){
      return response.status(400).json({ error: err.message})
    }
 
      return response.json({ message: 'Status updated Sucessfully'})
  }

}

export default new OrderController()