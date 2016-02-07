var casper = require('casper').create();

//URLs
const loginUrl = 'https://bancanet.banamex.com/MXGCB/JPS/portal/Index.do';
const dashboardUrl = 'https://bancanet.banamex.com/MXGCB/CBOL/ain/dashboard/flow.action';
const reportUrl = 'https://bancanet.banamex.com/MXGCB/CBOL/ain/accdetact/flow.action';

/**
 * Iterates through all the transactions and translate them to JSON.
 * This function is meant to be 'evaluated' as per PhantomJS evaluate,
 * querySelectorAll needs to run inside of the sandbox.
 * @return {array} with objects representing each transaction.
 */
var getTransactions = function() {
  var result = [];
  var rows = document.querySelectorAll('.cT-firstRow');

  for(var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var transaction = {};

    transaction.date = row.children[1].children[0].innerHTML;
    transaction.description = row.children[2].children[0].innerHTML;

    var credit = row.children[3].children[1];
    if(credit) {
      transaction.credit = parseFloat(credit.innerHTML);
    }

    var debit = row.children[4].children[1];
    if(debit) {
      transaction.debit = parseFloat(debit.innerHTML);
    }

    result.push(transaction);
  }
  return result;
};

/**
 * Gets the name of the active account.
 * @return {string} the name of the active account.
 */
var getName = function() {
  var selector = '#accountDropdownSelect-button > span.ui-selectmenu-status > span > span.ui-selectmenu-item-header.cS-accountMenuAccount span';
  return this.fetchText(selector);
};

/**
 * Gets the current balance for the account.
 * @return {float} the balance of the active account.
 */
var getBalance = function() {
  var selector = '#summaryTooltip-info > div > div.col.colnomar > div:nth-child(2) > p:nth-child(2)';
  var balance = this.fetchText(selector);
  return parseFloat(balance.replace(/,/,'').replace(/\$/,''));
}

/**
 * Fetches all information for the account and spits it out.
 */
var printAccount = function() {
  var account = {};
  try {
    account.openingBalance = getBalance.bind(this)();
    account.name = getName.bind(this)();
    account.transactions = this.evaluate(getTransactions);
  }
  catch(err) {
    console.log(err);
    console.log('oops');
  }
  console.log(JSON.stringify(account));
}

// Input user number
casper.start(loginUrl, function() {
  this.fillXPath('form#preSignonForm', {
    '//input[@id="textCliente"]': casper.cli.options.user + ''
  });
  this.click('#login > div.content > div > div.marginT15 > a');
});

// Input password
casper.then(function() {
  this.fillXPath('#preSignonForm2', {
    '//*[@id="textFirma"]': casper.cli.options.pass + ''
  });
  this.click('#enterId');
});

// Check if login succeeded.
casper.then(function() {
  if(this.getCurrentUrl() != dashboardUrl) {
    this.die('Login unsuccessful');
  }
});

casper.thenOpen(reportUrl);

// Wait until transactions table is visible, click on details so we have all
// the info.
casper.waitUntilVisible('.cT-filterContainer', function() {
  this.click('#summaryValue');
  this.wait(500);
});

// Fill all of the account into
casper.then(printAccount);

//Log out
casper.then(function() {
  this.click('#link_logout');
});

casper.run();
