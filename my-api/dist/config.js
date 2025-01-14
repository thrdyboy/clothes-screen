"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBUrl = exports.port = exports.nodeEnv = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
exports.nodeEnv = process.env.NODE_ENV || 'development';
const envFile = exports.nodeEnv === 'development' ? '.env.development' : '.env';
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, `../${envFile}`) });
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, `../${envFile}.local`), override: true });
exports.port = process.env.PORT || 8000;
exports.DBUrl = process.env.DATABASE_URL;
