var express = require('express')
const checkJwt = require('./middleware/jwt.middleware')
const checkIfAdmin = require('./middleware/admin.middleware')

const AdminCognitoService = require('./services/cognito.admin.config')


module.exports = function () {
    const router = express.Router()
    const cognito = new AdminCognitoService();

    router.post('/sign-in', function (req, res) {

        const { username, password } = req.body;

        cognito.adminSignIn(username, password)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.post('/set-user-password', checkJwt, checkIfAdmin, function (req, res) {

        const { username, password } = req.body;

        cognito.setUserPassword(username, password)
            .then(result => {
                if (result.statusCode === 201) {
                    res.status(200).json(result).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.get('/users/:username', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username
        cognito.getUser(username)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.get('/users', checkJwt, checkIfAdmin, function (req, res) {

        // req.query.token replaces the + with a space, making the token incorrect
        const token = req.query.pagination_token
        const limit = req.query.limit
        const filterAttribute = req.query.filter_attribute
        const filterValue = req.query.filter_value

        let paginationToken = undefined
        if (token) {
            // re adds the + which makes the token correct again
            paginationToken = token.replace(/\ /g, '+')
        }

        cognito.getUsers(paginationToken, limit, filterAttribute, filterValue)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.get('/:username', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username
        cognito.getAdmin(username)
            .then(result => {
                if (result.statusCode === 200) {
                    console.log(result);
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })
    router.get('/', checkJwt, checkIfAdmin, function (req, res) {
        // req.query.token replaces the + with a space, making the token incorrect
        const token = req.query.pagination_token
        const limit = req.query.limit
        const filterAttribute = req.query.filter_attribute
        const filterValue = req.query.filter_value

        let paginationToken = undefined
        if (token) {
            // re adds the + which makes the token correct again
            paginationToken = token.replace(/\ /g, '+')
        }

        cognito.getAdmins(paginationToken, limit, filterAttribute, filterValue)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.post('/users', checkJwt, checkIfAdmin, async function (req, res) {
        const { username, password } = req.body;
        // admin have to put in extra parameter email to create user

        cognito.createUser(username, password)
            .then(result => {
                if (result.statusCode === 201) {
                    res.status(201).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })
    router.post('/', checkJwt, checkIfAdmin, function (req, res) {
        const { username, password } = req.body;

        cognito.createAdmin(username, password)
            .then(result => {
                if (result.statusCode === 201) {
                    res.status(201).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.delete('/users/:username', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username;

        cognito.deleteUser(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.delete('/:username', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username;

        cognito.deleteAdmin(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else {
                    console.log(result);
                    res.status(400).json(result).end();
                }
            })
    })

    router.put('/users/:username', checkJwt, checkIfAdmin, function (req, res) {

        const username = req.params.username;
        const { userAttributes } = req.body;

        cognito.updateUserAttributes(username, userAttributes)
            .then(result => {
                if (result.statusCode === 204) {
                    res.status(204).json(result.data).end();

                } else if (result.statusCode === 400) {
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.put('/users/:username/enable', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username;

        cognito.enableUser(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();

                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.put('/users/:username/disable', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username;

        cognito.disableUser(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();

                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.put('/:username', checkJwt, checkIfAdmin, function (req, res) {

        const username = req.params.username;
        const { userAttributes } = req.body;

        cognito.updateAdminAttributes(username, userAttributes)
            .then(result => {
                if (result.statusCode === 204) {
                    res.status(204).json(result.data).end();

                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.put('/:username/enable', checkJwt, checkIfAdmin, function (req, res) {

        const username = req.params.username;

        cognito.enableAdmin(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();

                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })
    router.put('/:username/disable', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username;

        cognito.disableAdmin(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();

                } else if (result.statusCode === 400) {
                    console.log(result);
                    res.status(400).json(result).end();
                } else {
                    console.log(result);
                    res.status(500).json(result).end();
                }
            })
    })

    router.post('/reset-user-password/:username', checkJwt, checkIfAdmin, function (req, res) {
        const username = req.params.username;

        cognito.resetUserPassword(username)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else if (result.statusCode === 400) {
                    res.status(400).json(result).end();
                } else {
                    res.status(500).json(result).end();
                }
            })
    })

    router.post('/set-admin-password', checkJwt, checkIfAdmin, function (req, res) {
        const { username, password } = req.body;

        cognito.setAdminPassword(username, password)
            .then(result => {
                res.status(200).json(result).end();
            })
    })

    router.post('/force-change-password', function (req, res) {

        const { username, password, session } = req.body;

        cognito.respondToAuthChallenge(username, password, session)
            .then(result => {
                if (result.statusCode === 200) {
                    res.status(200).json(result.data).end();
                } else {
                    res.status(400).json(result).end();
                }
            })
    })

    return router
}