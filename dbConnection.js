const { MongoClient, ServerApiVersion } = require('mongodb');


const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict:true,
        deprecationErrors:true
    }
});

async function runDB() {
    try {
    await client.connect();
    
    } catch (err) {
        console.error(err);
    }
}

module.exports = { runDB, client };