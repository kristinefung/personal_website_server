import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;;
const userController = new UserController();

app.use(bodyParser.json());

app.post('/users', (req, res) => userController.createUser(req, res));
app.get('/users/:id', (req, res) => userController.getUserById(req, res));
app.get('/users', (req, res) => userController.getAllUsers(req, res));
app.delete('/users/:id', (req, res) => userController.deleteUserById(req, res));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



/*
                                                     _ooOoo_
                                                    o8888888o
                                                    88" . "88 
                                                    (| -_- |)
                                                    O\  =  /O
                                                  ___/`---'\____
                                               .'  \\|     |//  `.
                                              /  \\|||  :  |||//  \
                                             /  _||||| -:- |||||_  \
                                             |   | \\\  -  /// |   |
                                             | \_|  ''\---/''  |   |
                                             \  .-\__       __/-.  /
                                           ___`. .'  /--.--\ `. . __
                                        ."" '<  `.___\_<|>_/__.'  >'"".
                                       | | :  `- \`.;`\ _ /`;.`/ - ` : | |
                                       \  \ `-.   \_ __\ /__ _/   .-` /  /
                                  ======`-.____`-.___\_____/___.-`____.-'======
                                                     `=---='
                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                              佛祖保佑       永無BUG
*/