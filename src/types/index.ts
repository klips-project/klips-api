export interface GeoTiffPublicationJobOptions {
  minTimeStamp: string;
  maxTimeStamp: string;
  timeStampFormat: string;
  regions: string[];
  types: string[];
  scenarios: string[];
}
