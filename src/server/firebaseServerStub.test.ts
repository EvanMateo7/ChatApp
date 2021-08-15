const proxyquire = require('proxyquire');
import * as firebaseServer from './firebaseServer'

export class FirebaseAdminStub {
  initializeApp = (...args: any[]) => this;
  firestore = () => this;
  collection = () => this;
  doc = () => this;
  get = () => new Promise<any>((res) => res(null));
  set = () => new Promise<any>((res) => res(null));
  create = () => new Promise<any>((res) => res(null));
}

export const firebaseServerStub = (firebaseAdminStub?: any) => {
  return proxyquire('./firebaseServer', { 'firebase-admin': firebaseAdminStub ?? new FirebaseAdminStub() }) as typeof firebaseServer;
}
