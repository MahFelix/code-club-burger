import * as Yup from 'yup'

class OrderController{
  async store(request,response){

    const schema = Yup.object().shape({
      products: Yup.array().required().of(
        Yup.object().shape({
          id: Yup.number().required(),
        quantity: Yup.number().required     
      })
      ),
     
     
    });
 
    
    try {
    await schema.validateSync(request.body, {abortEarly: false})
} catch (err) {
  return response.status(400).json({error: err.errors})
}

const productsId = request.body.products.map(product => product.id)

console.log(productsId)

  


    return response.status(201).json(request.body)
 
  }
}


export default  new OrderController()  