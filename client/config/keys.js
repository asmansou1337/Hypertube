/// Credentials for strategies

module.exports = {
    google: {
        callbackURL:'/auth/google/redirect',
        clientID:'',
        clientSecret:''
    },
    FortTwo:{
        clientID: '',
        clientSecret: '',
        callbackURL: "/auth/fortytwo/redirect"
    },
    cookieKey: 'Hypertube',
    mailKeys: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
           user: 'Email',
           pass: 'Email Password'
        }
      },
    imdbKey: 'a7289f37'

}