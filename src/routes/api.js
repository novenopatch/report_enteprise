const express = require('express');
const { defaultGetRoms, defaultgGetMovies, getRomLink } = require('../scraper');
const router = express.Router();

/**
 * Middleware de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

/**
 * Middleware de log des requêtes
 */
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Utilisation des middlewares
router.use(requestLogger);

/**
 * @swagger
 * /roms:
 *   get:
 *     summary: Récupère les salles de cinéma disponibles.
 *     responses:
 *       200:
 *         description: Succès. Retourne la liste des salles de cinéma.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/roms', async (req, res, next) => {
  try {
    const roms = await defaultGetRoms();
    res.json(roms);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /movies/{romId}:
 *   get:
 *     summary: Récupère les films d'une salle de cinéma spécifique.
 *     parameters:
 *       - in: path
 *         name: romId
 *         required: true
 *         description: ID de la salle de cinéma.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Succès. Retourne la liste des films de la salle de cinéma spécifiée.
 *       404:
 *         description: Salle de cinéma non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/movies/:romId', async (req, res, next) => {
  const { romId } = req.params;
  try {
    const romLink = getRomLink(parseInt(romId));
    if (romLink) {
      const movies_list = await defaultgGetMovies(romLink);
      res.json(movies_list);
    } else {
      res.status(404).json({ error: 'Salle de cinéma non trouvée' });
    }
  } catch (error) {
    next(error);
  }
});

// Définition de la spécification Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation de l\'API',
      version: '1.0.0',
      description: 'Documentation de mon API',
    },
    servers: [
      { url: 'http://localhost:9000' }, // Remplacez par l'URL de votre serveur
    ],
  },
  apis: ['./routes/api.js'], // Spécifiez le chemin de votre fichier api.js
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Export des middlewares et de la spécification Swagger
module.exports = { router, swaggerSpec, errorHandler };
