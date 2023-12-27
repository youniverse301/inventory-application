const AlbumStock = require("../models/albumstock");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Album = require("../models/album");

// Display list of all AlbumStocks.
exports.albumstock_list = asyncHandler(async (req, res, next) => {
    const allAlbumStocks = await AlbumStock.find().populate("album").exec();
  
    res.render("albumstock_list", {
      title: "Album Inventory List",
      albumstock_list: allAlbumStocks,
    });
});
  

// Display detail page for a specific albumstock.
exports.albumstock_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: AlbumStock detail: ${req.params.id}`);
});

// Display albumstock update form on GET.
exports.albumstock_update_get = asyncHandler(async (req, res, next) => {
  // Get the existing AlbumStock and Album data
  const albumStock = await AlbumStock.findById(req.params.id).populate("album").exec();
  const allAlbums = await Album.find({}, "title").sort({ title: 1 }).exec();
  console.log(albumStock)

  res.render("albumstock_form", {
    title: "Update an album's stock",
    albumstock: albumStock,
    album_list: allAlbums,
  });
});
  
// Handle albumstock update on POST.
exports.albumstock_update_post = [
  // Validate and sanitize fields.
  body("album", "Album must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("numInStock", "Must include a quantity").optional({ values: "falsy" }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an AlbumStock object with escaped and trimmed data.
    const albumStockData = {
      album: req.body.album,
      status: req.body.status,
      numInStock: req.body.numInStock,
    };

    // Check if the album stock already exists
    const existingAlbumStock = await AlbumStock.findOne({ album: req.body.album });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allAlbums = await Album.find({}, "title").sort({ title: 1 }).exec();

      res.render("albumstock_form", {
        title: "Update an album's stock",
        album_list: allAlbums,
        errors: errors.array(),
        albumstock: albumStockData,
      });
      return;
    } else {
      // Data from form is valid
      if (existingAlbumStock) {
        // Update the existing AlbumStock
        await AlbumStock.findByIdAndUpdate(existingAlbumStock._id, albumStockData);
      } else {
        // AlbumStock does not exist, create a new one
        const newAlbumStock = new AlbumStock(albumStockData);
        await newAlbumStock.save();
      }

      // Redirect to the detail page of the associated album
      const album = await Album.findById(req.body.album);
      res.redirect(album.url);
    }
  }),
];

// Display albumstock delete form on GET.
exports.albumstock_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock delete GET");
});

// Handle albumstock delete on POST.
exports.albumstock_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: AlbumStock delete POST");
});
