$(document).ready(function() {
  init();
  layout_tweaks();
  create_events();
  $('.expand:first').click();
});

var expand = new Array();

function create_bid_order_ticket(event, element) {
  var re = /row_/gi;
  var period = $(element).parent().parent().attr('rel');
  var product_bid_orders = orders[period][$(element).attr('rel')]['bid'];
  var order_id = $(element).parent().attr('rel').replace(re, '');
  var order = product_bid_orders[order_id];
  if(order.exceeded_credit_line) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('Exceeded credit line.');
  } else if(order.no_master_agreement) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('You do not have a master agreement with this company.');
  } else {
    $('#order_ticket .bid_price input').attr('disabled', 'disabled');
    $('#order_ticket .ask_price input').removeAttr('disabled');
    $('#order_ticket .ask_price input').attr('value', order.price.toFixed(2));
    $('#order_ticket .bid_price input').attr('value', '');
    create_order_ticket(event, element, period, order_id, order);
  }
}

function create_ask_order_ticket(event, element) {
  var re = /row_/gi;
  var period = $(element).parent().parent().attr('rel');
  var product_bid_orders = orders[period][$(element).attr('rel')]['ask'];
  var order_id = $(element).parent().attr('rel').replace(re, '');
  var order = product_bid_orders[order_id];
  if(order.exceeded_credit_line) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('Exceeded credit line.');
  } else if(order.no_master_agreement) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('You do not have a master agreement with this company.');
  } else {
    $('#order_ticket .ask_price input').attr('disabled', 'disabled');
    $('#order_ticket .bid_price input').removeAttr('disabled');
    $('#order_ticket .bid_price input').attr('value', order.price.toFixed(2));
    $('#order_ticket .ask_price input').attr('value', '');
    create_order_ticket(event, element, period, order_id, order);
  }
}

function create_order_ticket(event, element, period, order_id, order) {
  $('#order_ticket #order_ticket_label').text(order.product.name + ' ' + period);
  $('#order_ticket .expiry input').mask('99:99:99');
  $('#order_ticket .qty input').attr('value', 5);
  $('#order_ticket').modal();
  $('#order_ticket .btn-primary').click(function() {
    process_ticket(period, $(element).attr('rel'));
    $('#order_ticket').modal('hide');
  });
}

function create_events() {
  $('#table-main td.bid').mousedown(function(event) {
    switch (event.which) {
      case 1:
        process_bid(event, this);
        break;
      case 2:
        break;
      case 3:
        create_bid_order_ticket(event, this);
        break;
      default:
        break;
    }
  });
  $('#table-main td.ask').mousedown(function(event) {
    switch (event.which) {
      case 1:
        process_ask(event, this);
        break;
      case 2:
        break;
      case 3:
        create_ask_order_ticket(event, this);
        break;
      default:
        break;
    }
  });
  
  $('#table-top-left td.bid').click(function(event) {process_bid(event, this)});
  $('#table-top-left td.ask').click(function(event) {process_ask(event, this)});
  $('.expand').click(function() {
    if($(this).attr('rel') === 'show') {
      $(this).parent().parent().parent().find('tr:not(:first-child)').show();
      $(this).text('[-]');
      $(this).attr('rel', 'hide');
      expand[$(this).parent().parent().parent().attr('rel')] = true;
    }
    else {
      $(this).parent().parent().parent().find('tr:not(:first-child)').hide();
      $(this).parent().parent().parent().find('tr:nth-child(1)').show();
      $(this).text('[+]');
      $(this).attr('rel', 'show');
      expand[$(this).parent().parent().parent().attr('rel')] = false;
    }
  });
  
  $('#order_ticket .ask_price input').keyup(function(event) {
    if(!isNaN(parseFloat($(this).attr('value'))) && isFinite($(this).attr('value'))) {
      $('#order_ticket .ask_warning').fadeOut();
      if(parseFloat($(this).attr('value')) < 0) {
        $(this).attr('value', '0.00');
      }
    } else {
      $('#order_ticket .ask_warning').fadeIn();
    }
  });
  
  $('#order_ticket .bid_price input').keyup(function(event) {
    if(!isNaN(parseFloat($(this).attr('value'))) && isFinite($(this).attr('value'))) {
      $('#order_ticket .bid_warning').fadeOut();
      if(parseFloat($(this).attr('value')) < 0) {
        $(this).attr('value', '0.00');
      }
    } else {
      $('#order_ticket .bid_warning').fadeIn();
    }
  });
  
  $('#order_ticket .qty input').keyup(function(event) {
    if(!isNaN(parseInt($(this).attr('value'))) && isFinite($(this).attr('value'))) {
      $('#order_ticket .qty_warning').fadeOut();
      if(parseInt($(this).attr('value')) > 100) {
        $(this).attr('value', '100');
      } else if(parseInt($(this).attr('value')) < 1) {
        $(this).attr('value', '1');
      }
    } else {
      $('#order_ticket .qty_warning').fadeIn();
    }
  });
}

