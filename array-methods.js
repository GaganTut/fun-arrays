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
function newRoundedProp(element) {
  return {
    amount: element.amount,
    state: element.state,
    rounded: Math.round(element.amount)
  };
}

var roundedDollar = dataset.map(newRoundedProp);

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
function roundToTens(element){
  return {
    amount: Math.round(element.amount * 10)/ 10,
    state: element.state,
  };
}

var roundedDime = dataset.map(roundToTens);

// set sumOfBankBalances to the sum of all amounts in bankBalances

function toTotalSum(num, element) {
  return Math.round((num += parseFloat(element.amount)) * 100)/100;
}

var sumOfBankBalances = dataset.reduce(toTotalSum, 0);
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

function outSpecialStates(element) {
  return ["WI", "IL", "WY", "OH", "GA", "DE"].indexOf(element.state) > -1;
}

function downToTotalTax(num, element) {
  return Math.round((num + Math.round(element.amount * 0.189 * 100)/100) * 100)/100;
}

var sumOfInterests = dataset.filter(outSpecialStates)
  .reduce(downToTotalTax, 0);

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

function tax(element) {
  return {
    state: element.state,
    tax: Math.round(element.amount * 18.9)/100
  };
}

function arrToStateObj(obj, element) {
  if(obj.hasOwnProperty(element.state)) {
    obj[element.state] += Math.round(parseFloat(element.amount) * 100)/100;
  } else {
    obj[element.state] = Math.round(parseFloat(element.amount) * 100)/100;
  }
  obj[element.state] = Math.round(parseFloat(obj[element.state]) * 100)/ 100;

  return obj;
}

function filterNonStates(element) {
  return ["WI", "IL", "WY", "OH", "GA", "DE"].indexOf(element.state) === -1;
}

function filterAmt(element) {
  return parseFloat(element.tax) > 50000;
}

function totalTaxNow(num, element) {
  return Math.round((num + element.tax) * 100)/100;
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

function onlyLowerStates(collection, element) {
  if (element.amount < 1000000) {
    collection.push(element.state);
  }
  return collection;
}

var lowerSumStates = newArr.reduce(onlyLowerStates, []);

/*
  set higherStateSums to be the sum of
    all amounts of every state
    where the sum of amounts in the state is
      greater than 1,000,000
 */

function onlyHigherStates(total, element) {
  if (element.amount > 1000000) {
    total += element.amount;
  }
  return total;
}

var higherStateSums = newArr.reduce(onlyHigherStates, 0);



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

function checkAmount(element) {
  return element.amount > 2550000;
}

var areStatesInHigherStateSum = newArr.filter(outSpecialStates)
  .every(checkAmount);

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

var anyStatesInHigherStateSum = newArr.filter(outSpecialStates)
  .some(checkAmount);

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
