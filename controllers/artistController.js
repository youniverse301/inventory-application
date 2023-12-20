const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");
const Album = require("../models/album");
const { body, validationResult } = require("express-validator");

// Display list of all Artists.
exports.artist_list = asyncHandler(async (req, res, next) => {
    const allArtists = await Artist.find().sort({ artist_name: 1 }).exec();
    res.render("artist_list", {
      title: "Artist List",
      artist_list: allArtists,
    });
});

// Display detail page for a specific Artist.
exports.artist_detail = asyncHandler(async (req, res, next) => {
    // Get details of artist and all their albums (in parallel)
    const [artist, allAlbumsByArtist] = await Promise.all([
      Artist.findById(req.params.id).exec(),
      Album.find({ artist: req.params.id }, "title price").exec(),
    ]);
  
    if (artist === null) {
      // No results.
      const err = new Error("Artist not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("artist_detail", {
      title: "Artist Detail",
      artist: artist,
      artist_albums: allAlbumsByArtist,
    });
});

// Display Artist create form on GET.
exports.artist_create_get = (req, res, next) => {
    res.render("artist_form", { title: "Create Artist" });
};
  

// Handle Artist create on POST.
exports.artist_create_post = [
    // Validate and sanitize fields.
    body("artist_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Artist name must be specified."),
    body("gov_name")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Government name must be specified.")
      .isAlphanumeric()
      .withMessage("Government name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
    body("date_of_death", "Invalid date of death")
      .optional({ values: "falsy" })
      .isISO8601()
      .toDate(),
  
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create Artist object with escaped and trimmed data
      const artist = new Artist({
        artist_name: req.body.artist_name,
        gov_name: req.body.gov_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("artist_form", {
          title: "Create Artist",
          artist: artist,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
  
        // Save author.
        await artist.save();
        // Redirect to new artist record.
        res.redirect(artist.url);
      }
    }),
];
  

// Display Artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of artist and all their albums (in parallel)
    const [artist, allAlbumsByArtist] = await Promise.all([
      Artist.findById(req.params.id).exec(),
      Album.find({ artist: req.params.id }, "title price").exec(),
    ]);
  
    if (artist === null) {
      // No results.
      res.redirect("/catalog/artists");
    }
  
    res.render("artist_delete", {
      title: "Delete Artist",
      artist: artist,
      artist_albums: allAlbumsByArtist,
    });
});  

// Handle Artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of artist and all their albums (in parallel)
    const [artist, allAlbumsByArtist] = await Promise.all([
      Artist.findById(req.params.id).exec(),
      Album.find({ artist: req.params.id }, "title price").exec(),
    ]);
  
    if (allAlbumsByArtist.length > 0) {
      // Artist has albums. Render in same way as for GET route.
      res.render("artist_delete", {
        title: "Delete Artist",
        artist: artist,
        artist_albums: allAlbumsByArtist,
      });
      return;
    } else {
      // Artist has no albums. Delete object and redirect to the list of artists.
      await Artist.findByIdAndDelete(req.body.authorid);
      res.redirect("/catalog/artists");
    }
});
  

// Display artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist update GET");
});

// Handle artist update on POST.
exports.artist_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist update POST");
});
