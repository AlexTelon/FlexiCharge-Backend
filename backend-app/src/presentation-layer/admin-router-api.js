var express = require("express");

module.exports = function ({ adminCognitoService, verifyUser, verifyAdmin }) {
  const router = express.Router();
  const cognito = new adminCognitoService();

  router.post("/sign-in", function (req, res) {
    const { username, password } = req.body;

    cognito.adminSignIn(username, password).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.post("/set-user-password", verifyUser, verifyAdmin, function (req, res) {
    const { username, password } = req.body;

    cognito.setUserPassword(username, password).then((result) => {
      if (result.statusCode === 201) {
        res.status(200).json(result).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.get("/users/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;
    cognito.getUser(username).then((result) => {
      if (result.statusCode === 200) {
        console.log(result);
        res.status(200).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.get("/users", verifyUser, verifyAdmin, function (req, res) {
    // req.query.token replaces the + with a space, making the token incorrect
    const token = req.query.pagination_token;
    const limit = req.query.limit;
    const filterAttribute = req.query.filter_attribute;
    const filterValue = req.query.filter_value;

    let paginationToken = undefined;
    if (token) {
      // re adds the + which makes the token correct again
      paginationToken = token.replace(/\ /g, "+");
    }

    cognito.getUsers(paginationToken, limit, filterAttribute, filterValue).then((result) => {
      if (result.statusCode === 200) {
        console.log(result);
        res.status(200).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.get("/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;
    cognito.getAdmin(username).then((result) => {
      if (result.statusCode === 200) {
        console.log(result);
        res.status(200).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });
  router.get("/", verifyUser, verifyAdmin, function (req, res) {
    // req.query.token replaces the + with a space, making the token incorrect
    const token = req.query.pagination_token;
    const limit = req.query.limit;
    const filterAttribute = req.query.filter_attribute;
    const filterValue = req.query.filter_value;

    let paginationToken = undefined;
    if (token) {
      // re adds the + which makes the token correct again
      paginationToken = token.replace(/\ /g, "+");
    }

    cognito.getAdmins(paginationToken, limit, filterAttribute, filterValue).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.post("/users", verifyUser, verifyAdmin, async function (req, res) {
    const { username, password } = req.body;

    cognito.createUser(username, password).then((result) => {
      if (result.statusCode === 201) {
        res.status(201).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });
  router.post("/", verifyUser, verifyAdmin, function (req, res) {
    const { username, password } = req.body;

    cognito.createAdmin(username, password).then((result) => {
      if (result.statusCode === 201) {
        res.status(201).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.delete("/users/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.deleteUser(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else if (result.statusCode === 400) {
        console.log(result);
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });

  router.delete("/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.deleteAdmin(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else {
        console.log(result);
        res.status(400).json(result).end();
      }
    });
  });

  router.put("/users/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;
    const { userAttributes } = req.body;

    cognito.updateUserAttributes(username, userAttributes).then((result) => {
      if (result.statusCode === 204) {
        res.status(204).json(result.data).end();
      } else if (result.statusCode === 400) {
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });

  router.put("/users/:username/enable", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.enableUser(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else if (result.statusCode === 400) {
        console.log(result);
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });

  router.put("/users/:username/disable", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.disableUser(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else if (result.statusCode === 400) {
        console.log(result);
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });

  router.put("/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;
    const { userAttributes } = req.body;

    cognito.updateAdminAttributes(username, userAttributes).then((result) => {
      if (result.statusCode === 204) {
        res.status(204).json(result.data).end();
      } else if (result.statusCode === 400) {
        console.log(result);
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });

  router.put("/:username/enable", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.enableAdmin(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else if (result.statusCode === 400) {
        console.log(result);
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });
  router.put("/:username/disable", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.disableAdmin(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else if (result.statusCode === 400) {
        console.log(result);
        res.status(400).json(result).end();
      } else {
        console.log(result);
        res.status(500).json(result).end();
      }
    });
  });

  router.post("/reset-user-password/:username", verifyUser, verifyAdmin, function (req, res) {
    const username = req.params.username;

    cognito.resetUserPassword(username).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else if (result.statusCode === 400) {
        res.status(400).json(result).end();
      } else {
        res.status(500).json(result).end();
      }
    });
  });

  router.post("/set-admin-password", verifyUser, verifyAdmin, function (req, res) {
    const { username, password } = req.body;

    cognito.setAdminPassword(username, password).then((result) => {
      res.status(200).json(result).end();
    });
  });

  router.post("/force-change-password", function (req, res) {
    const { username, password, session } = req.body;

    cognito.respondToAuthChallenge(username, password, session).then((result) => {
      if (result.statusCode === 200) {
        res.status(200).json(result.data).end();
      } else {
        res.status(400).json(result).end();
      }
    });
  });

  return router;
};
