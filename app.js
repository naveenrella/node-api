var express = require('express');
var app = express();
var commonHelper = require('./util/commonHelper');;
app.get('/', function (req, res) {
    res.send('<h1>Lolli</h1>');
})

//establish mongodb connection. 
var MongoClient = require('mongodb').MongoClient, db, filesCollection;
var username = encodeURIComponent('sukhesh.nri');
var password = encodeURIComponent('ABCabc123$');
var filesCollection = {};
MongoClient.connect('mongodb://' + username + ':' + password + '@ds119164.mlab.com:19164/fitrack', function (err, client) {
    if (err) throw err;
    db = client.db('fitrack');
    filesCollection = db.collection('naveen');
});
var transactionNamesList;
var getListOfAllNames = function () {
    return new Promise(function (resolve, reject) {
        filesCollection.distinct('name', function (err, doc) {
            resolve(transactionNamesList = doc);
        });
    });
}
var currentObj; 
// create an object to hold the future recurring payment details
var futureRecurringDetails = [];
var getDetailsForName = function (param) {

    return new Promise(function (resolve, reject) {
        filesCollection.find({
            'name': {
                $regex: param
            },
        }).sort({
            date: -1
        }).toArray(function (err, doc) {
            if (doc.length > 1) {
                var currentBillingDate= doc[0].date;
                var PreviousBillingDate= doc[1].date;
                commonHelper.calculateNextBillingCycle(currentBillingDate,PreviousBillingDate);
                var futureDate = commonHelper.calculateNextBillingCycle(currentBillingDate,PreviousBillingDate);
                var futureTranasactionName = commonHelper.buildTransactionName (doc[0].name);
                futureRecurringDetails.push({
                    "next_Date":futureDate,
                    "transactionHistory":doc,
                    "name":futureTranasactionName
                });  
            }
            resolve(currentObj = futureRecurringDetails);
        });
    });

}

// group same transaction under one roof...
var transactionHistroy = [];
// this GET api return the list of recurring transactions data and also predicted payments. 
/* 
Work done : Uploaded data from excel to db. (making sure GET works).

Identified the logic of predicting the future date.
Identified the logic for dynamic transaction name. 
Identified the logic of predicting the rate.   


Pending work: 
needs to identify the recurring payments out of the list. 
build the final json like you asked. 

*/
app.get('/getRecurringPayments', function (req, res) {
    getListOfAllNames().then(function () {
        transactionNamesList.forEach(function (element) {
            futureRecurringDetails.name = element;
            getDetailsForName(element).then(function () {
                transactionHistroy.push(currentObj);
            });
        });

        setTimeout(() => {
            res.json(transactionHistroy);
        }, 3000);


    });

});

app.listen(1984, function () {
    console.log("Example app listening on port 1984");
});