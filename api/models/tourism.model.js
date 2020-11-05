const mongoose = require("mongoose");
const geocoder = require('../middleware/geocoder')

const SiteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tourId: {//added
    type: String,
    required: [false, "Please add a store ID"],
    unique: true,
    trim: true,
    maxlength: [10, "Store ID must be less than 10 chars"],
  },
  address: {//address added
    type: String,
    required: [false, "Please add an address"],
  },
  site: { type: String, required: true },
  description: { type: String, required: true },
  contacts: { type: String, required: true },
  productImage: { type: Array, required: false },

  location: {//located added
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
  },
  createdAt: Date,
  updatedAt: Date,
});

SiteSchema.pre("save", function (next) {
  var currentDate = new Date();

  this.createdAt = currentDate;

  if (!this.updatedAt) this.updatedAt = currentDate;

  next();
});

//Geocode & create location
SiteSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };
  
    // Do not save address
    this.address = undefined;
    next();
  })

module.exports = mongoose.model("Site", SiteSchema);
