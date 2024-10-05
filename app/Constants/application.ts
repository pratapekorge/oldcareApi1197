const base = '/api';

export default {
    url: {
        base,
    },
    timers: {

    },
    env: {

    },
    authorizationIgnorePath: [
          `${base}/admin/login`,
          `${base}/admin/forgetpassword`,
          `/uploads/`,
          `${base}/customer/sendotp`,
          `${base}/customer/verifyotp`,
          `${base}/customer/fetch/countrycode`,


        
      
    ],
    Roles:{
        SuperAdmin: 1,
        Admin: 2,
        Customer: 3,
        Agent: 4
    },
    duration:{
        Monthly: 1,
        Yearly:12
    }
};
