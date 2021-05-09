const router = require('express').Router();
const homeRoutes = require('./homepage-routes');
const dashboardRoutes = require('./dashboard-routes')
const apiRoutes = require('./api');

router.use('/dashboard', dashboardRoutes);
router.use('/', homeRoutes);
router.use('/api', apiRoutes);



module.exports = router;