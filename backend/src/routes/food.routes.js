const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("mama"),
    foodController.createFood)


/* GET /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodController.getFoodItems)


router.post('/like',
    authMiddleware.authUserMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.authUserMiddleware,
    foodController.saveFood
)


router.get('/save',
    authMiddleware.authUserMiddleware,
    foodController.getSaveFood
)

/* GET /api/food/:foodId - Get single food item */
router.get('/:foodId',
    authMiddleware.authUserMiddleware,
    foodController.getFoodById
)

/* POST /api/food/:foodId/view - Increment view count */
router.post('/:foodId/view',
    authMiddleware.authUserMiddleware,
    foodController.incrementViewCount
)

/* GET /api/food/category/:category - Get foods by category */
router.get('/category/:category',
    authMiddleware.authUserMiddleware,
    foodController.getFoodsByCategory
)


module.exports = router