const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const apiRouter = require('./routes/api');

const { errorHandler } = require('./routes/api'); // Import du middleware errorHandler

const app = express();
app.use(cors());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(apiRouter.swaggerSpec));

app.use('/api', apiRouter.router);

app.use(errorHandler);

app.listen("9000", () => {
  console.log('Server is running on port 9000');
});
