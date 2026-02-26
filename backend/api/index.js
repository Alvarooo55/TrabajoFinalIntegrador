const app = require('../app');
const connectDB = require('../src/config/db');

let dbConnectionPromise;

module.exports = async (req, res) => {
	try {
		dbConnectionPromise = dbConnectionPromise || connectDB({ exitOnError: false });
		await dbConnectionPromise;

		return app(req, res);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'No se pudo establecer conexión con la base de datos'
		});
	}
};
