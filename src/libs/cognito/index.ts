import AWS from "aws-sdk";
import {
  AccessClaim,
  ClaimVerifyRequest,
  ClaimVerifyResult,
  IDClaim,
  MapOfKidToPublicKey,
  PublicKeys,
  TokenHeader,
} from "./types";
import { promisify } from "util";
import jsonwebtoken from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import axios from "axios";

const cognito = new AWS.CognitoIdentityServiceProvider();

const cognitoPoolId = process.env.USER_POOL || "";
const cognitoIssuer = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${cognitoPoolId}`;

const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

let cacheKeys: MapOfKidToPublicKey | undefined;

const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
  if (!cacheKeys) {
    const url = `${cognitoIssuer}/.well-known/jwks.json`;
    const publicKeys = await axios.get<PublicKeys>(url);
    cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
      const pem = jwkToPem(current as any);
      agg[current.kid] = { instance: current, pem };
      return agg;
    }, {} as MapOfKidToPublicKey);
    return cacheKeys;
  } else {
    return cacheKeys;
  }
};

export const verifyToken = async (
  request: ClaimVerifyRequest
): Promise<ClaimVerifyResult> => {
  let result: ClaimVerifyResult;
  try {
    console.log(`user claim verify invoked for ${JSON.stringify(request)}`);
    const token = request.token;
    const tokenSections = (token || "").split(".");
    if (tokenSections.length < 2) {
      throw new Error("requested token is invalid");
    }
    const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
    const header = JSON.parse(headerJSON) as TokenHeader;
    const keys = await getPublicKeys();
    const key = keys[header.kid];
    if (key === undefined) {
      console.log("claim made for unknown kid");
      throw new Error("claim made for unknown kid");
    }
    const tempClaim = await verifyPromised(token, key.pem);
    const claim: AccessClaim | IDClaim =
      tempClaim.token_use === "id"
        ? (tempClaim as IDClaim)
        : (tempClaim as AccessClaim);
    console.log("Claim", claim);
    const currentSeconds = Math.floor(new Date().valueOf() / 1000);
    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error("claim is expired or invalid");
    }
    if (claim.iss !== cognitoIssuer) {
      throw new Error("claim issuer is invalid");
    }
    if (claim.token_use !== "access") {
      throw new Error("claim use is not access");
    }
    console.log(`claim confirmed for ${claim.username}`);
    result = {
      userName: claim.username,
      clientId: claim.client_id,
      isValid: true,
    };
  } catch (error) {
    result = { userName: "", clientId: "", error, isValid: false };
  }
  return result;
};

export const cognitoUserSub = async (accessToken) => {
  try {
    const p = {
      AccessToken: accessToken,
    };
    const response = await cognito.getUser(p).promise();
    return response?.UserAttributes?.find((v) => v.Name === "sub")?.Value;
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const cognitoGetUser = async (emailId: string) => {
  const params = {
    UserPoolId: process.env.USER_POOL,
    Username: emailId,
  };
  try {
    const response = await cognito.adminGetUser(params).promise();
    return response?.UserAttributes?.find((v) => v.Name === "sub")?.Value;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const cognitoDeleteUser = async (emailId: string) => {
  const params = {
    UserPoolId: process.env.USER_POOL,
    Username: emailId,
  };
  try {
    const response = await cognito.adminDeleteUser(params).promise();
    console.log("delete response here ", response);
    return response;
  } catch (e) {
    console.log("delete error ", e);
    return null;
  }
};
