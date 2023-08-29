const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.prgsjug.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const collection = client.db("codify").collection("itemList");
        const saveCollection = client.db("codify").collection("formdata");

        // ---------------- Form App ---------------//

        //Display All Selection List
        app.get('/data', async (req, res) => {
            const query = {};
            const cursor = collection.find(query)
            const data = await cursor.toArray()
            res.send(data);
        })


        //Save Data
        app.get('/saveData', async (req, res) => {
            const query = {};
            const cursor = saveCollection.find(query)
            const data = await cursor.toArray()
            res.send(data);
        })

        //Save Form Data
        app.post('/saveData', async (req, res) => {
            const data = req.body;
            console.log(data);
            const newdata = await saveCollection.insertOne(data)
            res.send(newdata);
        })

        //Update Form Data
        app.put('/saveData/:id', async (req, res) => {
            try {
                const id = req.params.id;
                console.log(id);
                const updateData = req.body;
                console.log(updateData);
                const filter = { _id: new ObjectId(id) };
                const options = { upsert: true };
                const updateFromData = {
                    $set: {
                        name: updateData.name,
                        selectedSectors: updateData.selectedSectors,
                        agreeToTerms: true
                    }
                };

                const updateTask = await saveCollection.updateOne(filter, updateFromData, options);
                res.send(updateTask);
            } catch (error) {
                console.error('Error updating task:', error);
                res.status(500).send('Error updating task');
            }
        });

    } catch (error) {

    }
}



run().catch(console.dir);

app.get('/', (req, res) => res.send('Hello App Hosted In vercel'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;