function layout_tweaks() {
  $('#table-main .group td:nth-of-type(7n+8)').css('border-left', '3px solid #888');
  $('#table-main tbody:first-child tr:nth-child(2) th:nth-child(1)').css('border-left', '3px solid #888');
  $('#table-main tbody:not(:first-child) tr td:nth-of-type(1)').css('border-left', '3px solid #888');
  $('#table-main tbody:first-child tr:first-child th:not(:first-child)').css('border-left', '3px solid #888');
  $('#table-main tbody:first-child th:nth-of-type(7n+8)').css('border-left', '3px solid #888');
  for(var block in expand) {
    if(expand[block] == 0) {
      $('#table-main .group[rel="' + block + '"] > tr:not(:first-child)').hide();
      $('#table-main .group[rel="' + block + '"] > tr:nth-child(1)').show();
    }
  }
  //document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
}

function init() {
  generate();
  var product_bid_orders = orders['Fri 14/08/' + (YEAR+'').slice(-2)][0]['bid'];
  var product_ask_orders = orders['Fri 14/08/' + (YEAR+'').slice(-2)][0]['ask'];
  var max = product_bid_orders.length > product_ask_orders.length ? product_bid_orders.length : product_ask_orders.length;
  $('#top-left-title').text(product_bid_orders[0].product.name + ': Fri 14/08/' + (YEAR+'').slice(-2));
  var group = $('<tbody rel="Fri 14/08/' + (YEAR+'').slice(-2) +'" class="group"></tbody>').appendTo('#table-top-left');
  for(var i = 0; i < max; i++) {
    var table_row_contents = create_table_row_contents('left_row_' + i, product_bid_orders[i], product_ask_orders[i]);
    var table_row = create_table_row('row_' + i, table_row_contents);
    insert_table_row(table_row, $(group));
  }
  var header = '<tr><th class="orange" rowspan="2"></th>';
  var header2 = '<tr>';
  for(product in product_list) {
    header += '<th class="orange" colspan="7">' + product_list[product].name + '</th>'
    header2 +='<th class="orange bid_code">Code</th><th class="orange bid_qty">Qty</th><th class="orange bid">Bid</th><th class="orange ask">Ask</th><th class="orange ask_qty">Qty</th><th class="orange ask_code">Code</th><th class="orange last">Last</th>';
  }
  header += '</tr>';
  header2 += '</tr>';
  $('#table-main').append(header);
  $('#table-main').append(header2);
  var first = true;
  for(order in orders) {
    expand[order] = first ? 1 : 0;
    first = false;
    var product_bid_orders = orders[order][0]['bid'];
    var product_ask_orders = orders[order][0]['ask'];
    var group = $('<tbody rel="' + order +'" class="group"></tbody>').appendTo('#table-main');
    var max = orders[order][0]['bid'].length > orders[order][0]['ask'].length ? orders[order][0]['bid'].length : orders[order][0]['ask'].length;
    for(product in product_list) {
      var temp_max = orders[order][product]['bid'].length > orders[order][product]['ask'].length ? orders[order][product]['bid'].length : orders[order][product]['ask'].length;
      if(max < temp_max) {
        max = temp_max;
      }
    }
    var groupName = '<th class="orange" rowspan="' + max + '"><span rel="show" class="expand">[+]</span> ' + order + '</th>';
    var last = '<td class="last">' + last_trades[order][0].toFixed(2) + '</td>';
    if(max === 0) {
      insert_table_row('row_0', undefined, undefined, $(group), groupName, last);
    }
    var first = true;
    for(var i = 0; i < max; i++) {
      var table_row_contents = '';
      for(product in product_list) {
        if(first) {
          var last = '<td class="last">' + last_trades[order][product].toFixed(2) + '</td>';
        } else {
          var last = '<td class="last"></td>';
        }
        table_row_contents += create_table_row_contents('row_' + i,orders[order][product]['bid'][i], orders[order][product]['ask'][i], groupName, last);
        groupName = '';
      }
      first = false;
      var table_row = create_table_row('row_' + i, table_row_contents);
      insert_table_row(table_row, $(group));
    }
  }
}

