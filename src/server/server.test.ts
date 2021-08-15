const assert = require('assert');
import { createServer, Server } from "http";
import { io as client, Socket } from "socket.io-client";
import { InvalidPhotoURL } from "../customErrors";

// Setup mocks
import { firebaseServerStub } from './firebaseServerStub.test';
const fsStub = firebaseServerStub()

// Import module to test
import socketIOServer from './server';
const PORT = 8000

// Test
describe('socket io server', () => {

  let httpServer: Server;
  let clientSocket: Socket;

  before(() => {
    httpServer = createServer().listen(PORT, () => {
      console.log(`http server created on port ${PORT}`);
    });
    socketIOServer(httpServer, fsStub);
  });

  beforeEach(() => {
    clientSocket = client(`http://localhost:${PORT}`);
  });

  describe('join room', () => {
    it('should return true on successful room join', (done) => {
      fsStub.joinRoom = () => new Promise((res) => {
        res(true);
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
      fsStub.joinRoom = () => new Promise((res, reject) => {
        reject(new Error());
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
      fsStub.editUser = () => new Promise((res) => {
        res(true);
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

    it('should return an InvalidPhotoURL error when an invalid photo url is provided', (done) => {
      fsStub.editUser = () => new Promise((res, reject) => {
        reject(new InvalidPhotoURL());
      });

      clientSocket.emit("editUser", {}, (error: Error) => {
        try {
          assert.equal(error.name, (new InvalidPhotoURL()).name);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

});
