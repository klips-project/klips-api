/**
 * Convert incoming message to an internal job.
 */
import { logger } from './logger';

const createJobFromApiInput = (requestBody: Object) => {
  logger.info(`Received ${requestBody}`);
  const job = {
    rawInput: requestBody
  };
  return job;
};

export default createJobFromApiInput;
