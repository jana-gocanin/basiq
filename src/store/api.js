import axios from "axios";
const config = require("../config.js");

const apiKey = config.apiKey;
export const BASE_URL = "https://au-api.basiq.io";
const accessTokenEndpoint = `${BASE_URL}/token`;

export const getAccessToken = async () => {
  const authHeader = `Basic ${apiKey}`;

  try {
    const response = await axios.post(
      accessTokenEndpoint,
      "scope=SERVER_ACCESS",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "basiq-version": "2.1",
          Authorization: authHeader,
        },
      }
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

const refreshAccessToken = async () => {
  try {
    await getAccessToken();
  } catch (error) {
    console.error("Error refreshing access token:", error);
  } finally {
    setTimeout(refreshAccessToken, 3600000); //nece se desiti da se pozove pre nego sto je dobijen token iz try bloka
  }
};

refreshAccessToken();
