import { Severity } from '../enums/severity.enum';

export interface Step {
  action: string;
  service: string;
  severity: Severity;
  sequence?: number;
  elapsedTime?: number;
  timestamp?: Date;
  message?: string;
  detail?: string;
  code?: string;
  traceDetails?: TraceDetails;
}

export interface TraceDetails {
  [key: string]: any;
}
