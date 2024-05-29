    function auth (req, res, next) {
        if(req.session?.user?.admin){
            return next()
        }
        return res.status(403).send('Error de autorizacion')
    }

    export default auth