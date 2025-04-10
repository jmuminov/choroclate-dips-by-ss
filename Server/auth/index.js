const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { JWT_SECRET } = process.env;
const { v4: uuidv4 } = require("uuid");

