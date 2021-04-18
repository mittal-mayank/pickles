const router = require('express').Router();
const {
    getCommunityPosts,
    createCommunity,
} = require('../controllers/communities');
const { processBanner } = require('../middlewares/uploads');

router.get('/:name/posts', exceptionHandler(getCommunityPosts));

router.post(
    '/',
    exceptionHandler(processBanner),
    exceptionHandler(createCommunity)
);

module.exports = router;