function rebuild_main_table() {
  $('#table-main').html('');
  var header = '<tr><th class="orange" rowspan="2"></th>';
  var header2 = '<tr>';
  for(product in product_list) {
    header += '<th class="orange" colspan="7">' + product_list[product].name + '</th>'
    header2 +='<th class="orange bid_code">Code</th><th class="orange bid_qty">Qty</th><th class="orange bid">Bid</th><th class="orange ask">Ask</th><th class="orange ask_qty">Qty</th><th class="orange ask_code">Code</th><th class="orange last">Last</th>';
  }
  header += '</tr>';
  header2 += '</tr>';
  $('#table-main').append(header);
  $('#table-main').append(header2);
  for(order in orders) {
    var product_bid_orders = orders[order][0]['bid'];
    var product_ask_orders = orders[order][0]['ask'];
    var group = $('<tbody rel="' + order +'" class="group"></tbody>').appendTo('#table-main');
    var max = orders[order][0]['bid'].length > orders[order][0]['ask'].length ? orders[order][0]['bid'].length : orders[order][0]['ask'].length;
    for(product in product_list) {
      var temp_max = orders[order][product]['bid'].length > orders[order][product]['ask'].length ? orders[order][product]['bid'].length : orders[order][product]['ask'].length;
      if(max < temp_max) {
        max = temp_max;
      }
    }
    var expand_button = !expand[order] ? '<span rel="show" class="expand">[+]</span>' : '<span rel="hide" class="expand">[-]</span>';
    var groupName = '<th class="orange" rowspan="' + max + '">' + expand_button + ' ' + order + '</th>';
    var last = '<td class="last">' + last_trades[order][0].toFixed(2) + '</td>';
    if(max === 0) {
      insert_table_row('row_0', undefined, undefined, $(group), groupName, last);
    }
    var first = true;
    for(var i = 0; i < max; i++) {
      var table_row_contents = '';
      for(product in product_list) {
        if(first) {
          var last = '<td class="last">' + last_trades[order][product].toFixed(2) + '</td>';
        } else {
          var last = '<td class="last"></td>';
        }
        table_row_contents += create_table_row_contents('row_' + i,orders[order][product]['bid'][i], orders[order][product]['ask'][i], groupName, last);
        groupName = '';
      }
      first = false;
      var table_row = create_table_row('row_' + i, table_row_contents);
      insert_table_row(table_row, $(group));
    }
  }
  create_events();
  layout_tweaks();
}

function insert_table_row(row, table) {
  table.append(row);
}

function create_table_row(row_id, content) {
  var table_row = '<tr rel="' + row_id + '">' + content + '</tr>'
  return table_row;
}

function create_table_row_contents(row_id, bid, ask, prepend, append) {
  if(typeof prepend == 'undefined')
    prepend = '';
  if(typeof append == 'undefined')
    append = '';
  var table_row = prepend;
  if(typeof bid != 'undefined') {
    var class_addition = '';
    if(bid.exceeded_credit_line)
      class_addition += ' ecl';
    else if(bid.no_master_agreement)
      class_addition += ' nma';
    else if(bid.auto)
      class_addition += ' auto';
    table_row += '<td class="bid_code' + class_addition + '">' + bid.code + '</td>'
      + '<td id="' + row_id + '_' + bid.product.id + '_bid_qty" class="bid_qty' + class_addition + '">' + bid.qty + '</td>'
      + '<td rel="' + bid.product.id + '" class="bid' + class_addition + '">' + bid.price.toFixed(2) + '</td>';
  } else {
    table_row += '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>';
  }
  if(typeof ask != 'undefined') {
    var class_addition = '';
    if(ask.exceeded_credit_line)
      class_addition += ' ecl';
    else if(ask.no_master_agreement)
      class_addition += ' nma';
    else if(ask.auto)
      class_addition += ' auto';
    table_row += '<td rel="' + ask.product.id + '" class="ask' + class_addition + '">' + ask.price.toFixed(2) + '</td>'
      + '<td id="' + row_id + '_' + ask.product.id + '_ask_qty" class="ask_qty' + class_addition + '">' + ask.qty + '</td>'
      + '<td class="ask_code' + class_addition + '">' + ask.code + '</td>';
  } else {
    table_row += '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>';
  }
  table_row += append;
  return table_row;
}

