const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

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
        const orderCollection = database.collection("order");
        const userCollection = database.collection("users");



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
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.findOne(query);
      res.json(result);
    })

 //POST API For Orders doctor
 app.post("/allorders", async (req, res) => {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    console.log(result);
    res.json(result);
  });

  //delete dashboard from admin
  app.delete("/doctors/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await doctorsCollection.deleteOne(query);
    res.json(result);
  });

 //POST API For Users
 app.post("/users", async (req, res) => {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.json(result);
});

 //Get Users API
 app.get("/users", async (req, res) => {
  const cursor = userCollection.find({});
  const users = await cursor.toArray();
  res.json(users);
});

  //Upsert
  app.put("/users", async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

 //Make Admin
 app.put("/users/admin", async (req, res) => {
  const user = req.body;
  console.log("put", user);
  const filter = { email: user.email };
  const updateDoc = { $set: { role: "admin" } };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.json(result);
});


 //Admin Verfication
 app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === "admin") {
    isAdmin = true;
  }
  res.json({ admin: isAdmin });
});





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