export interface GeoTiffPublicationJobOptions {
  minTimeStamp: string;
  maxTimeStamp: string;
  timeStampFormat: string;
  regionsMapping: { [key: number]: string };
}
