var dataset = require('./dataset.json').bankBalances;

/*
  create an array with accounts from bankBalances that are
  greater than 100000.00
  assign the resulting array to `hundredThousandairs`
*/

function onlyHunGrand(elem) {
  return parseFloat(elem.amount) > 100000;
}

var hundredThousandairs = dataset.filter(onlyHunGrand);

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

var roundedDollar = dataset.map((element) => {
  return {
    amount: element.amount,
    state: element.state,
    rounded: Math.round(element.amount)
  };
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

var roundedDime = dataset.map((element) => {
  return {
    amount: Math.round(element.amount * 10)/ 10,
    state: element.state,
  };
});

// set sumOfBankBalances to the sum of all amounts in bankBalances

function addNums(num, elem) {
  return Math.round((num += parseFloat(elem.amount)) * 100)/100;
}

var sumOfBankBalances = dataset.reduce(addNums, 0);
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

function filterStates(elem) {
  return ["WI", "IL", "WY", "OH", "GA", "DE"].indexOf(elem.state) > -1;
}

function totalTax(num, elem) {
  return Math.round((num + Math.round(elem.amount * 0.189 * 100)/100) * 100)/100;
}

var sumOfInterests = dataset.filter(filterStates)
  .reduce(totalTax, 0);

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

function tax(elem) {
  return {
    state: elem.state,
    tax: Math.round(elem.amount * 18.9)/100
  };
}

function arrToStateObj(obj, elem) {
  if(obj.hasOwnProperty(elem.state)) {
    obj[elem.state] += Math.round(parseFloat(elem.amount) * 100)/100;
  } else {
    obj[elem.state] = Math.round(parseFloat(elem.amount) * 100)/100;
  }
  obj[elem.state] = Math.round(parseFloat(obj[elem.state]) * 100)/ 100;

  return obj;
}

function filterNonStates(elem) {
  return ["WI", "IL", "WY", "OH", "GA", "DE"].indexOf(elem.state) === -1;
}

function filterAmt(elem) {
  return parseFloat(elem.tax) > 50000;
}

function totalTaxNow(num, elem) {
  return Math.round((num + elem.tax) * 100)/100;
}

let sumsOfStates = dataset.reduce(arrToStateObj, {});

let newArr = Object.keys(sumsOfStates).map((keys) => {
  return {
    state: keys,
    amount: sumsOfStates[keys]
  };
});

var sumOfHighInterests = newArr.filter(filterNonStates)
  .map(tax)
  .filter(filterAmt)
  .reduce(totalTaxNow, 0);

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table
    where the key is the two letter state abbreviation
    and the value is the sum of all amounts from that state
      the value must be rounded to the nearest cent
 */

var stateSums = sumsOfStates;

/*
  set lowerSumStates to an array containing
  only the two letter state abbreviation of each state
  where the sum of amounts in the state is
    less than 1,000,000
 */

function reduceLower(collection, elem) {
  if (elem.amount < 1000000) {
    collection.push(elem.state);
  }
  return collection;
}

var lowerSumStates = newArr.reduce(reduceLower, []);

/*
  set higherStateSums to be the sum of
    all amounts of every state
    where the sum of amounts in the state is
      greater than 1,000,000
 */

function reduceHigher(total, elem) {
  if (elem.amount > 1000000) {
    total += elem.amount;
  }
  return total;
}

var higherStateSums = newArr.reduce(reduceHigher, 0);



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

function reduceBool(elem) {
  return elem.amount > 2550000;
}

var areStatesInHigherStateSum = newArr.filter(filterStates)
  .every(reduceBool);

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

var anyStatesInHigherStateSum = newArr.filter(filterStates)
  .some(reduceBool);

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
