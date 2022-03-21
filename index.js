const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ad0jo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});





async function run () {
    try {
        await client.connect();
        console.log("success connect database");
        const database = client.db("Healthcare");
        const doctorsCollection = database.collection("doctors");



        // POST DOctor From Admin
        app.post("/doctors", async(req, res) => {
            const doctor = req.body;
            const result = await doctorsCollection.insertOne(doctor)
            res.json(result)
        });

        // GET Doctors from database 
        app.get("/doctors", async (req, res) => {
                const cursor = doctorsCollection.find({});
                const users = await cursor.toArray();
                res.send(users);
              });

              
    // Single Doctors details
    app.get("/doctors/:id" , async(req, res) => {
        const id = req.params.id;
      console.log("Single Doctors", id);
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.findOne(query);
      res.json(result);
    })



    } 
    finally {
        // await client.close();
    }
}


run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Running the Health server");
});
app.listen(port, () =>{
    console.log("Running the Health service", port)
})