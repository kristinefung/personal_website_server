import express from 'express';
import { IoCContainer } from '../ioc/ioc_container';

const iocContainer = new IoCContainer();
const userCtlr = iocContainer.getUserController();
const enquiryCtlr = iocContainer.getEnquiryController();
const educationCtlr = iocContainer.getEducationController();
const workCtlr = iocContainer.getWorkController();

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
 *                       Enquiry Module
 ************************************************************/
router.post('/enquiries', (req, res) => enquiryCtlr.createEnquiry(req, res));
router.get('/enquiries/:id', (req, res) => enquiryCtlr.getEnquiryById(req, res));
router.get('/enquiries', (req, res) => enquiryCtlr.getAllEnquiries(req, res));
router.delete('/enquiries/:id', (req, res) => enquiryCtlr.deleteEnquiryById(req, res));
router.put('/enquiries/:id', (req, res) => enquiryCtlr.updateEnquiryById(req, res));
router.post('/enquiries/search', (req, res) => enquiryCtlr.searchEnquiries(req, res));

/*************************************************************
 *                      Education Module
 ************************************************************/
router.post('/educations', (req, res) => educationCtlr.createEducation(req, res));
router.get('/educations/:id', (req, res) => educationCtlr.getEducationById(req, res));
router.get('/educations', (req, res) => educationCtlr.getAllEducations(req, res));
router.delete('/educations/:id', (req, res) => educationCtlr.deleteEducationById(req, res));
router.put('/educations/:id', (req, res) => educationCtlr.updateEducationById(req, res));

/*************************************************************
 *                        Work Module
 ************************************************************/
router.post('/works', (req, res) => workCtlr.createWork(req, res));
router.get('/works/:id', (req, res) => workCtlr.getWorkById(req, res));
router.get('/works', (req, res) => workCtlr.getAllWorks(req, res));
router.delete('/works/:id', (req, res) => workCtlr.deleteWorkById(req, res));
router.put('/works/:id', (req, res) => workCtlr.updateWorkById(req, res));

export { router };