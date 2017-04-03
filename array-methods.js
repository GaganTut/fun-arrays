var dataset = require('./dataset.json').bankBalances;

/*
  create an array with accounts from bankBalances that are
  greater than 100000.00
  assign the resulting array to `hundredThousandairs`
*/
var hundredThousandairs = null;

hundredThousandairs = dataset.filter((element) => {
   if(parseFloat(element.amount) > 100000) {
    return element;
   }
});

/*
  set a new key for each object in bankBalances named `rounded`
  the value of this key will be the `amount` rounded to the nearest dollar
  example
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting array to `roundedDollar`
*/
var roundedDollar = null;

roundedDollar = dataset.map((element) => {
  let newObj = {
    amount: element.amount,
    state: element.state,
    rounded: Math.round(element.amount)
  };
  return newObj;
});

/*
  set a the `amount` value for each object in bankBalances
  to the value of `amount` rounded to the nearest 10 cents
  example
    {
      "amount": 134758.4,
      "state": "HI"
    }
  assign the resulting array to `roundedDime`
*/
var roundedDime = null;

roundedDime = dataset.map((element) => {
  let newObj = {
    amount: Math.round(element.amount * 10)/ 10,
    state: element.state,
  };

  return newObj;
});

// set sumOfBankBalances to the sum of all amounts in bankBalances
var sumOfBankBalances = null;

function addNums(num, elem) {
  num += parseFloat(elem.amount);
  return num;
}

sumOfBankBalances = Number(dataset.reduce(addNums, 0).toFixed(2));
/*
  set sumOfInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  in each of the following states
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */
var sumOfInterests = null;

function filterStates(elem) {
  return ["WI", "IL", "WY", "OH", "GA", "DE"].indexOf(elem.state) > -1;
}

function totalTax(num, elem) {
  let bal = parseFloat(elem.amount);
  let amount = Number((bal * 0.189).toFixed(2));
  return num + amount;
}

sumOfInterests = Number(dataset.filter(filterStates).reduce(totalTax, 0).toFixed(2));

/*
  set sumOfHighInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  where the amount of the sum of interests in that state is
    greater than 50,000
  in every state except
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */
var sumOfHighInterests = null;

function tax(elem) {
  let bal = parseFloat(elem.amount);
  let amount = (bal * 0.189);
  return {
    state: elem.state,
    tax: amount
  };
}

function reduceStates(arr, elem) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].state === elem.state) {
      arr[i].tax += parseFloat(elem.tax);
      return arr;
    }
  }
  arr.push({
    state: elem.state,
    tax: elem.tax
  });
  return arr;
}

function filterNonStates(elem) {
  return ["WI", "IL", "WY", "OH", "GA", "DE"].indexOf(elem.state) === -1;
}

function filterAmt(elem) {
  return elem.tax > 50000;
}

function totalTaxNow(num, elem) {
  let bal = Number(parseFloat(elem.tax).toFixed(2));
  return num + bal;
}

sumOfHighInterests = Math.round(dataset.filter(filterNonStates).map(tax).reduce(reduceStates, []).filter(filterAmt).reduce(totalTaxNow, 0)*100)/100;
/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table
    where the key is the two letter state abbreviation
    and the value is the sum of all amounts from that state
      the value must be rounded to the nearest cent
 */
var stateSums = null;

function joinStates(arr, elem) {
  for (var k in arr) {
    if (k === elem.state) {
      let arrK = Math.round(parseFloat(arr[k]) * 100)/100;
      arrK += Math.round(parseFloat(elem.amount) * 100)/100;
      arrK = Math.round(arrK *100) /100;
      arr[k] = arrK;
      return arr;
    }
  }

  let key = elem.state;
  arr[key] = Math.round(parseFloat(elem.amount) * 100)/100;
  return arr;
}

stateSums = dataset.reduce(joinStates, {});

/*
  set lowerSumStates to an array containing
  only the two letter state abbreviation of each state
  where the sum of amounts in the state is
    less than 1,000,000
 */
var lowerSumStates = null;

function reduceNowStates(collection, elem) {
  for (var k in collection) {
    if (collection[k].state === elem.state) {
      let addAmount = Math.round(parseFloat(elem.amount) * 100)/100;
      let collAmt = Math.round(parseFloat(collection[k].amount) * 100)/100;
      collAmt += addAmount;
      collection[k].amount = collAmt;
      return collection;
    }
  }
  let newArr = {
    state: elem.state,
    amount: Math.round(parseFloat(elem.amount) * 100)/100
  };
  collection.push(newArr);

  return collection;
}

function reduceLower(collection, elem) {
  if (elem.amount < 1000000) {
    collection.push(elem.state);
  }
  return collection;
}

lowerSumStates = dataset.reduce(reduceNowStates, []).reduce(reduceLower, []);

/*
  set higherStateSums to be the sum of
    all amounts of every state
    where the sum of amounts in the state is
      greater than 1,000,000
 */
var higherStateSums = null;

function reduceHigher(total, elem) {
  if (elem.amount > 1000000) {
    total += elem.amount;
  }
  return total;
}

higherStateSums = dataset.reduce(reduceNowStates, []).reduce(reduceHigher, 0);



/*
  set areStatesInHigherStateSum to be true if
    all of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */
var areStatesInHigherStateSum = null;

function reduceBool(bool, elem) {
  return elem.amount > 2550000;
}

areStatesInHigherStateSum = dataset.reduce(reduceNowStates, []).filter(filterStates).every(reduceBool);

/*
  Stretch Goal && Final Boss

  set anyStatesInHigherStateSum to be true if
    any of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */
var anyStatesInHigherStateSum = null;

anyStatesInHigherStateSum = !dataset.reduce(reduceNowStates, []).filter(filterStates).every(reduceBool);


module.exports = {
  hundredThousandairs : hundredThousandairs,
  roundedDollar : roundedDollar,
  roundedDime : roundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};
