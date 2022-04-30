const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
// middleware
app.use(cors());
app.use(express.json());


// connection with mongo


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.53drk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const workCollection = client.db('volunteerNet').collection('work');
        // works api
        app.get('/work', async (req, res) => {
            const query = {};
            const cursor = workCollection.find(query);
            const works = await cursor.toArray();
            res.send(works);
        })
        app.get('/work/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const work = await workCollection.findOne(query);
            res.send(work);
        })

        //upload data
        app.post('/work', async (req, res) => {
            const newWork = req.body;
            const result = await workCollection.insertOne(newWork);
            res.send(result);
        })
        //delete data
        app.delete('/work/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const work = await workCollection.deleteOne(query);
            res.send(work);
        });

    }
    finally {

    }
}
run().catch(console.dir);




//root api
app.get('/', (req, res) => {
    res.send('volunteer network');
})
app.listen(port, () => {
    console.log('port is runnig from:', port);
})