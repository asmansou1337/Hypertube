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
    cookieKey: 'Hypertube',
    mailKeys: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
           user: 'asmansou92@gmail.com',
           pass: 'B&dTaN#rQcWz'
        }
      },
    imdbKey: 'a7289f37'

}