const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://selectionFrom:selectionFrom@cluster0.prgsjug.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("codify").collection("itemList");
        // const taskFinishCollection = client.db("TodoApp").collection("TaskFinish");

        // ---------------- Form App ---------------//

        //Display All Task
        app.get('/data', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query)
            const tasks = await cursor.toArray()
            res.send(tasks);
        })


        //For Updating Task
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updateDescription = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const upDateTask = {
                $set: {
                    Description: updateDescription.Description
                }
            }
            const updateTask = await taskCollection.updateOne(filter, upDateTask, options)
            res.send(updateTask)
        })


        //For Add new Task on list
        app.post('/task', async (req, res) => {
            const data = req.body;
            const newTask = await taskCollection.insertOne(data)
            res.send(newTask);
        })



        //The Finish task will remove from List
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const taskFinish = taskCollection.deleteOne(query)
            res.send(taskFinish);
        })

        //The only Finish task will remove from Database
        app.delete('/taskFinish/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const taskFinish = taskFinishCollection.deleteOne(query)
            res.send(taskFinish);
        })


    } catch (error) {

    }
}



run().catch(console.dir);

app.get('/', (req, res) => res.send('Hello App Hosted In vercel'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))