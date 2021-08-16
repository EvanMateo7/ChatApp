const proxyquire = require('proxyquire');
import * as firebaseServer from './firebaseServer'
import * as utils from "./utils";

type UtilsType = typeof utils;
type FirebaseServerType = typeof firebaseServer;

export class FirebaseAdminStub {
  initializeApp = (...args: any[]) => this;
  firestore = () => this;
  collection = () => this;
  doc = () => this;
  get = () => new Promise<any>((res) => res(null));
  set = () => new Promise<any>((res) => res(null));
  create = () => new Promise<any>((res) => res(null));
}

export class UtilsStub implements UtilsType {
  isValidImageURL = () => new Promise<boolean>((res) => res(true));
}

export const firebaseServerStub = (firebaseAdminStub?: any, utilsStub?: Partial<UtilsStub>) => {
  return proxyquire('./firebaseServer', { 
    'firebase-admin': firebaseAdminStub ?? new FirebaseAdminStub(),
    './utils': utilsStub ?? new UtilsStub()
  }) as FirebaseServerType;
}
