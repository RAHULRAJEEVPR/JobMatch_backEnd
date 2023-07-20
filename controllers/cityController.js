const cityModel = require("../model/cityModal");

const addCity = async (req, res) => {
  try {
    const { city } = req.body;
    const regex = new RegExp(city, "i");
    const exists = await cityModel.findOne({ city: regex });
    if (exists) {
      return res
        .status(409)
        .json({ error: true, message: "city already exists" });
    }
    const newCity = new cityModel({
      city: city,
    });
    const done = await newCity.save();
    if (done) {
      res.status(200).json({ success: true, message: "added successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const cityDetails = async (req, res) => {
  try {
    const cityData = await cityModel.find({});
    if (cityData) {
     
      res.status(200).json({ data: true, message: " succesfull", cityData });
    } else {
      res
        .status(400)
        .json({ error: error.message, messsage: "data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });

    console.log(error.message);
  }
};

const dropCity = async (req, res) => {
  try {
    const { id } = req.body;
    let droped = await cityModel.deleteOne({ _id: id });
    if (droped) {
      return res
        .status(200)
        .json({ droped: true, message: " Droped successfully" });
    } else {
      res
        .status(500)
        .json({
          error: error.message,
          message: "something went wrong",
          droped: false,
        });
    }
   
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, droped: false });
  }
};

module.exports = {
  addCity,
  cityDetails,
  dropCity,
};
