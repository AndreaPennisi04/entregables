import mongoose, { Schema } from "mongoose";
import { Router } from "express";

const router = Router();

const collection = "Users";
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

export const userModel = mongoose.model(collection, userSchema);
