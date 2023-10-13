const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://devmahmudmasud1:mE2VBuVNyaZ1hLHq@cluster0.aunb3y8.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("usersInfoDB");
    const userCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const updateId = req.params.id;
      const params = { _id: new ObjectId(updateId) };
      const result = await userCollection.findOne(params);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = await req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const updateId = req.params.id;
      const updateUser = req.body;
      
      const filter = {_id : new ObjectId(updateId)}
      const options = {upsert: true}

      const updatedUser = {
        $set: {
          name: updateUser.name,
          email: updateUser.email
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser, options)
      res.send(result)
    })

    app.delete("/users/:id", async (req, res) => {
      const deleteId = req.params.id;
      const query = { _id: new ObjectId(deleteId) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to crud system");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
