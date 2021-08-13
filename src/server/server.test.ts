const assert = require('assert');
const proxyquire = require('proxyquire');
import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { InvalidPhotoURL } from "../customErrors";

// Setup mocks
const firebaseAdminStub: any = {};
firebaseAdminStub.initializeApp = (...args: any[]) => console.log("initializeApp() executed");
firebaseAdminStub.firestore = () => console.log("firestore() executed");
const firebaseServer = proxyquire('./firebaseServer', { 'firebase-admin': firebaseAdminStub });

// Import module to test
import socketIOServer from './server';
const PORT = 8000

// Test
describe('socket io server', () => {

  let httpServer: Server;
  let clientSocket: Socket;

  before(() => {
    httpServer = createServer().listen(PORT, () => {
      console.log('http server created')
    });
    clientSocket = client(`http://localhost:${PORT}`);
    socketIOServer(httpServer, firebaseServer);
  });

  afterEach((done) => {
    done();
  });

  describe('join room', () => {
    it('should return true on successful room join', (done) => {
      firebaseServer.joinRoom = () => new Promise<void>((res) => {
        console.log('joined room');
        res();
      });

      clientSocket.emit("joinRoom", {}, (success: any) => {
        try {
          assert.equal(success, true);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should return false on failed room join', (done) => {
      firebaseServer.joinRoom = () => new Promise<void>((res, reject) => {
        console.log('joined room');
        reject(new InvalidPhotoURL());
      });

      clientSocket.emit("joinRoom", {}, (success: any) => {
        try {
          assert.equal(success, false);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('edit user', () => {
    it('should return an empty object on successfully editing user', (done) => {
      firebaseServer.editUser = () => new Promise<void>((res) => {
        console.log('edited user');
        res();
      });

      clientSocket.emit("editUser", {}, (error: Error) => {
        try {
          assert.deepStrictEqual(error, {});
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

});
