export interface Court {
  autoId: number;
  courtTypeId: number;
  typeName: string;
  courtName: string;
  countryCode: string;
  stateMasterId: number;
  stateName: string;
  cityMasterId: number | null;
  cityName: string;
  countyMasterId: number;
  countyName: string;
  zipCode: string;
  googleMapUrl: string;
}
