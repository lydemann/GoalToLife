import { InjectionToken } from '@angular/core';

export interface Endpoints {
  serviceUrl: string;
}

export const ENDPOINTS_TOKEN = new InjectionToken<Endpoints>('Endpoints');
