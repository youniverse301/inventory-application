const AlbumStock = require("../models/albumstock");
const asyncHandler = require("express-async-handler");

// Display list of all albumstocks.
exports.albumstock_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock list");
});

// Display detail page for a specific albumstock.
exports.albumstock_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: AlbumStock detail: ${req.params.id}`);
});

// Display albumstock create form on GET.
exports.albumstock_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock create GET");
});

// Handle albumstock create on POST.
exports.albumstock_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock create POST");
});

// Display albumstock delete form on GET.
exports.albumstock_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock delete GET");
});

// Handle albumstock delete on POST.
exports.albumstock_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock delete POST");
});

// Display albumstock update form on GET.
exports.albumstock_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock update GET");
});

// Handle albumstock update on POST.
exports.albumstock_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock update POST");
});
