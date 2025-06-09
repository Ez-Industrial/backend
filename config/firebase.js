const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);


const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wash-wheels.firebaseio.com"
});