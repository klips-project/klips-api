export interface GeoTiffPublicationJobOptions {
  minTimeStamp: string;
  maxTimeStamp: string;
  timeStampFormat: string;
  allowedDataTypes: string[],
  allowedEPSGCodes: number[]
  fileSize: Object,
  regions: Object;
  types: string[];
  scenarios: string[];
}

export interface JobConfig {
  geoTiffPublicationJob: GeoTiffPublicationJobOptions;
}
