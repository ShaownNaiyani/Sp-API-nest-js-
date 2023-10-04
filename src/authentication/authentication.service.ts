import { Injectable } from '@nestjs/common';
import * as https from 'https';
import { resolve } from 'path';

const qs = require('qs');
const fetch = require('node-fetch');
const AWS4 = require('aws4');
const AWS = require('aws-sdk');
const STS = new AWS.STS();

@Injectable()
export class AuthenticationService {


    async requestAccessToken(): Promise<any>{
        const body = {
          grant_type: 'refresh_token',
          client_id: process.env.lwa_app_id,
          refresh_token: process.env.refresh_token,
          client_secret: process.env.lwa_client_secret,
        };
    
        const response = await fetch('https://api.amazon.com/auth/o2/token', {
          method: 'POST',
          body: qs.stringify(body),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        });
    
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
    }
    
    async getTempCredentials(): Promise<any>{

        const {
            Credentials: { AccessKeyId, SecretAccessKey, SessionToken },
          } = await STS.assumeRole({
            RoleArn: process.env.role_arn,
            RoleSessionName: 'sp-api'
        }).promise()
        return {
            AccessKeyId,
            SecretAccessKey,
            SessionToken,
          };

    }

    async getCatalogItem(marketPlaceId:string,asin:any,accessToken: any, Credentials:any): Promise<any>{

      console.log(typeof(marketPlaceId))
      const{
        AccessKeyId,
        SecretAccessKey,
        SessionToken

      } = Credentials;

      const params = {
        path: `/catalog/2022-04-01/items/${asin}?marketplaceIds=${marketPlaceId}&includedData=attributes,identifiers,images,productTypes,salesRanks,summaries`,
        method:'GET',
        host:'sellingpartnerapi-na.amazon.com',
        region:'us-east-1',
        service: 'execute-api',
        headers:{
          'User-Agent': 'MyAmazonApp/1.0 (Language=JavaScript;)',
			    'x-amz-access-token': accessToken,
        }
      }
      return AWS4.sign(params,{accessKeyId: AccessKeyId, secretAccessKey: SecretAccessKey, sessionToken: SessionToken})
    }


    async getSalesInfo(marketPlaceId:string,asin:any,accessToken: any, Credentials:any): Promise<any>{

      console.log(typeof(marketPlaceId))
      const{
        AccessKeyId,
        SecretAccessKey,
        SessionToken

      } = Credentials;
      const params = {
        path: `/sales/v1/orderMetrics?marketplaceIds=${marketPlaceId}&interval=2023-09-03T00:00:00-07:00--2023-10-04T00:00:00-07:00&granularity=Total&asin=${asin}`,
        method:'GET',
        host:'sellingpartnerapi-na.amazon.com',
        region:'us-east-1',
        service: 'execute-api',
        headers:{
          'User-Agent': 'MyAmazonApp/1.0 (Language=JavaScript;)',
			    'x-amz-access-token': accessToken,
        }
      }
      return AWS4.sign(params,{accessKeyId: AccessKeyId, secretAccessKey: SecretAccessKey, sessionToken: SessionToken})
    }


    async getAmazonFBAfees(marketPlaceId: string, asin: any, accessToken: string, Credentials: any): Promise<any> {
      const body = {
        FeesEstimateRequest: {
          MarketplaceId: marketPlaceId,
          PriceToEstimateFees: {
            ListingPrice: {
              CurrencyCode: 'CAD',
              Amount: 10,
            },
            Shipping: {
              CurrencyCode: 'CAD',
              Amount: 10,
            },
            Points: {
              PointsNumber: 0,
              PointsMonetaryValue: {
                CurrencyCode: 'CAD',
                Amount: 0,
              },
            },
          },
          Identifier: 'sh22',
          IsAmazonFulfilled: true,
        },
      };
      
      const {
        AccessKeyId,
        SecretAccessKey,
        SessionToken
      } = Credentials;
    
      const headers = {
        'User-Agent': 'MyAmazonApp/1.0 (Language=JavaScript;)',
        'Accept':'application/json',
        'Content-Type': 'application/json',
        'x-amz-access-token': accessToken,
      };
      const requestBody = JSON.stringify(body);
    
      const params = {
        path: `/products/fees/v0/items/${asin}/feesEstimate`,
        method: 'POST',
        host: 'sellingpartnerapi-na.amazon.com',
        region: 'us-east-1',
        service: 'execute-api',
        headers,
        body: requestBody,
        
      };
    
      return AWS4.sign(params, { accessKeyId: AccessKeyId, secretAccessKey: SecretAccessKey, sessionToken: SessionToken });
    }

    async getSellersInfo(marketPlaceId:string,accessToken: any, Credentials:any): Promise<any>{

      const{
        AccessKeyId,
        SecretAccessKey,
        SessionToken

      } = Credentials;
      const params = {
        path: `/sellers/v1/marketplaceParticipations`,
        method:'GET',
        host:'sellingpartnerapi-na.amazon.com',
        region:'us-east-1',
        service: 'execute-api',
        headers:{
          'User-Agent': 'MyAmazonApp/1.0 (Language=JavaScript;)',
			    'x-amz-access-token': accessToken,
        }
      }
      return AWS4.sign(params,{accessKeyId: AccessKeyId, secretAccessKey: SecretAccessKey, sessionToken: SessionToken})
    }
    

  
    async getData(signedRequestData: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const req = https.request(signedRequestData, (res) => {
          let data = '';
          const { statusCode } = res;
    
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            try {
              const parsedResponse = JSON.parse(data);
    
              if (statusCode === 200) {
                resolve(parsedResponse);
              } else {
                reject({ statusCode, response: parsedResponse });
              }
            } catch (error) {
              // JSON parsing error
              reject(error);
            }
          });
        });
    
        req.on('error', (error) => {
          // Network or request error
          reject(error);
        });
    
        req.end();
      });
    }
    
}
