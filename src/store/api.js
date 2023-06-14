import axios from "axios";

const apiEndpoint = "https://au-api.basiq.io";
const apiKey =
  "OTY2ZGNlOTYtYTVhYS00MTRhLWE1OGQtMDU1NTkzM2E2ODM3OjhkMmNmOGY0LTI3NmEtNDFlZC05ZWE5LTk0MDQ2MTkxMTAxZQ==";
const accessTokenEndpoint = `${apiEndpoint}/token`;

export const BASE_URL = "https://au-api.basiq.io";

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

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     Authorization: `Bearer ${getAccessToken()}`,
//     "Content-Type": "application/json",
//   },
// });

// export default api;

// const refreshAccessToken = async () => {
//   try {
//     const accessToken = await getAccessToken();
//   } catch (error) {
//     console.error("Error refreshing access token:", error);
//   }
// };

// setInterval(refreshAccessToken, 3600000);
