const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  artist_name: { type: String, required: true, maxLength: 100 },
  gov_name: { type: String, required: false, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
  place_of_birth: { type: String, required: false, maxLength: 100 },
});

// Virtual for artist's URL
ArtistSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/artist/${this._id}`;
});

ArtistSchema.virtual("date_of_death_formatted").get(function () {
    return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
});

ArtistSchema.virtual("date_of_birth_formatted").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});
  
// Export model
module.exports = mongoose.model("Artist", ArtistSchema);
