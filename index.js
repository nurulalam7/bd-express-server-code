const express =require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors=require('cors');
const app=express();
const ObjectId = require('mongodb').ObjectId
const port=process.env.port || 5000;

// middle ware 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wprwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run(){
    try{
        await client.connect();
        const database =client.db('delivery-system');
        const servicesCollection =database.collection('delivery');
        const ordercollection=database.collection('given_order');

        // get api 
        app.get('/services',async(req,res)=>{
            const cursor=servicesCollection.find({});
            const services=await cursor.toArray();
            res.send(services);
        })

        app.get('/orders',async(req,res)=>{
            const cursor=ordercollection.find({});
            const order=await cursor.toArray();
            res.send(order);
        })

        app.get('/orders/:email',async(req,res)=>{
            const email=req.params.email;
            if (email){
                console.log('email',email);
                const query={email:email}
                const result=await ordercollection.find(query).toArray();
                res.send(result);

            }
           
        })

        // post api 

        app.post('/services',async(req,res)=>{
            const service=req.body;

        //   console.log('hit the post',service);

          const result=await servicesCollection.insertOne(service);
          console.log(result);

          res.json(result)
        })
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id
            console.log(id)
            if(id){
              console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
            console.log(result)
            
      
            }
            
        });

        // for given order 
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            if(id){
                console.log(id);
                const query ={_id:ObjectId(id)}
                const result=await ordercollection.findOne(query)
                res.send(result)
                console.log(result);
            }
        })
        // for given order 
        app.post('/orders',async(req,res)=>{
            const order=req.body;
            const result=await ordercollection.insertOne(order);
            res.json(result);
        })

        // delete api 

        app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result = await ordercollection.deleteOne(query);
            
      
            console.log('delete',result);
           
            res.json(result);
        })

        //  update user 
        app.get('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const user=await ordercollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })

        // next update api 
        app.put('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            // console.log('updating user',id)
            // res.send('not dating');
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
        // create a document that sets the plot of the movie
            const updateDoc = {
            $set: {
                approved: true
            },
            };
            const result = await ordercollection.updateOne( filter,updateDoc, options);


            console.log(result);
            res.send(result);
        })
            // show only user information by login user 
        app.get('/orders/:email',async(req,res)=>{
            const email=req.params.email;
            console.log(email);
            const query={email:email}
            const result=await ordercollection.find(query).toArray();
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('delivery is okay')
});

app.listen(port,()=>{
    console.log('server running ',port)
})
