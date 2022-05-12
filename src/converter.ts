/**
 * Convert incoming message to an internal job.
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

const createJobFromApiInput = (requestBody: any) => {

  if (requestBody.category === 'forecast') {
    return createGeoTiffPublicationJob(requestBody);
  }

};

export default createJobFromApiInput;
