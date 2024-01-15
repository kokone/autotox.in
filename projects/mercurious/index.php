<!doctype html>
<html>
  <head>
    <title>Mercurious Trading Simulation</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/global.css">
    <script type='text/javascript'>var current_date = '<?php echo date('D d/m/y'); ?>';</script>
    <script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js'></script>
    <script type='text/javascript' src='js/bootstrap/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/masked.js'></script>
    <script type='text/javascript' src='js/simulation.js'></script>
    <script type='text/javascript' src='js/data.js'></script>
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="span4">
          <table id="table-top-left" class="table-interact table table-bordered table-condensed">
            <tr class="orange"><th id="top-left-title" colspan="6"></th></tr>
          </table>
        </div>
        <div class="span8">
          <table id="activity-ticker" class="table table-bordered table-condensed">
            <tr class="orange"><th colspan="2">Activity Ticker</th></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
            <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="span12">
          <table id="table-main" class="table table-bordered table-condensed"></table>
        </div>
      </div>
      <div id="order_ticket" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="order_ticket_label" aria-hidden="true">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3 id="order_ticket_label">Order ticket</h3>
        </div>
        <div class="modal-body">
          <div class="block"><p>GlobalVision</p></div>
          <div class="block">
            <table>
              <tr><td colspan="2"><p style="display:none;" class="bid_warning alert alert-block alert-error fade in">You need to enter a valid number</p></td></tr>
              <tr><td>Bid<br><small>(Decimal number seperated by a period)</small></td><td class="bid_price"><input type="text"></td></tr>
              <tr><td colspan="2"><p style="display:none;" class="ask_warning alert alert-block alert-error fade in">You need to enter a valid number</p></td></tr>
              <tr><td>Ask<br><small>(Decimal number seperated by a period)</small></td><td class="ask_price"><input type="text"></td></tr>
              <tr><td colspan="2"><p style="display:none;" class="qty_warning alert alert-block alert-error fade in">You need to enter a valid number</p></td></tr>
              <tr><td>Qty<br><small>(Natural number, max 100)</small></td><td class="qty"><input type="text"></td></tr>
            </table>
          </div>
          <div class="block">
            <table>
              <tr><td>Price status</td><td class="price_status"><select><option>Firm</option></select></td></tr>
              <tr><td>Order type</td><td class="order_type"><select><option>All or none</option></select></td></tr>
              <tr><td>Expiry Type</td><td class="expiry_type"><select><option>GTC</option></select></td></tr>
              <tr><td>Expiry<br><small>(For example: 00:10:00)</small></td><td class="expiry"><input type="text" value="00:10:00"></td></tr>
            </table>
          </div>
          <div class="block">
            <table>
              <tr><td>Trading Account</td><td class="trading_account"><select><option>None</option></select></td></tr>
            </table>
          </div>
          <div class="block">
            <table>
              <tr><td>Select broker</td><td class="broker">
                <select>
                  <option>AUTO</option>
                  <option selected>ICB</option>
                  <option>WEX</option>
                  <option>TFS</option>
                  <option>TPB</option>
                  <option>GFI</option>
                </select>
              </td></tr>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary">Add</button>
          <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
        </div>
      </div>
      <div id="warning_popup" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="warning_label" aria-hidden="true">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3 id="warning_label">Can't place order</h3>
        </div>
        <div class="modal-body">
          <div class="block"><p class="warning_text">Exceeded credit line.</p></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">OK</button>
        </div>
      </div>
    </div>
  </body>
</html>