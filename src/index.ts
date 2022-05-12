import express from 'express';
import helmet from 'helmet';
import amqp from 'amqplib';
import basicAuth from 'express-basic-auth';
import Ajv from 'ajv';
import { logger } from './logger';
import createJobFromApiInput from './converter';
import {
  urlencoded,
  json
} from 'body-parser';

const ajv = new Ajv();

const port = process.env.PORT;
// https://stackoverflow.com/a/57611367
const dispatcherQueue: string = process.env.DISPATCHERQUEUE as string;
const rabbitHost = process.env.RABBITHOST;
const rabbitUser = process.env.RABBITUSER;
const rabbitPass = process.env.RABBITPASS;

// TODO: move to separate file
const basicAuthUsers = {
  klips: 'klips'
};

// TODO: move to separate file
const schemaInput = {
  $id: 'json',
  type: 'object',
  properties: {
    'category': { type: 'string' },
    'source': { type: 'string' },
    'email': { type: 'string' },
    'payload': { type: 'object' },
  },
  required: [
    'category',
    'source',
    'email',
    'payload'
  ],
  additionalProperties: true
};

const main = async () => {

  // TODO: ensure RabbitMQ is connected and stays connected
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

    // ensures the incoming data is a JSON
    app.use(json({
      limit: '1kb'
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

        const validate = ajv.compile(schemaInput);
        if (validate(req.body)) {
          logger.info('Input data is in correct structure');

          const job: any = createJobFromApiInput(req.body);
          if (job) {
            channel.sendToQueue(dispatcherQueue, Buffer.from(JSON.stringify(
              job
            )), {
              persistent: true
            });
            // message to client
          }
          res.send('Post received');
        } else {
          logger.error('Input data not in correct Structure');
          // log the problems of the incoming JSON
          logger.error(validate.errors);

          // message to client
          res.send('Data had errors');
        }
      });

    logger.info(`🍻 Application successfully started on port ${port}`);
  } catch (error) {
    logger.error(`🔥 Could not start the application: ${error}`);
    return;
  }
};

main();
