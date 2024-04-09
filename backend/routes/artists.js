const router = require("express").Router();
const artistsController = require("../controllers/artists");

router.get("/", artistsController.getArtists);

router.get("/:artistId", artistsController.getArtist);

module.exports = router;
