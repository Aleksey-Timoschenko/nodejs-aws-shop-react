# React-shop-cloudfront

## **TASK 2**
1. Manually uploaded to s3
- s3 static website link - http://rs-site-aws-bucket-manually.s3-website.eu-north-1.amazonaws.com/
2. Manually created cloudfront distribution + invalidation for cloudfront
- cloudfront link - https://d3musmbuftn5qp.cloudfront.net/
- s3 link - http://rs-site-aws-bucket-manually-not-public.s3-website.eu-north-1.amazonaws.com/ (such static site does not exist, because I restricted access)
3. Set up infrastructure with aws cdk
- cloudfront link - https://d1akx69qkmi8fp.cloudfront.net/

All 3 tasks were finished 
1. Manually create s3 bucket, upload site content and use s3 bucket as static site 
2. Manually create cloudfront distribution and connect with s3 bucket + manually create invalidation for cloudfront distribution
3. Use aws cdk for creating s3 bucket and cloudfront distribution + connect them between each other

## **TASK 3**
Within this task path for products path was updated to suit our new endpoints
- /products
- /products/{id}

To check data from new endpoints

1. Open https://d1akx69qkmi8fp.cloudfront.net/ (At the main page you will find data which is loaded from /products endpoint)
2. Then click on Manage products and on opened table choose any product and click manage
3. Page for particular product will be opened, data for this page is loaded from /products/{id} endpoint

## Useful Scripts

### `start`

Starts the project in dev mode with mocked API on local environment.

### `build`

Builds the project for production in `dist` folder.

### `cdk:bootstrap`

Connect cdk with you aws account

### `cdk:deploy`
