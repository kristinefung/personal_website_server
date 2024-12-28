import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import { router } from './router/router';

dotenv.config();

const PORT = process.env.PORT || 4000;;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(router);

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