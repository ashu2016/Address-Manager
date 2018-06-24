"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const fs = require("fs");
var chokidar = require('chokidar');
class FileUtils {
    static callProgram() {
        var child = require('child_process').execFile;
        var executablePath = "C:\\test\\FileCopier.exe";
        var parameters = ["c:\\test\\test.txt"];
        child(executablePath, parameters, function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
    }
    static createInputFile(mailerId, name, address) {
        console.log("Inside crateInputFile, name: " + name + " AND address: " + address);
        let addressString = mailerId + "|" + name + "|" + address;
        fs.writeFile("c:\\test\\test.txt", addressString, function (err) {
            if (err) {
                console.log("there was an error writing file");
            }
            else {
                console.log("file was created successfully");
            }
        });
    }
    static waitForOutputFile() {
        console.log("Inside waitForOutputFile");
        // Initialize watcher.
        var watcher = chokidar.watch('c:\\test\\output.txt', {
            persistent: true
        });
        //watcher.add("output.txt");
        watcher
            .on('add', function (path) {
            console.log(`File ${path} has been added`);
            let data = fs.readFileSync(path, "utf8").split("\r\n");
            let data1 = data.toString().split("|");
            if (data1.length == 4) {
                console.log(data1[0] + data1[1] + data1[2]);
                let movedAddressInfo = {
                    mailerId: data1[0],
                    recipientName: data1[1],
                    recipientAddress: data1[2],
                    movedAddress: data1[3]
                };
                var db = admin.database();
                var ref = db.ref("moved-address-list");
                let newAddressRef = ref.push(movedAddressInfo, function (error) {
                    if (error) {
                        console.log("An Error Occured");
                    }
                    else {
                        console.log("Address was successfullysaved.");
                    }
                });
            }
            watcher.close();
        });
    }
}
exports.FileUtils = FileUtils;
