import { Router } from 'express'
import jwt from 'jsonwebtoken'


export class RouterClass {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter = () => this.router

    init = () => { }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponse(req, res, next) {
        res.sendSucces = payload => res.send({ status: 'success', payload })
        res.sendServerError = err => res.send({ status: 'error', err })
        res.sendSessionError = error => res.send({ status: 'error', error })
        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next()
        const authHeaders = req.headers.authorization
        if (!authHeaders) return res.status(401).send({ status: 'error', error: 'Unauthorized' })
        const token = authHeaders.split('')[1]
        let userVerified = jwt.verify(token, 'palabrasecreta')
        if(!policies.includes(user.role.toUpperCase())) return res.status(401).send({ status: 'error', error: 'No permission' })
        req.user = user;
        next()     
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.generateCustomResponse, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }
}