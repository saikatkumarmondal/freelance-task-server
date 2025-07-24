const cors = require( 'cors' );
require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();

app.use( cors() );
app.use( express.json() );
const port = process.env.PORT || 7777;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.DB_APPNAME}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run () {
  //HZLqyrX4N1KZTzBY
  //simpleDbUser
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db("freelancerapp").collection("users");
    const categoryCollection = client
      .db("freelancerapp")
      .collection("category");
    const taskCollection = client.db("freelancerapp").collection("tasks");

    await client.db("admin").command({ ping: 1 });
    // user's APIS
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await userCollection.findOne(filter);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await userCollection.find().limit(50).toArray();
      res.send(users);
    });

    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email.trim();

      const filter = { email: email };
      const updatedUser = req.body;
      const updateDoc = { $set: updatedUser };
      const options = { upsert: false };

      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // category section
    app.post("/categories", async (req, res) => {
      const categoryData = req.body; // expect { category: "Web Developer" }
      const result = await categoryCollection.insertOne(categoryData);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });

    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(filter);
      res.send(result);
    });

    app.post("/add-task", async (req, res) => {
      const tasks = req.body;
      const result = await taskCollection.insertOne(tasks);
      res.send(result);
    });

    app.get("/tasks", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id),
      };
      const result = await taskCollection.findOne(filter);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen( port, () => {
    console.log(`Server started on ${port}`);
})