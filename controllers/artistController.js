const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");

// Display list of all Artists.
exports.artist_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist list");
});

// Display detail page for a specific artist.
exports.artist_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: artist detail: ${req.params.id}`);
});

// Display artist create form on GET.
exports.artist_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist create GET");
});

// Handle artist create on POST.
exports.artist_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist create POST");
});

// Display artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist delete GET");
});

// Handle artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist delete POST");
});

// Display artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist update GET");
});

// Handle artist update on POST.
exports.artist_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist update POST");
});
