import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { name } = request.body;

    const categoryExists = await Category.findOne({
      where: { name },
    });

    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({ name });

    return response.status(201).json(category);
  }

  async index(request, response) {
    const categories = await Category.findAll();
    return response.json(categories);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;
    const categoryExists = await Category.findByPk(id);

    if (!categoryExists) {
      return response.status(400).json({ message: 'Make sure your Category ID is correct' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name } = request.body;

    if (!name && !path) {
      return response.status(400).json({ error: 'Name or file is required.' });
    }

    if (name) {
      const categoryNameExists = await Category.findOne({
        where: { name },
      });

      if (categoryNameExists && categoryNameExists.id !== +id) {
        return response.status(400).json({ error: 'Category already exists' });
      }
    }

    await Category.update(
      { name, path },
      { where: { id } }
    );

    const updatedCategory = await Category.findByPk(id);

    return response.status(200).json(updatedCategory);
  }
}

export default new CategoryController();