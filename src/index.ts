import express from 'express';
import helmet from 'helmet';
import {
  urlencoded,
  json
} from 'body-parser';

import { logger } from './logger';

const port = 3000;

const main = async () => {

  try {
    const app = express();

    // See https://expressjs.com/en/guide/behind-proxies.html
    app.set('trust proxy', 1);

    app.use(helmet());
    app.use(json({
      limit: '1mb'
    }));
    app.use(urlencoded({
      extended: true
    }));

    app.listen(port);

    app.get(
      '/status',
      async (req: express.Request, res: express.Response): Promise<express.Response> => {
        logger.info('status active');
        return res.status(200).send({
          message: 'Status: active',
        });
      }
    );

    app.post('/job',
      async (req: express.Request, res: express.Response) => {
        logger.info(req.body);
        res.send('post received');
      });

    logger.info(`🍻 Application successfully started on port ${port}`);
  } catch (error) {
    logger.error(`🔥 Could not start the application: ${error}`);
    return;
  }
};

main();
