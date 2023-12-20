const express = require("express");
const router = express.Router();

// Require controller modules.
const album_controller = require("../controllers/albumController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");
const album_stock_controller = require("../controllers/albumStockController");

/// ALBUM ROUTES ///

// GET catalog home page.
router.get("/", album_controller.index);

// GET request for creating a album. NOTE This must come before routes that display album (uses id).
router.get("/album/create", album_controller.album_create_get);

// POST request for creating album.
router.post("/album/create", album_controller.album_create_post);

// GET request to delete album.
router.get("/album/:id/delete", album_controller.album_delete_get);

// POST request to delete album.
router.post("/album/:id/delete", album_controller.album_delete_post);

// GET request to update album.
router.get("/album/:id/update", album_controller.album_update_get);

// POST request to update album.
router.post("/album/:id/update", album_controller.album_update_post);

// GET request for one album.
router.get("/album/:id", album_controller.album_detail);

// GET request for list of all album items.
router.get("/albums", album_controller.album_list);

/// ARTIST ROUTES ///

// GET request for creating artist. NOTE This must come before route for id (i.e. display artist).
router.get("/artist/create", artist_controller.artist_create_get);

// POST request for creating artist.
router.post("/artist/create", artist_controller.artist_create_post);

// GET request to delete artist.
router.get("/artist/:id/delete", artist_controller.artist_delete_get);

// POST request to delete artist.
router.post("/artist/:id/delete", artist_controller.artist_delete_post);

// GET request to update artist.
router.get("/artist/:id/update", artist_controller.artist_update_get);

// POST request to update artist.
router.post("/artist/:id/update", artist_controller.artist_update_post);

// GET request for one artist.
router.get("/artist/:id", artist_controller.artist_detail);

// GET request for list of all Artists.
router.get("/artists", artist_controller.artist_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// ALBUMSTOCK ROUTES ///

// GET request for creating a AlbumStock. NOTE This must come before route that displays AlbumStock (uses id).
router.get(
  "/albumstock/create",
  album_stock_controller.albumstock_update_get,
);

// POST request for creating AlbumStock.
router.post(
  "/albumstock/create",
  album_stock_controller.albumstock_update_post,
);

// GET request to delete AlbumStock.
router.get(
  "/albumstock/:id/delete",
  album_stock_controller.albumstock_delete_get,
);

// POST request to delete AlbumStock.
router.post(
  "/albumstock/:id/delete",
  album_stock_controller.albumstock_delete_post,
);

// GET request to update AlbumStock.
router.get("/albumstock/:id/edit", album_stock_controller.albumstock_update_get);

// POST request to update AlbumStock.
router.post(
  "/albumstock/:id/update",
  album_stock_controller.albumstock_update_post,
);

// GET request for one AlbumStock.
router.get("/albumstock/:id", album_stock_controller.albumstock_detail);

// GET request for list of all AlbumStock.
router.get("/albumstocks", album_stock_controller.albumstock_list);

module.exports = router;
