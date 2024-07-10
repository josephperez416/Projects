"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_mongoConnect = require("./mongoConnect");
var import_profile = __toESM(require("./profile"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json());
(0, import_mongoConnect.connect)("Cluster0");
app.get("/api/profiles", (req, res) => __async(exports, null, function* () {
  try {
    const profiles = yield import_profile.default.find({});
    res.json(profiles);
  } catch (error) {
    res.status(500).send(error.message);
  }
}));
app.get("/api/login", (req, res) => __async(exports, null, function* () {
  const { gmail, password } = req.query;
  try {
    const profile = yield import_profile.default.findOne({ gmail, password });
    if (profile) {
      res.json(profile);
    } else {
      res.status(401).send("Authentication failed");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}));
app.post("/api/signup", (req, res) => __async(exports, null, function* () {
  try {
    console.log(req.body);
    const { gmail, password } = req.body;
    const newProfile = new import_profile.default({ gmail, password });
    const savedProfile = yield newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).send(error.message);
  }
}));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
