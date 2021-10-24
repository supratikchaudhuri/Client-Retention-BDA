const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const results = [];

mongoose.connect("mongodb://localhost:27017/Audiobooks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const entriesSchema = new mongoose.Schema({
    A: Number,
    B: Number,
    C: Number,
    D: Number,
    E: Number,
    F: Number,
    G: Number,
    H: Number,
    I: Number,
    J: Number,
    K: Number,
    L: Number,
    });

const Entry = mongoose.model("Entry", entriesSchema);

console.log("adding data to db");

fs.createReadStream("Audiobooks_data_impr.csv")
    .pipe(csv({}))
    .on("data", (data) => results.push(data))
    .on("end", () => {
        let cnt = 0;
        const temp = results.map((result) => {
            
            const entry = new Entry(result);
            return entry
                .save()
                .then(() => cnt++)
                .catch((err) => console.log(err));
        });

        Promise.all(temp)
            .then(() => {
                console.log("success", cnt);
                mongoose.connection.close();
            })
            .catch((err) => console.log(err));
    });
