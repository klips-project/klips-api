import { logger } from './logger';
import dayjs from 'dayjs';

// TODO: maybe move to config file
const minTimeStamp = '2021';
const maxTimeStamp = '2024';
// for details see https://day.js.org/docs/en/display/format
const timeStampFormat = 'YYYYMMDDTHHmm';

// NOTE: the mosaic store must be called exactly as its main directory
// TODO: the name should be set dynamically in future
const mosaicStoreName = 'demo-mosaic';
const geoServerWorkspace = 'klips';

/**
 * Convert incoming message from API to an internal job for RabbitMQ.
 * @param requestBody {Object} The JSON coming from the API
 * @returns {Object} The job for the dispatcher
 */
const createGeoTiffPublicationJob = (requestBody: any) => {

  const geotiffUrl = requestBody.payload.url;

  const parsedTimeStamp = dayjs(requestBody.payload.predictionStartTime);
  if (!parsedTimeStamp.isValid()) {
    throw 'TimeStamp not valid';
  }

  const inCorrectTimeRange = parsedTimeStamp.isAfter(minTimeStamp) && parsedTimeStamp.isBefore(maxTimeStamp);
  if (!inCorrectTimeRange){
    throw 'Time outside of timerange';
  }

  const timestamp = parsedTimeStamp.format(timeStampFormat);

  const filename = `${requestBody.payload.region}_${timestamp}`;
  const geoTiffFilePath = `/opt/geoserver_data/${mosaicStoreName}/${filename}.tif`;

  const email = requestBody.email;

  // set username and password if necessary
  let username;
  let password;
  const partnerUrlStart = process.env.PARTNER_URL_START;
  if (geotiffUrl.startsWith(partnerUrlStart)) {
    logger.info('URL from partner is used');
    username = process.env.PARTNER_API_USERNAME;
    password = process.env.PARTNER_API_PASSWORD;
  }

  return {
    job: [
      {
        id: 1,
        type: 'download-file',
        inputs: [
          geotiffUrl,
          geoTiffFilePath,
          username,
          password
        ]
      },
      {
        id: 2,
        type: 'geotiff-validator',
        inputs: [
          {
            outputOfId: 1,
            outputIndex: 0
          }
        ]
      },
      {
        id: 3,
        type: 'geoserver-publish-imagemosaic',
        inputs: [
          geoServerWorkspace,
          mosaicStoreName,
          {
            outputOfId: 2,
            outputIndex: 0
          }
        ]
      }
    ],
    email: email
  };
};

/**
 * Creates different jobs depending on the input message.
 *
 * @param requestBody {Object} The JSON coming from the API
 * @returns {Object} The job for the dispatcher
 */
const createJobFromApiInput = (requestBody: any) => {

  return createGeoTiffPublicationJob(requestBody);

};

export default createJobFromApiInput;
