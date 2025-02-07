
const mongoose = require('mongoose');

require('dotenv').config();

exports.connectDb = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log('DBconnection is successful');
        })
        .catch((error) => {
            console.log('DB cannot be connected: ', error.message);
        })
}
exports.disconnectDb = () => {
    mongoose.disconnect()
        .then(() => {
            console.log('Db disconnected successfully'); 
        })
        .catch((error) => {
            console.log("Db disconnection error: ", error.message);
       })
}