function process_ticket(period, product_id) {
  var date = new Date()
  var time = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
  if($('#order_ticket .bid_price input').val().length != 0) { // bid
    var price = parseFloat($('#order_ticket .bid_price input').val());
    var qty = parseInt($('#order_ticket .qty input').val());
    var product_bid_orders = orders[period][product_id]['bid'];
    
    
    
    for (var i = 0; i < product_bid_orders.length; i++) {
      if(price <= product_bid_orders[i].price) { // price is right
        if(product_bid_orders[i].qty - qty >= 0) { // enough qty available
          // create transaction and store it
          var transaction = new Transaction(product_bid_orders[i].product, qty, product_bid_orders[i].price, product_bid_orders[i], period, time);
          transaction_list.push(transaction);
          console.log(transaction_list);
          // push transaction to log
          $('table#activity-ticker tbody tr th').parent().after('<tr><td>' + transaction.time + '</td><td>' + transaction + '</td></tr>');
          $('table#activity-ticker tr:last').remove();
          if(product_bid_orders[i].qty - qty == 0) { // qty matches perfectly
            // remove order since the qty will be 0
            orders[period][product_id]['bid'].splice(i, 1);
          } else { // still some qty left
            // update qty on order
            orders[period][product_id]['bid'][i].qty = product_bid_orders[i].qty - qty;
          }
          last_trades[period][product_id] = product_bid_orders[i].price;
          rebuild_main_table();
          return;
        } else { // not enough qty available
          var temp_qty = product_bid_orders[i].qty;
          var transaction = new Transaction(product_bid_orders[i].product, temp_qty, product_bid_orders[i].price, product_bid_orders[i], period, time);
          transaction_list.push(transaction);
          qty = qty - temp_qty;
          // push transaction to log
          $('table#activity-ticker tbody tr th').parent().after('<tr><td>' + transaction.time + '</td><td>' + transaction + '</td></tr>');
          $('table#activity-ticker tr:last').remove();
          orders[period][product_id]['bid'].splice(i, 1);
          i--;
        }
      }
    }
  } else { // ask
    var price = parseFloat($('#order_ticket .ask_price input').val());
    var qty = parseInt($('#order_ticket .qty input').val());
    var product_ask_orders = orders[period][product_id]['ask'];
    for (var i = 0; i < product_ask_orders.length; i++) {
      if(price >= product_ask_orders[i].price) { // price is right
        if(product_ask_orders[i].qty - qty >= 0) { // enough qty available
          // create transaction and store it
          var transaction = new Transaction(product_ask_orders[i].product, qty, product_ask_orders[i].price, product_ask_orders[i], period, time);
          transaction_list.push(transaction);
          console.log(transaction_list);
          // push transaction to log
          $('table#activity-ticker tbody tr th').parent().after('<tr><td>' + transaction.time + '</td><td>' + transaction + '</td></tr>');
          $('table#activity-ticker tr:last').remove();
          if(product_ask_orders[i].qty - qty == 0) { // qty matches perfectly
            // remove order since the qty will be 0
            orders[period][product_id]['ask'].splice(i, 1);
          } else { // still some qty left
            // update qty on order
            orders[period][product_id]['ask'][i].qty = product_ask_orders[i].qty - qty;
          }
          last_trades[period][product_id] = product_ask_orders[i].price;
          rebuild_main_table();
          return;
        } else { // not enough qty available
          var temp_qty = product_ask_orders[i].qty;
          var transaction = new Transaction(product_ask_orders[i].product, temp_qty, product_ask_orders[i].price, product_ask_orders[i], period, time);
          transaction_list.push(transaction);
          qty = qty - temp_qty;
          // push transaction to log
          $('table#activity-ticker tbody tr th').parent().after('<tr><td>' + transaction.time + '</td><td>' + transaction + '</td></tr>');
          $('table#activity-ticker tr:last').remove();
          orders[period][product_id]['ask'].splice(i, 1);
          i--;
        }
      }
    }
  }
}

