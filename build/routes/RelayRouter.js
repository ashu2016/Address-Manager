"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin = require("firebase-admin");
const fileUtils_1 = require("../utils/fileUtils");
//const Heroes = require('../data');
class RelayRouter {
    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET all Address.
     */
    getAll(req, res, next) {
        var db = admin.database();
        var ref = db.ref("original-address-list");
        ref.once("value", function (snapshot) {
            console.log(snapshot.val());
        });
        console.log("calling a program");
        fileUtils_1.FileUtils.callProgram();
        res.send("Server get All call.");
    }
    /**
     * GET one hero by id
     */
    checkForMovedAddress(req, res, next) {
        console.log("Check Moved address");
        var id = req.query.key;
        console.log(id);
        var db = admin.database();
        var ref = db.ref("original-address-list");
        ref.orderByKey().equalTo(id).once('value', function (snap) {
            if (snap.exists()) {
                console.log(snap.val());
                let name = snap.child(`${id}/recipientName`).val();
                let address = snap.child(`${id}/recipientAddress`).val();
                let mailerId = snap.child(`${id}/mailerId`).val();
                //console.log(snap.child(id).child("recipientAddress").val());
                fileUtils_1.FileUtils.createInputFile(mailerId, name, address);
                fileUtils_1.FileUtils.callProgram();
                fileUtils_1.FileUtils.waitForOutputFile();
            }
        });
        res.status(200).send("Success");
        // let hero = Heroes.find(hero => hero.id === query);
        // if (hero) {
        //   res.status(200)
        //     .send({
        //       message: 'Success',
        //       status: res.status,
        //       hero
        //     });
        // }
        // else {
        //   res.status(404)
        //     .send({
        //       message: 'No hero found with the given id.',
        //       status: res.status
        //     });
        // }
    }
    storeAddress(req, res) {
        console.log("POST Method");
        var db = admin.database();
        var ref = db.ref("original-address-list");
        var addressInfo = req.body;
        console.log(addressInfo);
        let newAddressRef = ref.push(addressInfo, function (error) {
            if (error) {
                console.log("An Error Occured");
            }
            else {
                console.log("Address was successfullysaved.");
            }
        });
        console.log("New key is " + newAddressRef.key);
        res.send("New key is " + newAddressRef.key);
    }
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/helloworld', this.getAll);
        this.router.get('/', this.checkForMovedAddress);
        this.router.post('/', this.storeAddress);
    }
}
exports.RelayRouter = RelayRouter;
// Create the HeroRouter, and export its configured Express.Router
const serverRoutes = new RelayRouter();
serverRoutes.init();
exports.default = serverRoutes.router;
