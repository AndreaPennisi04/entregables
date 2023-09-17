import Stripe from "stripe";
import config from "../config/config.js";

const { STRIPE_KEY } = config;

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: "2023-08-16",
});

export default stripe;
