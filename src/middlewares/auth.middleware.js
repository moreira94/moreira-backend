    function auth (req, res, next) {
        if(req.session?.user?.email === 'f@gmail.com'  && req.session?.user?.admin){
            return next()
        }
        return res.status(401).send('Error de autorizacion')
    }

    export default auth