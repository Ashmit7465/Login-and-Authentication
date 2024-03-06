import mongoose from "mongoose";
import express from "express"

const userSchema = new mongoose.Schema({
      username: {
            type: String,
            required: [true, "Please provide a unique username"],
            unique: [true, "Username alreadyd exits"],
      },
      password: {
            type: String,
            required: [true, "Please provide a password"],
            unique: false,
      },
      email: {
            type: String,
            required: [true, "Please provide a unique email id"],
            unique: true,
      },
      firstName: {
            type: String,
      },
      lastName: {
            type: String,
      },
      mobile: {
            type: Number,
      },
      address: {
            type: String,
      },
      profile: {
            type: String,
      }
});

export const User = mongoose.model("User", userSchema);