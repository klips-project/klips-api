/**
 * Convert incoming message from API to an internal job for RabbitMQ.
 * @param requestBody {Object} The JSON coming from the API
 * @returns {Object} The job for the dispatcher
 */
const createGeoTiffPublicationJob = (requestBody: any) => {

  const geotiffUrl = requestBody.url;
  const geoServerWorkspace = 'klips';
  const dataStore = 'forecasts';
  const layerName = `${requestBody.region}_${requestBody.predictionStartTime}`;
  const layerTitle = layerName;

  return {
    'job': [
      {
        'id': 1,
        'type': 'download-new-data-from-url',
        'inputs': [
          geotiffUrl,
          '/home/data'
        ]
      },
      {
        'id': 2,
        'type': 'geotiff-validator',
        'inputs': [
          {
            'outputOfId': 1,
            'outputIndex': 0
          }
        ]
      },
      {
        'id': 3,
        'type': 'geoserver-publish-geotiff',
        'inputs': [
          geoServerWorkspace,
          dataStore,
          layerName,
          layerTitle,
          {
            'outputOfId': 2,
            'outputIndex': 0
          }
        ]
      }
    ]
  };
};

/**
 * Creates different jobs depending on the input message.
 *
 * @param requestBody {Object} The JSON coming from the API
 * @returns {Object} The job for the dispatcher
 */
const createJobFromApiInput = (requestBody: any) => {

  if (requestBody.category === 'forecast') {
    return createGeoTiffPublicationJob(requestBody);
  }

};

export default createJobFromApiInput;
