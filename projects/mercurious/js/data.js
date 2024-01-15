var UNIT = 'MWH';
var YEAR = new Date().getFullYear();
var CODES = ['ICB', 'WEX', 'TPB', 'GFI', 'TFS', 'PRE'];
var extended_credit_line = 4;
var no_master_agreement = 4;

var product_list = new Array();
product_list.push(new Product(0, 'German Baseload'));
product_list.push(new Product(1, 'German Peakload'));
product_list.push(new Product(2, 'German Off-Peak'));

var transaction_list = new Array();
var orders = new Array();
var last_trades = new Array();

function generate_period_data(min_price, max_price) {
  var orders_for_period = new Array();
  for(var product_id = 1; product_id < product_list.length; product_id++) {
    var number_bids = generate_random_integer(2, 5);
    var product_bid_orders = new Array();
    for(var i = 0; i < number_bids; i++) {
      var qty = generate_random_integer(1, 10) * 5;
      var price = round_up_to_nearest_05(round_number(generate_random_float(min_price, max_price), 2));
      var code = CODES[generate_random_integer(0, CODES.length-1)];
      product_bid_orders.push(new BidOrder(product_list[product_id], qty, price, code));
    }
    product_bid_orders.sort(sort_function_bid_array);
    var number_asks = generate_random_integer(2, 5);
    var product_ask_orders = new Array();
    for(var i = 0; i < number_asks; i++) {
      var qty = generate_random_integer(1, 10) * 5;
      var price = round_up_to_nearest_05(round_number(generate_random_float(product_bid_orders[0].price + 0.01, max_price), 2));
      var code = CODES[generate_random_integer(0, CODES.length-1)];
      product_ask_orders.push(new AskOrder(product_list[product_id], qty, price, code));
    }
    product_ask_orders.sort(sort_function_ask_array);
    orders_for_period[product_id] = new Array();
    orders_for_period[product_id]['bid'] = product_bid_orders;
    orders_for_period[product_id]['ask'] = product_ask_orders;
  }
  product_id = 0;
  var sum = 0;
  for(var i = 1; i < product_list.length; i++) {
    sum += orders_for_period[i]['bid'][0].price;
  }
  var average = sum / (product_list.length-1);
  min_price = average - (average / 100 * generate_random_float(0, 10));
  max_price = average + (average / 100 * generate_random_float(0, 10));
  var number_bids = generate_random_integer(2, 5);
  var product_bid_orders = new Array();
  for(var i = 0; i < number_bids; i++) {
    var qty = generate_random_integer(1, 10) * 5;
    var price = round_up_to_nearest_05(round_number(generate_random_float(min_price, max_price), 2));
    var code = CODES[generate_random_integer(0, CODES.length-1)];
    product_bid_orders.push(new BidOrder(product_list[product_id], qty, price, code));
  }
  product_bid_orders.sort(sort_function_bid_array);
  var sum = 0;
  for(var i = 1; i < product_list.length; i++) {
    sum += orders_for_period[i]['ask'][0].price;
  }
  var average = sum / (product_list.length-1);
  min_price = average - (average / 100 * generate_random_float(0, 10));
  max_price = average + (average / 100 * generate_random_float(0, 10));
  var number_asks = generate_random_integer(2, 5);
  var product_ask_orders = new Array();
  for(var i = 0; i < number_asks; i++) {
    var qty = generate_random_integer(1, 10) * 5;
    var price = round_up_to_nearest_05(round_number(generate_random_float(product_bid_orders[0].price + 0.01, max_price), 2));
    var code = CODES[generate_random_integer(0, CODES.length-1)];
    product_ask_orders.push(new AskOrder(product_list[product_id], qty, price, code));
  }
  product_ask_orders.sort(sort_function_ask_array);
  orders_for_period[product_id] = new Array();
  orders_for_period[product_id]['bid'] = product_bid_orders;
  orders_for_period[product_id]['ask'] = product_ask_orders;
  return orders_for_period;
}

