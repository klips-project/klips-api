import express from 'express';
import helmet from 'helmet';
import amqp from 'amqplib';
import basicAuth from 'express-basic-auth';
import {
  urlencoded,
  json
} from 'body-parser';

import { logger } from './logger';
import createJobFromApiInput from './converter';

const port = process.env.PORT;
// https://stackoverflow.com/a/57611367
const dispatcherQueue: string = process.env.DISPATCHERQUEUE as string;
const rabbitHost = process.env.RABBITHOST;
const rabbitUser = process.env.RABBITUSER;
const rabbitPass = process.env.RABBITPASS;

const basicAuthUsers = {
  klips: 'klips'
};

const main = async () => {

  // TODO: basic auth

  // TODO: ensure RabbitMQ is connected
  try {
    const connection = await amqp.connect({
      hostname: rabbitHost,
      username: rabbitUser,
      password: rabbitPass,
      heartbeat: 60
    });
    const channel = await connection.createChannel();

    channel.assertQueue('DeadLetterQueue', { durable: true });
    channel.bindQueue('DeadLetterQueue', 'DeadLetterExchange', '');
    channel.assertQueue(dispatcherQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'DeadLetterExchange'
      }
    });

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

    app.use(basicAuth({
      users: basicAuthUsers,
      realm: 'KLIPS' // name of the area to enter
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
        // TODO: validate input
        logger.info(req.body);
        const job = createJobFromApiInput(req.body);

        channel.sendToQueue(dispatcherQueue, Buffer.from(JSON.stringify(
          job
        )), {
          persistent: true
        });

        res.send('post received');
      });

    logger.info(`🍻 Application successfully started on port ${port}`);
  } catch (error) {
    logger.error(`🔥 Could not start the application: ${error}`);
    return;
  }
};

main();
