const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');
const m$auth = require(__module_dir + '/auth.module.js');
const userMiddleware = require(__middleware_dir + '/users.js');

// Parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

// Register
router.post('/register', userMiddleware.validateRegister, async function (req, res, next) {
    const regisTask = await m$auth.register(req.body)
    helper.sendResponse(res, regisTask);
});

// Login
router.post('/login', async function (req, res, next) {
    const loginTask = await m$auth.login(req.body)
    helper.sendResponse(res, loginTask);
});

// Get User Profile
router.get('/user', userMiddleware.isLoggedIn, async function (req, res, next) {
    const getUser = await m$auth.getUser(req.userData)
    helper.sendResponse(res, getUser);
});

// Add Item
router.post('/', userMiddleware.isLoggedIn, async function (req, res, next) {
    const addTask = await m$task.add(req.body, req.userData)
    helper.sendResponse(res, addTask);
});

// Get Item
router.get('/', userMiddleware.isLoggedIn, async function (req, res, next) {
    const getTask = await m$task.get(req.query, req.userData)
    helper.sendResponse(res, getTask);
});

//Update Item
router.put('/', userMiddleware.isLoggedIn, async function (req, res, next) {
    const getTask = await m$task.update(req.body, req.userData)
    helper.sendResponse(res, getTask);
});

// Delete Item
router.delete('/', userMiddleware.isLoggedIn, async function (req, res, next) {
    const getTask = await m$task.delete(req.query, req.userData)
    helper.sendResponse(res, getTask);
});

module.exports = router;