var process_bid = function(event, element) {
  var date = new Date();
  var time = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
  var re = /row_/gi;
  var period = $(element).parent().parent().attr('rel');
  var product_bid_orders = orders[period][$(element).attr('rel')]['bid'];
  var order_id = $(element).parent().attr('rel').replace(re, '');
  var order = product_bid_orders[order_id];
  if(order.exceeded_credit_line) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('Exceeded credit line.');
  } else if(order.no_master_agreement) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('You do not have a master agreement with this company.');
  } else {
    var transaction = new Transaction(order.product, 1, order.price, order, period, time);
    transaction_list.push(transaction);
    $('table#activity-ticker tbody tr th').parent().after('<tr><td>' + transaction.time + '</td><td>' + transaction + '</td></tr>');
    $('table#activity-ticker tr:last').remove();
    // subtract qty
    order.qty = order.qty - 1;
    if(order.qty <= 0) {
      orders[period][$(element).attr('rel')]['bid'].splice(order_id, 1);
    } else {
      orders[period][$(element).attr('rel')]['bid'][order_id] = order;
    }
    last_trades[period][$(element).attr('rel')] = order.price;
    rebuild_main_table();
  }
}

var process_ask = function(event, element) {
  var date = new Date();
  var time = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
  var re = /row_/gi;
  var period = $(element).parent().parent().attr('rel');
  var product_ask_orders = orders[period][$(element).attr('rel')]['ask'];
  var order_id = $(element).parent().attr('rel').replace(re, '');
  var order = product_ask_orders[order_id];
  if(order.exceeded_credit_line) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('Exceeded credit line.');
  } else if(order.no_master_agreement) {
    $('#warning_popup').modal();
    $('#warning_popup .warning_text').text('You do not have a master agreement with this company.');
  } else {
    var transaction = new Transaction(order.product, 1, order.price, order, period, time);
    transaction_list.push(transaction);
    $('table#activity-ticker tbody tr th').parent().after('<tr><td>' + transaction.time + '</td><td>' + transaction + '</td></tr>');
    $('table#activity-ticker tr:last').remove();
    // subtract qty
    order.qty = order.qty - 1;
    if(order.qty <= 0) {
      orders[period][$(element).attr('rel')]['ask'].splice(order_id, 1);
    } else {
      orders[period][$(element).attr('rel')]['ask'][order_id] = order;
    }
    last_trades[period][$(element).attr('rel')] = order.price;
    rebuild_main_table();
  }
}

/* Objects */
function Product(id, name) {
  this.id = id;
  this.name = name;
}

function BidOrder(product, qty, price, code, exceeded_credit_line, no_master_agreement, auto) {
  this.product = product;
  this.qty = qty;
  this.price = price;
  this.code = code;
  this.exceeded_credit_line = typeof exceeded_credit_line !== 'undefined' ? exceeded_credit_line : false;
  this.no_master_agreement = typeof no_master_agreement !== 'undefined' ? no_master_agreement : false;
  this.auto = typeof auto !== 'undefined' ? auto : false;
}

function AskOrder(product, qty, price, code, exceeded_credit_line, no_master_agreement, auto) {
  this.product = product;
  this.qty = qty;
  this.price = price;
  this.code = code;
  this.exceeded_credit_line = typeof exceeded_credit_line !== 'undefined' ? exceeded_credit_line : false;
  this.no_master_agreement = typeof no_master_agreement !== 'undefined' ? no_master_agreement : false;
  this.auto = typeof auto !== 'undefined' ? auto : false;
}

function Transaction(product, qty, price, order, period, time) {
  this.product = product;
  this.qty = qty;
  this.price = price;
  this.order = order;
  this.period = period;
  this.time = time;
}

Transaction.prototype.toString = function() {
  var paid_or_given = this.order instanceof BidOrder ? '- [Paid] ' : '- [Given] ';
  return paid_or_given + this.qty + UNIT + ' ' + this.product.name + ' ' + this.period + ' has traded at ' + this.price.toFixed(2) + ' (' + this.order.code + ')';
}

function generate_random_integer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_random_float(min, max) {
    return Math.random() * (max - min) + min;
}

function generate_random_boolean() {
  return (Math.floor(Math.random() * (1 - 0 + 1)) + 0) === 1 ? true : false;
}

function round_number(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Return true to include current element
 * Return false to exclude current element
 */
$.expr[':']['nth-of-type'] = function(elem, i, match) {
    if (match[3].indexOf("n") === -1) return i + 1 == match[3];
    var parts = match[3].split("+");
    return (i + 1 - (parts[1] || 0)) % parseInt(parts[0], 10) === 0;
};