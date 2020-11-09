/// Credentials for strategies

module.exports = {
    google: {
        callbackURL:'/auth/google/redirect',
        clientID:'871445564025-cd05644vmhkc5qk8ofhuu1ipfscvfu61.apps.googleusercontent.com',
        clientSecret:'HAuNCQ3BQlKxZIXNclOwgRm4'
    },
    FortTwo:{
        clientID: '626738476d45bbd5dac31b6721d0d5b1d1db4fec405704edcbdaff58d8b1224d',
        clientSecret: '14edb0e02574b06bcbdba5d51732fd6f4f9957d17ce31480a5ba98545c889aa5',
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
        secure: false,
        auth: {
           user: 'asmansou1337@gmail.com',
           pass: 'FYdNWP)7mP{Q##(6'
        }
      },
    imdbKey: 'a7289f37'

}