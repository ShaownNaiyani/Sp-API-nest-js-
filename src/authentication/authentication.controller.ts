import { Controller, Get, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Interface } from 'readline';

interface Creds{
    AccessKeyId: any,
    SessionToken: any,
    SecretAccessKey: any,
}
@Controller('authentication')
export class AuthenticationController {

    AccessToken:any;
    TempCreds: Creds ={
        AccessKeyId: undefined,
        SessionToken: undefined,
        SecretAccessKey: undefined
    };

    ProductImage:string[] = undefined;
    ProductName:string = undefined;
    ASIN:any = undefined;
    SalesRankCurr:any = undefined;
    AmazonPrice:any = undefined;
    MonthlySales:any = undefined;


    constructor(private authSerive:AuthenticationService){}

   
    @Get('catalog-items')
    async getCatalogItems(){
         //get accesstoken
        const token = await this.authSerive.requestAccessToken();
        this.AccessToken=token.access_token;

        //get credentials
        const tempCreds = await this.authSerive.getTempCredentials();
        this.TempCreds.AccessKeyId = tempCreds.AccessKeyId;
        this.TempCreds.SecretAccessKey = tempCreds.SecretAccessKey;
        this.TempCreds.SessionToken = tempCreds.SessionToken;

        const requestAwsSign = await this.authSerive.getCatalogItem('A2EUQ1WTGCTBG2','B01NAXTMVU',this.AccessToken,this.TempCreds);
        const itmesData = await this.authSerive.getData(requestAwsSign);

        return itmesData;
    }

    @Get('sales-info')
    async getSalesInfo(){
         //get accesstoken
        const token = await this.authSerive.requestAccessToken();
        this.AccessToken=token.access_token;

        //get credentials
        const tempCreds = await this.authSerive.getTempCredentials();
        this.TempCreds.AccessKeyId = tempCreds.AccessKeyId;
        this.TempCreds.SecretAccessKey = tempCreds.SecretAccessKey;
        this.TempCreds.SessionToken = tempCreds.SessionToken;

        const requestAwsSign = await this.authSerive.getSalesInfo('A2EUQ1WTGCTBG2','B01NAXTMVU',this.AccessToken,this.TempCreds);
        const itmesData = await this.authSerive.getData(requestAwsSign);

        return itmesData;
    }

    @Get('amazon-fba-fees')
    async getAmazonFBAfees(){
         //get accesstoken
        const token = await this.authSerive.requestAccessToken();
        this.AccessToken=token.access_token;

        //get credentials
        const tempCreds = await this.authSerive.getTempCredentials();
        this.TempCreds.AccessKeyId = tempCreds.AccessKeyId;
        this.TempCreds.SecretAccessKey = tempCreds.SecretAccessKey;
        this.TempCreds.SessionToken = tempCreds.SessionToken;

        const requestAwsSign = await this.authSerive.getAmazonFBAfees('A2EUQ1WTGCTBG2','B01NAXTMVU',this.AccessToken,this.TempCreds);
        const itmesData = await this.authSerive.getData(requestAwsSign);

        return itmesData;
    }

    @Get('sellers-info')
    async getSellerInfo(){
         //get accesstoken
        const token = await this.authSerive.requestAccessToken();
        this.AccessToken=token.access_token;

        //get credentials
        const tempCreds = await this.authSerive.getTempCredentials();
        this.TempCreds.AccessKeyId = tempCreds.AccessKeyId;
        this.TempCreds.SecretAccessKey = tempCreds.SecretAccessKey;
        this.TempCreds.SessionToken = tempCreds.SessionToken;

        const requestAwsSign = await this.authSerive.getSellersInfo('A2EUQ1WTGCTBG2',this.AccessToken,this.TempCreds);
        const itmesData = await this.authSerive.getData(requestAwsSign);

        return itmesData;
    }
    

}
