import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import forgotpasswordRouter from './forgotpasswordRoutes.js'

const v1 = new Router();


// account
v1.use('/account', accountRouter);

// Forgot Password
v1.use('/forgotpassword', forgotpasswordRouter);


export default v1;