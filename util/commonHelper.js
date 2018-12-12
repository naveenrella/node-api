var moment = require('moment');

var commonHelper = {

    // this method gives the approximate future billing date.. 
    calculateNextBillingCycle : function(currentBillingDate,previousBillingDate){
        // define a day, hours*minutes*seconds*milliseconds
        var oneDay = 24*60*60*1000;
        var currentBillingDate = new Date(currentBillingDate);
        var previousBillingDate = new Date(previousBillingDate);
        var futureBillingDate,
        days =  Math.round(Math.abs((currentBillingDate.getTime() - previousBillingDate.getTime())/(oneDay)));
        futureBillingDate = moment(currentBillingDate).add(days, 'd');
        //console.log(futureBillingDate.format());
        return futureBillingDate.format();
    },

    // this method gives the dynamic transaction date
    buildTransactionName : function(transactionName){
        if((/[^0-9]/g.test(transactionName))){
            transactionName = transactionName.replace(/[0-9]/g, '');
            var dateTag = this.calculateNextBillingCycle();
            dateTag = moment(dateTag).format('MMDDYYYY');
           return  transactionName+dateTag;
        }
        return transactionName;
    },

    calculateBillingAmount : function(){
        // avgerage the previous amounts... 
    }


}

module.exports =  commonHelper;