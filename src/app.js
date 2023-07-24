const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { defaultGetRoms, defaultgGetMovies, getRomLink } = require('./scraper');

const app = express();
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation de l\'API',
      version: '1.0.0',
      description: 'Documentation de mon super API',
    },
    servers: [
      { url: 'http://localhost:9000' }, 
    ],
  },
  apis: [__filename],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/roms:
 *   get:
 *     summary: le json
 *     responses:
 *       200:
 *         description: Succès. 
 *       500:
 *         description: Erreur interne du serveur.
 */
app.get('/api', async (req, res) => {
  try {
    const roms = await defaultGetRoms();
    res.json(roms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(9000, () => {
  console.log('Server is running on port 9000');
});
