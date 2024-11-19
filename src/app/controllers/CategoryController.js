import * as Yup from 'yup';

//Models
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
	async store(request, response) {
		const schema = Yup.object({
			name: Yup.string().required(),
		});

		//Validar dados
		try {
			schema.validateSync(request.body, { abortEarly: false });
		} catch (error) {
			return response.status(400).json({ error: error });
		}

		const { admin: isAdmin } = await User.findByPk(request.userId);

		if (!isAdmin) {
			return response.status(401).json();
		}

		const { filename: path } = request.file;
		const { name } = request.body;

		//Validar repetido
		const categoryExists = await Category.findOne({
			where: {
				name,
			},
		});

		if (categoryExists) {
			return response.status(400).json({ error: 'Category already exists' });
		}

		//Criar
		const category = await Category.create({
			name,
			path,
		});

		return response.status(201).json({ category });
	}

	async update(request, response) {
		const schema = Yup.object({
			name: Yup.string(),
		});

		//Validar dados
		try {
			schema.validateSync(request.body, { abortEarly: false });
		} catch (error) {
			return response.status(400).json({ error: error });
		}

		const { admin: isAdmin } = await User.findByPk(request.userId);

		if (!isAdmin) {
			return response.status(401).json();
		}

		const { id } = request.params;

		let path;
		if (request.file) {
			path = request.file.filename;
		}

		const { name } = request.body;

		const categoryExists = await Category.findByPk(id);
		if (!categoryExists) {
			return response.status(400).json({ message: 'Category ID not exists' });
		}

		//Validar repetido

		if (name) {
			const categoryNameExists = await Category.findOne({
				where: {
					name,
				},
			});
			if (categoryNameExists && categoryNameExists.id != +id) {
				return response.status(400).json({ error: 'Category already exists' });
			}
		}

		//Editar
		await Category.update(
			{
				name,
				path,
			},
			{
				where: {
					id,
				},
			},
		);

		return response.status(200).json({ success: true, message: 'Categoria atualizada com sucesso' });
	}

	//Listar
	async index(request, response) {
		const categories = await Category.findAll();

		return response.json(categories);
	}
}

export default new CategoryController();