import {Router, Request, Response, NextFunction} from 'express';
import { OriginalAddressInfo } from "../models/address-info.interface";
import {OriginalAddressInfoPojo} from "../models/address-infopojo"
import * as admin from 'firebase-admin';
import {} from 'firebase-admin'
import { FileUtils } from '../utils/fileUtils';
//const Heroes = require('../data');

export class RelayRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Address.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    var db = admin.database();
    var ref = db.ref("original-address-list");
    ref.once("value", function(snapshot) {
      console.log(snapshot.val());
    });
    console.log("calling a program");
    FileUtils.callProgram();
    res.send("Server get All call.");
  }


  /**
   * GET one hero by id
   */
  public checkForMovedAddress(req: Request, res: Response, next: NextFunction) {
  
    console.log("Check Moved address");
    var id = req.query.key;
    console.log(id);
    var db = admin.database();
    var ref = db.ref("original-address-list");
    ref.orderByKey().equalTo(id).once('value', function(snap) {
        if (snap.exists()) {
            console.log(snap.val());
           let name = snap.child(`${id}/recipientName`).val();
            let address = snap.child(`${id}/recipientAddress`).val();
            let mailerId = snap.child(`${id}/mailerId`).val();
            //console.log(snap.child(id).child("recipientAddress").val());
             FileUtils.createInputFile(mailerId,name,address);
             FileUtils.callProgram();
             FileUtils.waitForOutputFile();
             
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

  public storeAddress(req: Request, res: Response){
    console.log("POST Method");
    var db = admin.database();
    var ref = db.ref("original-address-list");
    var addressInfo = req.body;
    console.log(addressInfo)
    let newAddressRef = ref.push(addressInfo,function(error){
        if(error)
        {
            console.log("An Error Occured");
        }
        else
        {
            console.log("Address was successfullysaved.")    
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
    this.router.post('/',this.storeAddress);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const serverRoutes = new RelayRouter();
serverRoutes.init();

export default serverRoutes.router;