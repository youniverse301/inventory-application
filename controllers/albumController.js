const Album = require("../models/album");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const AlbumStock = require("../models/albumstock");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of albums, album stocks, artists and genre counts (in parallel)
  const [
    numAlbums,
    numAlbumStocks,
    numAvailableAlbumStocks,
    numArtists,
    numGenres,
  ] = await Promise.all([
    Album.countDocuments({}).exec(),
    AlbumStock.countDocuments({}).exec(),
    AlbumStock.countDocuments({ status: "In Stock" }).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Record Store Home",
    album_count: numAlbums,
    album_stock_count: numAlbumStocks,
    album_stock_available_count: numAvailableAlbumStocks,
    artist_count: numArtists,
    genre_count: numGenres,
  });
});


// Display list of all albums.
exports.album_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album list");
});

// Display detail page for a specific album.
exports.album_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Album detail: ${req.params.id}`);
});

// Display album create form on GET.
exports.album_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album create GET");
});

// Handle album create on POST.
exports.album_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album create POST");
});

// Display album delete form on GET.
exports.album_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album delete GET");
});

// Handle album delete on POST.
exports.album_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album delete POST");
});

// Display album update form on GET.
exports.album_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album update GET");
});

// Handle album update on POST.
exports.album_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Album update POST");
});
