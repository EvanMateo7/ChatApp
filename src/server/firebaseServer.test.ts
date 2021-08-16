const assert = require('assert');
import * as admin from "firebase-admin";

// Import stubbed module to test
import { FirebaseAdminStub, firebaseServerStub } from './firebaseServerStub.test';

// Test
describe('firebase server', () => {
  const newFirebaseUserInfo: admin.auth.UserInfo = {
    uid: "uid",
    displayName: "displayName",
    email: "email",
    phoneNumber: "phoneNumber",
    photoURL: "photoURL",
    providerId: "providerId",
    toJSON: () => ({})
  }

  describe('addUser', () => {
    it('should return true on successfully adding non-existing user', async () => {
      const firebaseAdminStub = new FirebaseAdminStub();
      firebaseAdminStub.get = () => new Promise((res) => res({ exists: false }));

      const result = await firebaseServerStub(firebaseAdminStub).addUser(newFirebaseUserInfo);

      assert.equal(result, true);
    });

    it('should return false on failed adding existing user', async () => {
      const firebaseAdminStub = new FirebaseAdminStub();
      firebaseAdminStub.get = () => new Promise((res) => res({ exists: true }));

      const result = await firebaseServerStub(firebaseAdminStub).addUser(newFirebaseUserInfo);

      assert.equal(result, false);
    });
  });

});
