const Album = require("../models/album");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const AlbumStock = require("../models/albumstock");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of albums, album stocks, artists and genre counts (in parallel)
  const [
    numAlbums,
    numAvailableAlbumStocks,
    numArtists,
    numGenres,
  ] = await Promise.all([
    Album.countDocuments({}).exec(),
    AlbumStock.countDocuments({ status: "In Stock" }).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Record Store Home",
    album_count: numAlbums,
    album_stock_available_count: numAvailableAlbumStocks,
    artist_count: numArtists,
    genre_count: numGenres,
  });
});


// Display list of all albums.
exports.album_list = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find({}, "title artist")
      .sort({ title: 1 })
      .populate("artist")
      .exec();
  
    res.render("album_list", { title: "Album List", album_list: allAlbums });
  });
  

// Display detail page for a specific album.
exports.album_detail = asyncHandler(async (req, res, next) => {
    // Get details of albums, album instances for specific album
    const [album, albumStocks] = await Promise.all([
      Album.findById(req.params.id).populate("artist").populate("genre").populate("price").exec(),
      AlbumStock.find({ album: req.params.id }).exec(),
    ]);
  
    if (album === null) {
      // No results.
      const err = new Error("album not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("album_detail", {
      title: album.title,
      album: album,
      album_stocks: albumStocks,
    });
});

// Display album create form on GET.
exports.album_create_get = asyncHandler(async (req, res, next) => {
    // Get all artists and genres, which we can use for adding to our album.
    const [allArtists, allGenres] = await Promise.all([
      Artist.find().sort({ artist_name: 1 }).exec(),
      Genre.find().sort({ name: 1 }).exec(),
    ]);
  
    res.render("album_form", {
      title: "Create Album",
      artists: allArtists,
      genres: allGenres,
    });
});
  

// Handle album create on POST.
exports.album_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
      if (!Array.isArray(req.body.genre)) {
        req.body.genre =
          typeof req.body.genre === "undefined" ? [] : [req.body.genre];
      }
      next();
    },
  
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("artist", "Artist must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("price", "Price must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("genre.*").escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create an Album object with escaped and trimmed data.
      const album = new Album({
        title: req.body.title,
        artist: req.body.artist,
        price: req.body.price,
        genre: req.body.genre,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all artists and genres for form.
        const [allArtists, allGenres] = await Promise.all([
          Artist.find().sort({ artist_name: 1 }).exec(),
          Genre.find().sort({ name: 1 }).exec(),
        ]);
  
        // Mark our selected genres as checked.
        for (const genre of allGenres) {
          if (album.genre.includes(genre._id)) {
            genre.checked = "true";
          }
        }
        res.render("album_form", {
          title: "Create Album",
          artists: allArtists,
          genres: allGenres,
          album: album,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save album.
        await album.save();
        res.redirect(album.url);
      }
    }),
];
  

// Display Album delete form on GET.
exports.album_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of album and all their album stocks (in parallel)
  const [album, allAlbumStocks] = await Promise.all([
    Album.findById(req.params.id).exec(),
    AlbumStock.find({ album: req.params.id }).populate("album").exec(),
  ]);

  if (album === null) {
    // No results.
    res.redirect("/catalog/albums");
  }

  res.render("album_delete", {
    title: "Delete Album",
    album: album,
    album_stocks: allAlbumStocks,
  });
});

// Handle Album delete on POST.
exports.album_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of album and all their album stocks (in parallel)
  const [album, allAlbumStocks] = await Promise.all([
    Album.findById(req.params.id).exec(),
    AlbumStock.find({ album: req.params.id }, "status numInStock").exec(),
  ]);

  if (allAlbumStocks.length > 0) {
    // Check if any album stock has a status of "In Stock"
    const hasInStock = allAlbumStocks.some((stock) => stock.status === 'In Stock');

    if (hasInStock) {
      // Album has stocks with status "In Stock". Render in the same way as for the GET route.
      res.render("album_delete", {
        title: "Delete Album",
        album: album,
        album_stocks: allAlbumStocks,
      });
      return;
    }
  }

  // Album has no instances or all instances have status other than "In Stock".
  // Delete the object and redirect to the list of albums.
  await Album.findByIdAndDelete(req.body.albumid);
  await AlbumStock.deleteMany({ album: req.params.id });
  res.redirect("/catalog/albums");
});


// Display album update form on GET.
exports.album_update_get = asyncHandler(async (req, res, next) => {
    // Get album, artists and genres for form.
    const [album, allArtists, allGenres] = await Promise.all([
      Album.findById(req.params.id).populate("artist").exec(),
      Artist.find().sort({ artist_name: 1 }).exec(),
      Genre.find().sort({ name: 1 }).exec(),
    ]);
  
    if (album === null) {
      // No results.
      const err = new Error("Album not found");
      err.status = 404;
      return next(err);
    }
  
    // Mark our selected genres as checked.
    allGenres.forEach((genre) => {
      if (album.genre.includes(genre._id)) genre.checked = "true";
    });
  
    res.render("album_form", {
      title: "Update Album",
      artists: allArtists,
      genres: allGenres,
      album: album,
    });
});
  

// Handle album update on POST.
exports.album_update_post = [
    // Convert the genre to an array.
    (req, res, next) => {
      if (!Array.isArray(req.body.genre)) {
        req.body.genre =
          typeof req.body.genre === "undefined" ? [] : [req.body.genre];
      }
      next();
    },
  
    // Validate and sanitize fields.
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("artist", "Artist must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
      body("price", "Price must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("genre.*").escape(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create an Album object with escaped/trimmed data and old id.
      const album = new Album({
        title: req.body.title,
        artist: req.body.artist,
        price: req.body.price,
        genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all artists and genres for form
        const [allArtists, allGenres] = await Promise.all([
          Artist.find().sort({ artist_name: 1 }).exec(),
          Genre.find().sort({ name: 1 }).exec(),
        ]);
  
        // Mark our selected genres as checked.
        for (const genre of allGenres) {
          if (album.genre.indexOf(genre._id) > -1) {
            genre.checked = "true";
          }
        }
        res.render("album_form", {
          title: "Update Album",
          artists: allArtists,
          genres: allGenres,
          album: album,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid. Update the record.
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, album, {});
        // Redirect to album detail page.
        res.redirect(updatedAlbum.url);
      }
    }),
];
  
