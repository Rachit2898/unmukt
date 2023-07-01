let baseURL;

if (__DEV__) {
  baseURL =
    'http://unnmuktsaathiprodbackend-env-1.eba-a8422rfp.ap-south-1.elasticbeanstalk.com';
} else {
  baseURL =
    'http://sathiunmuktapp-env.eba-pp925g5c.ap-south-1.elasticbeanstalk.com';
}

export default baseURL;
