const assert = require('assert');
import * as admin from "firebase-admin";
import { User } from "../models";

// Import stubbed module to test
import { FirebaseAdminStub, firebaseServerStub, UtilsStub } from './firebaseServerStub.test';

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

  describe('editUser', () => {
    const editUser: User = {
      id: "id",
      name: "name",
      photoURL: "photoURL"
    }

    it('should return true on successfully editing user profile', async () => {
      const firebaseAdminStub = new FirebaseAdminStub();
      firebaseAdminStub.get = () => new Promise((res) => res({ exists: true }));

      const result = await firebaseServerStub(firebaseAdminStub).editUser(editUser);

      assert.equal(result, true);
    });

    it('should return false on failed editing a non-existing user profile', async () => {
      const firebaseAdminStub = new FirebaseAdminStub();
      firebaseAdminStub.get = () => new Promise((res) => res({ exists: false }));

      const result = await firebaseServerStub(firebaseAdminStub).editUser(editUser);

      assert.equal(result, false);
    });

    it('should return false on failed editing using an invalid photo url', async () => {
      const firebaseAdminStub = new FirebaseAdminStub();
      const utilsStub = new UtilsStub();
      firebaseAdminStub.get = () => new Promise((res) => res({ exists: false }));
      utilsStub.isValidImageURL = () => new Promise((res) => res(false));

      const result = await firebaseServerStub(firebaseAdminStub).editUser(editUser);

      assert.equal(result, false);
    });
  });
});
