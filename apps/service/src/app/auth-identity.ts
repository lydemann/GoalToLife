import express from 'express';
import { auth } from 'firebase-admin';

export interface AuthIdentity extends auth.DecodedIdToken {
  hasPremium: boolean;
}

export interface RequestContext {
  auth: AuthIdentity;
  req: express.Request;
  res: express.Response;
}
