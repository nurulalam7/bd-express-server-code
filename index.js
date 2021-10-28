const express =require('express');
const app=express();
const port=process.env.port || 5000;


app.get('/',(req,res)=>{
    res.send('delivery is okay')
});

app.listen(port,()=>{
    console.log('server running ',port)
})
