/**
 * @file Defines the unhandled route handler.
 */

const { asyncWrapper } = require('../middleware');

const express = require('express');
const util = require('util');
const plaid = require('../plaid');
const fetch = require('node-fetch');
const { retrieveItemById } = require('../db/queries');

const router = express.Router();

router.post(
  '/',
  asyncWrapper(async (req, res) => {
    try {
      const { userId, itemId } = req.body;
      let accessToken = null;
      let products = ['transactions'];
      if (itemId != null) {
        const itemIdResponse = await retrieveItemById(itemId);
        accessToken = itemIdResponse.plaid_access_token;
        products = [];
      }
      const response = await fetch('http://ngrok:4040/api/tunnels');
      const { tunnels } = await response.json();
      const httpTunnel = tunnels.find(t => t.proto === 'http');
      const linkTokenParams = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'uniqueId' + userId,
        },
        client_name: 'Pattern',
        products,
        country_codes: ['US'],
        language: 'en',
        webhook: httpTunnel.public_url + '/services/webhook',
        access_token: accessToken,
        redirect_uri: 'http://localhost:3000/oauth-link',
      };
      const createResponse = await plaid.linkTokenCreate(linkTokenParams);
      res.json(createResponse.data);
    } catch (err) {
      console.log('error while fetching client token', err);
      throw err;
      // throw err;
    }
  })
);

module.exports = router;
