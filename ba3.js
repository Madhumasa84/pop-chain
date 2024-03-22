// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017"; // MongoDB connection URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define database name and collection name
const dbName = 'loginDB';
const collectionName = 'users';

// Sample user data
const users = [
    { username: 'user1', email: 'user1@example.com', password: 'password1' },
    { username: 'user2', email: 'user2@example.com', password: 'password2' },
    { username: 'user3', email: 'user3@example.com', password: 'password3' }
];

// Connect to MongoDB server
client.connect(err => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        return;
    }
    console.log("Connected to MongoDB successfully");

    // Get reference to the database
    const db = client.db(dbName);

    // Create a collection named 'users' and insert sample user data
    db.collection(collectionName).insertMany(users, (err, result) => {
        if (err) {
            console.error("Error inserting documents:", err);
            return;
        }
        console.log(`${result.insertedCount} documents inserted into the '${collectionName}' collection`);
        
        // Close the connection to MongoDB
        client.close();
    });
});
