#! /usr/bin/env node

console.log(
    'This script populates some test albums, artists, genres and albumstocks to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Album = require("./models/album");
  const Artist = require("./models/artist");
  const Genre = require("./models/genre");
  const AlbumStock = require("./models/albumstock");
  
  const genres = [];
  const artists = [];
  const albums = [];
  const albumstocks = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createArtists();
    await createAlbums();
    await createAlbumStocks();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Rock genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function genreCreate(index, name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
  }
  
  async function artistCreate(index, a_name, g_name, d_birth, d_death, p_birth) {
    const artistdetail = { artist_name: a_name};
    if (g_name != false) artistdetail.gov_name = g_name;
    if (d_birth != false) artistdetail.date_of_birth = d_birth;
    if (d_death != false) artistdetail.date_of_death = d_death;
    if (p_birth != false) artistdetail.place_of_birth = p_birth;

    const artist = new Artist(artistdetail);
  
    await artist.save();
    artists[index] = artist;
  }
  
  async function albumCreate(index, title, artist, price, genre) {
    const albumdetail = {
      title: title,
      artist: artist,
      price: price
    };
    if (genre != false) albumdetail.genre = genre;
  
    const album = new Album(albumdetail);
    await album.save();
    albums[index] = album;
    console.log(`Added album: ${title}`);
  }
  
  async function albumStockCreate(index, album, numInStock, status) {
    const albumstockdetail = {
      album: album,
      numInStock: numInStock,
      status: status
    };
    if (status != false) albumstockdetail.status = status;
  
    const albumstock = new AlbumStock(albumstockdetail);
    await albumstock.save();
    albumstocks[index] = albumstock;
    console.log(`Added albumStock: ${album}`);
  }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Rock"),
      genreCreate(1, "Pop"),
      genreCreate(2, "Hip Hop"),
      genreCreate(3, "Rhythm & Blues"),
    ]);
  }
  
  async function createArtists() {
    console.log("Adding artists");
    await Promise.all([
        artistCreate(0, "Bladee", "Benjamin Reichwald", "1994-04-9", false),
        artistCreate(1, "Drake", "Aubrey Graham", "1986-10-24", false),
        artistCreate(2, "Prince", false, "1958-06-07", "2016-04-21"),
        artistCreate(3, "Björk", "	Björk Guðmundsdóttir", "1965-11-21", false),
        artistCreate(4, "Aretha Franklin", "Aretha Franklin", "1942-03-25", "2018-08-16"),
    ]);
  }
  
  async function createAlbums() {
    console.log("Adding Albums");
    await Promise.all([
      albumCreate(0,
        "The Fool",
        artists[0],
        29,
        [genres[2]],
      ),
      albumCreate(1,
        "Icedancer",
        artists[0],
        29,
        [genres[0]],
      ),
      albumCreate(2,
        "333",
        artists[0],
        29,
        [genres[0]],
      ),
      albumCreate(3,
        "If You're Reading This It's Too Late",
        artists[1],
        35,
        [genres[2]],
      ),
      albumCreate(4,
        "1999",
        artists[2],
        35,
        [genres[1], genres[0]],
      ),
      albumCreate(5,
        "Post",
        artists[3],
        39,
        [genres[0], genres[1]],
      ),
      albumCreate(6,
        "Aretha Now",
        artists[4],
        20,
        [genres[3]],
      ),
    ]);
  }
  
  async function createAlbumStocks() {
    console.log("Adding album inventory");
    await Promise.all([
      albumStockCreate(0, albums[0],  12, "In Stock"),
      albumStockCreate(1, albums[1],  25, "In Stock"),
      albumStockCreate(2, albums[2],  0, "Out of Stock"),
      albumStockCreate(3, albums[3],  78, "In Stock"),
      albumStockCreate(4, albums[4],  31, "In Stock"),
      albumStockCreate(5, albums[5],  67, "In Stock"),
      albumStockCreate(6, albums[6],  0, "Backorder"),
    ]);
  }