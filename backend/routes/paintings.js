const router = require("express").Router();
const paintingsController = require("../controllers/paintings");

const auth = require("../middleware/auth");

router.get("/", paintingsController.getPaintings);

router.get("/user", auth, paintingsController.getUserPaintings);

router.get("/:paintingId", paintingsController.getPainting);

router.post("/:paintingId", auth, paintingsController.savePaintings);

router.delete("/:paintingId", auth, paintingsController.deletePaintings);

module.exports = router;
