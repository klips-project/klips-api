export interface GeoTiffPublicationJobOptions {
  minTimeStamp: string;
  maxTimeStamp: string;
  timeStampFormat: string;
  regions: string[];
  types: string[];
  scenarios: string[];
}

export interface JobConfig {
  geoTiffPublicationJob: GeoTiffPublicationJob;
}

export interface GeoTiffPublicationJob {
  minTimeStamp: string;
  maxTimeStamp: string;
  timeStampFormat: string;
  regions: string[];
  types: string[];
  scenarios: string[];
}
