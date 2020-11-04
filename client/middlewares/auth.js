
const auth = async (req, res, next) => {
        const user = req.user
        if (!user || !user.verified) 
            return res.redirect('/auth/login')
        else
            next()
}

module.exports = auth