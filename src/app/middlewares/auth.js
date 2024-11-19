import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import express from 'express';
import { resolve } from 'path';

function authMiddleware(request, response, next) {
	const authToken = request.headers.authorization;

	if (!authToken) {
		return response.status(401).json({ error: 'Token not provided' });
	}

	const token = authToken.split(' ')[1];

	try {
		jwt.verify(token, authConfig.secret, (err, decoded) => {
			if (err) {
				throw new Error();
			}

			request.userId = decoded.id;
			request.userName = decoded.name;
		});
	} catch (err) {
		return response.status(401).json({ error: 'Token is invalid' });
	}
	return next();
}

const productFileMiddleware = (req, res, next) => {
	console.log('Requested file path:', req.originalUrl);
	next();
};

const staticMiddleware = express.static(resolve('uploads'));

export const middlewares = [
	authMiddleware,
	productFileMiddleware,
	staticMiddleware,
];

export default authMiddleware;
