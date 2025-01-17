const authControllers = require("../controllers/authControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/admin-login", authControllers.admin_login);
router.get("/get-user", authMiddleware, authControllers.getUser);

//seller register
router.post("/seller-register", authControllers.seller_register);
router.post("/seller-login", authControllers.seller_login);

//image-update-profile
router.put(
    "/profile-image-upload",
    authMiddleware,
    authControllers.profile_image_upload
);
router.post("/add-profile-info", authMiddleware, authControllers.add_info);

router.get("/logout", authMiddleware, authControllers.logout);

module.exports = router;
