// TABLE COLLAPSABLE HEADER
// toggles the table header for each region
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
  update_content();
  setInterval(update_content, 10000);


});

//header for sections
var usheadertr = '<tr class="header">\
    <td class="regionTab" colspan="12">\
      <label for="us"><i class="fa fa-plus"></i> NORTH AMERICA</label>\
      <input type="checkbox" name="us" id="us" data-toggle="toggle" hidden>\
    </td>';
var emeaheadertr = '</tr>\
      <tr class="header">\
        <td class="regionTab" colspan="12">\
          <label for="emea"><i class="fa fa-plus"></i> EMEA</label>\
          <input type="checkbox" name="emea" id="emea" data-toggle="toggle" hidden>\
        </td>';
var apacheadertr = '</tr>\
      <tr class="header">\
        <td class="regionTab" colspan="12">\
          <label for="apac"><i class="fa fa-plus"></i> APAC</label>\
          <input type="checkbox" name="apac" id="apac" data-toggle="toggle" hidden>\
        </td>';
var southAmerheadertr = '</tr>\
      <tr class="header">\
        <td class="regionTab" colspan="12">\
          <label for="southamer"><i class="fa fa-plus"></i> SOUTH AMERICA</label>\
          <input type="checkbox" name="southamer" id="southamer" data-toggle="toggle" hidden>\
        </td>';




function update_content() {
  $.ajax({
    dataType: "json",
    url: 'https://d3peks49yotu1a.cloudfront.net/status/cloud-health-status.json',
    async: false,
    cache: false,
    success: function (data) {
      var table = document.getElementById('secondTable'); //grab table

      var tableBody = document.createElement('tbody');
      for (var i = 0; i < data.length; i++) {
        var dataset1 = data[i];
        var row = document.createElement('tr'); // create row
        var properties = ['region', 'onboard', 'configure',
          'manage', 'ML', 'A3', 'xiot', 'airDefence', 'eguest', 'elocation', 'ppsk']; //properties for each row
        for (var j = 0; j < properties.length; j++) // append each column
        {
          var cell = document.createElement('td'); //create a td for every cell
          if (dataset1[properties[j]] === "0") {
            cell.innerHTML = "";
          }
          else if (dataset1[properties[j]] === "1") {
            cell.innerHTML = "<img class='icons' id='availIcon' src='https://cloud-status.extremecloudiq.com/status/images/statusAVAILABLE.svg'>";

          }
          else if (dataset1[properties[j]] === "2") {
            cell.innerHTML = "<img class='icons' id='mainIcon' src='https://cloud-status.extremecloudiq.com/status/images/statusMAINTENANCE.svg'>";
          }
          else if (dataset1[properties[j]] === "3") {
            cell.innerHTML = "<img class='icons' id='degradIcon' src='https://cloud-status.extremecloudiq.com/status/images/statusDEGRADEDv02.svg'>";
          }
          else if (dataset1[properties[j]] === "4") {
            cell.innerHTML = "<img class='icons' id='disruptIcon' src='https://cloud-status.extremecloudiq.com/status/images/statusDISRUPTION.svg'>";
          }
          else {
            cell.innerHTML = dataset1[properties[j]];
          }
          row.appendChild(cell); //append value to cell in that row
        }
        if (table.childElementCount != 1) {
          table.children[1].remove();
        }
        tableBody.appendChild(row);
        table.appendChild(tableBody); //add row
      }
      $('#secondTable').prepend(usheadertr);
      $('#secondTable tr:nth-child(9)').after(emeaheadertr);
      $('#secondTable tr:nth-child(17)').after(apacheadertr);
      $('#secondTable tr:nth-child(22)').after(southAmerheadertr);
      $('.header').click(function () {
        $(this).nextUntil('tr.header').slideToggle(100);
      });
    }
  });
}