function generate() {
  orders['Fri 14/08/' + (YEAR+'').slice(-2)] = generate_period_data(30, 40);
  last_trades['Fri 14/08/' + (YEAR+'').slice(-2)] = generate_last_trade(30, 40);
  orders['Sat 15/08/' + (YEAR+'').slice(-2)] = generate_period_data(25, 32);
  last_trades['Sat 15/08/' + (YEAR+'').slice(-2)] = generate_last_trade(25, 32);
  orders['Sun 16/08/' + (YEAR+'').slice(-2)] = generate_period_data(18, 27);
  last_trades['Sun 16/08/' + (YEAR+'').slice(-2)] = generate_last_trade(18, 27);
  orders['WkEnd 32-' + (YEAR+'').slice(-2)] = generate_period_data(25, 32);
  last_trades['WkEnd 32-' + (YEAR+'').slice(-2)] = generate_last_trade(25, 32);
  orders['WkEnd 33-' + (YEAR+'').slice(-2)] = generate_period_data(25, 32);
  last_trades['WkEnd 33-' + (YEAR+'').slice(-2)] = generate_last_trade(25, 32);
  orders['Wk 34-' + (YEAR+'').slice(-2)] = generate_period_data(28, 37);
  last_trades['Wk 34-' + (YEAR+'').slice(-2)] = generate_last_trade(28, 37);
  orders['Wk 35-' + (YEAR+'').slice(-2)] = generate_period_data(30, 40);
  last_trades['Wk 35-' + (YEAR+'').slice(-2)] = generate_last_trade(30, 40);
  orders['Wk 36-' + (YEAR+'').slice(-2)] = generate_period_data(32, 42);
  last_trades['Wk 36-' + (YEAR+'').slice(-2)] = generate_last_trade(32, 42);
  orders['Wk 37-' + (YEAR+'').slice(-2)] = generate_period_data(33, 43);
  last_trades['Wk 37-' + (YEAR+'').slice(-2)] = generate_last_trade(33, 43);
  orders['Sep-' + (YEAR+'').slice(-2)] = generate_period_data(34, 44);
  last_trades['Sep-' + (YEAR+'').slice(-2)] = generate_last_trade(34, 44);
  orders['Oct-' + (YEAR+'').slice(-2)] = generate_period_data(36, 46);
  last_trades['Oct-' + (YEAR+'').slice(-2)] = generate_last_trade(36, 46);
  orders['Nov-' + (YEAR+'').slice(-2)] = generate_period_data(40, 50);
  last_trades['Nov-' + (YEAR+'').slice(-2)] = generate_last_trade(40, 50);
  orders['Dec-' + (YEAR+'').slice(-2)] = generate_period_data(40, 50);
  last_trades['Dec-' + (YEAR+'').slice(-2)] = generate_last_trade(40, 50);
  orders['Jan-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 50);
  last_trades['Jan-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 50);
  orders['Feb-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 50);
  last_trades['Feb-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 50);
  orders['Q4-' + (YEAR+'').slice(-2)] = generate_period_data(40, 50);
  last_trades['Q4-' + (YEAR+'').slice(-2)] = generate_last_trade(40, 50);
  orders['Q1-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Q1-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 55);
  orders['Q2-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Q2-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 55);
  orders['Q3-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Q3-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 55);
  orders['Q4-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Q4-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 55);
  orders['Cal-' + ((YEAR+1)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Cal-' + ((YEAR+1)+'').slice(-2)] = generate_last_trade(40, 55);
  orders['Cal-' + ((YEAR+2)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Cal-' + ((YEAR+2)+'').slice(-2)] = generate_last_trade(40, 55);
  orders['Cal-' + ((YEAR+3)+'').slice(-2)] = generate_period_data(40, 55);
  last_trades['Cal-' + ((YEAR+3)+'').slice(-2)] = generate_last_trade(40, 55);
  var keys = random_keys(orders, 12);
  for(var i = 0; i < keys.length / 3; i++) {
    var ask_or_bid = generate_random_boolean() ? 'ask' : 'bid';
    var order = orders[keys[i]][generate_random_integer(0, product_list.length - 1)][ask_or_bid][0];
    order.exceeded_credit_line = true;
  }
  for(var i = keys.length / 3; i < keys.length / 3 * 2; i++) {
    var ask_or_bid = generate_random_boolean() ? 'ask' : 'bid';
    var new_broker = 'AUTO';
    var num = generate_random_integer(0, product_list.length - 1);
    var order = orders[keys[i]][num][ask_or_bid][0];
    if(num === 0) {
      var sum = 0;
      for(var j = 0; j < product_list.length; j++) {
        if(j != num)
          sum += orders[keys[i]][j][ask_or_bid][0].price;
      }
      order.price = sum / (product_list.length - 1);
    } else {
      var sum = 0;
      for(var j = 0; j < product_list.length; j++) {
        if(j != num && j != 0)
          sum += orders[keys[i]][j][ask_or_bid][0].price;
      }
      order.price = orders[keys[i]][0][ask_or_bid][0].price * (product_list.length - 1) - sum;
    }
    order.auto = true;
    order.code = new_broker;
  }
  for(var i = keys.length / 3 * 2; i < keys.length; i++) {
    var ask_or_bid = generate_random_boolean() ? 'ask' : 'bid';
    var order = orders[keys[i]][generate_random_integer(0, product_list.length - 1)][ask_or_bid][0];
    order.no_master_agreement = true;
  }
}

function generate_last_trade(min_price, max_price) {
  var prices = new Array();
  for(product_id in product_list) {
    prices[product_id] = round_up_to_nearest_05(round_number(generate_random_float(min_price, max_price), 2));
  }
  return prices;
}

function sort_function_bid_array(a, b) {
  return b.price - a.price;
}

function sort_function_ask_array(a, b) {
  return a.price - b.price;
}

function round_up_to_nearest_05(number) {
  return Math.ceil(number * 20) / 20;
}

function random_key(obj) {
  var ret;
  var c = 0;
  for (var key in obj)
    if (Math.random() < 1/++c)
      ret = key;
  return ret;
}

// has to be cleanly divisible by 3
function random_keys(obj, num) {
  if(num % 3 != 0)
    num = Math.ceil(num/3.0) * 3;
  var ret = new Array();
  for(var i = 0; i < num; i++) {
    var c = 0;
    for(var key in obj) {
      var key_chosen = false;
      for(var j = 0; j < ret.length; j++) {
        if(ret[j] == key) {
          key_chosen = false;
          break;
        }
      }
      if(!key_chosen && Math.random() < 1/++c) {
        ret[i] = key;
      }
    }
  }
  return ret;
}