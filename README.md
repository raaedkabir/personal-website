## Personal Website

<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/made-with-vue.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)

[![Build Status](https://travis-ci.com/ToddLowell/personal-website.svg?branch=master)](https://travis-ci.com/ToddLowell/personal-website)

</div>

---

**AWS Hosting**

- DNS setup with Route 53
- SSL Certificate from Certificate Manager
- Staitc hosting on S3
- Distribution with CloudFront

---

**CI/CD Build Pipeline using Travis CI**

1. Merge code to master branch
2. Run build
3. Upload /dist to S3
4. Invalidate CloudFront's cache

---

**Troubles with Configuring Client-Side Routing**

- Setting the Error Document in S3 makes potential valid URLs treated as 404s
- Customizing the Error Response in CloudFront treats invalid URLs as 200s
- Adding a Lamda@Edge Viewer Request Interceptor to check the route against known routes

This webapp is using the third option with the following code:

```js
// array of known routes
const pages = [...known_routes];

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;

  // replace URI if route is valid
  if (pages.indexOf(request.uri.slice(1)) > -1) {
    request.uri = '/index.html';
  }

  // pass route back to request
  callback(null, request);
};
```
