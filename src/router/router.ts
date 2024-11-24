import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();
const enquiryCtlr = iocContainer.getEnquiryController();

const router = express.Router();

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/users', (req, res) => userCtlr.createUser(req, res));
router.get('/users/:id', (req, res) => userCtlr.getUserById(req, res));
router.get('/users', (req, res) => userCtlr.getAllUsers(req, res));
router.delete('/users/:id', (req, res) => userCtlr.deleteUserById(req, res));
router.put('/users/:id', (req, res) => userCtlr.updateUserById(req, res));
router.post('/login', (req, res) => userCtlr.login(req, res));

/*************************************************************
 *                        User Module
 ************************************************************/
router.post('/enquiries', (req, res) => enquiryCtlr.createEnquiry(req, res));
router.get('/enquiries/:id', (req, res) => enquiryCtlr.getEnquiryById(req, res));
router.get('/enquiries', (req, res) => enquiryCtlr.getAllEnquiries(req, res));
router.delete('/enquiries/:id', (req, res) => enquiryCtlr.deleteEnquiryById(req, res));
router.put('/enquiries/:id', (req, res) => enquiryCtlr.updateEnquiryById(req, res));
router.post('/enquiries/search', (req, res) => enquiryCtlr.searchEnquiries(req, res));

export { router };