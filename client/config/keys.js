/// Credentials for strategies

module.exports = {
    google: {
        callbackURL:'/auth/google/redirect',
        clientID:'933382993303-k46810dcfvkdtppna7sapskk2o5bmfc5.apps.googleusercontent.com',
        clientSecret:'ITd_kLRAixPnvKqEU15hEmzR'
    },
    FortTwo:{
        clientID: '79cf16e509f898b31f182761b4ef3617ee835d480cfe505fb370b5cd9c37c92e',
        clientSecret: '6aa1684a13618942ff725cfe1d6c99fc44e6903fd02aa51548e3f58db7eccce4',
        callbackURL: "/auth/fortytwo/redirect"
    },
    Facebook : {
        clientID: '1590464764441073',
        clientSecret: '94e3a6589e403bf8b9fcccca8300bca3',
        callbackURL: "/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'emails', 'picture.type(large)']
        
    },
    Github: {  
        clientID: 'fdd64d67895298085b36',
        clientSecret: 'ec296e8542d4890b50767f0d4e9124dc89c27902',
        callbackURL: "/auth/github/redirect"
    },
    cookieKey: 'Hypertube',
    mailKeys: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
           user: 'asmansou1337@gmail.com',
           pass: 'FYdNWP)7mP{Q##(6'
        }
      },
    imdbKey: 'a7289f37'

}