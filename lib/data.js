const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "/../.data/");

//write data to file
lib.create = function (dirName, fileName, data, callback) {
  //open file
  fs.open(
    lib.basedir + dirName + "/" + fileName + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        //write data to file
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("Error when close file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback(err);
      }
    }
  );
};

//read
lib.read = function (dirName, fileName, callback) {
  fs.readFile(
    lib.basedir + dirName + "/" + fileName + ".json",
    "utf-8",
    function (err, data) {
      callback(err, data);
    }
  );
};

//update

lib.update = (dirName, fileName, data, callback) => {
  fs.open(
    lib.basedir + dirName + "/" + fileName + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        //write data to file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error when close file");
                  }
                });
              } else {
                callback("Error writing to new file");
              }
            });
          } else {
            console.log(err);
          }
        });
      } else {
        callback(err);
      }
    }
  );
};

//delete
lib.delete = (dirName, fileName, callback) => {
  fs.unlink(lib.basedir + dirName + "/" + fileName + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      console.log(err);
    }
  });
};

//get all
lib.getAll = (dirName, callback) =>{
  fs.readdir(lib.basedir + dirName, (err, fileNames) => {
    if(!err && fileNames && fileNames.length > 0){
      let trimedFileName = [];
      fileNames.forEach(file => {
        trimedFileName.push(file.replace('.json', ''));
      })
      callback(false, trimedFileName);
    }
    else{
      callback(err);
    }
  })
}
module.exports = lib;
