// TABLE COLLAPSABLE HEADER
// toggles the table header for each region
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    update_content();
    setInterval(update_content, 15000);
});

//https://d3peks49yotu1a.cloudfront.net/status for production
var STATUS_URL_PREFIX = "http://localhost:63342/cloud-status";

//header for sections
var usheadertr = '<tr class="header">\
    <td class="regionTab" colspan="12">\
      <label for="us"><i class="fa fa-plus"></i> NORTH AMERICA</label>\
      <input type="checkbox" name="us" id="us" data-toggle="toggle" hidden>\
    </td></tr>';
var emeaheadertr = '\
      <tr class="header">\
        <td class="regionTab" colspan="12">\
          <label for="emea"><i class="fa fa-plus"></i> EMEA</label>\
          <input type="checkbox" name="emea" id="emea" data-toggle="toggle" hidden>\
        </td></tr>';
var apacheadertr = '\
      <tr class="header">\
        <td class="regionTab" colspan="12">\
          <label for="apac"><i class="fa fa-plus"></i> APAC</label>\
          <input type="checkbox" name="apac" id="apac" data-toggle="toggle" hidden>\
        </td></tr>';
var southAmerheadertr = '\
      <tr class="header">\
        <td class="regionTab" colspan="12">\
          <label for="southamer"><i class="fa fa-plus"></i> SOUTH AMERICA</label>\
          <input type="checkbox" name="southamer" id="southamer" data-toggle="toggle" hidden>\
        </td></tr>';

/**
 * The JSON properties
 * @type {string[]}
 */
var DATA_PROPERTIES = ['region', 'onboard', 'configure',
    'manage', 'ML', 'A3', 'xiot', 'airDefence', 'eguest', 'elocation', 'ppsk'];

/**
 * TODO
 * Define the orders of each region blocks
 * @type {string[]}
 */
var REGION_ORDERS = ['US', 'EMEA', 'APAC', 'SOUTH AMERICA'];
/**
 * Define the cloud type orders
 * @type {string[]}
 */
var CLOUD_TYPE_ORDERS = ["public", "private", "edge"];

/**
 * Convert input JSON data to
 * {
 *     "public": {"US": [], "EMEA": [], "APAC": []},
 *     "private": {"US": [], "EMEA": [], "APAC": []},
 *     "edge": {"EMEA": []}
 * }
 * @param data
 */
function convertDataForCloudType(data) {
    let _map = convertDataToHash(data, "cloudtype", CLOUD_TYPE_ORDERS);
    let _result = {};
    Object.keys(_map).forEach(function (key) {
        let _arr = _map[key];
        _result[key] = convertDataToHash(_arr, "regionheader", REGION_ORDERS);
    });
    return _result;
    // let _sorted = {};
    // //Sort by cloud type orders
    // for (let i = 0;i < CLOUD_TYPE_ORDERS.length;i++){
    //     let _key = CLOUD_TYPE_ORDERS[i];
    //     _sorted[_key] = _result[_key]
    // }
    // return _sorted;
}

/**
 * Convert the json to data hash
 * {"US": [], "EMEA": [], "APAC": [], "SOUTH AMERICA": []}
 *
 * @param data
 * @returns {{}}
 */
function convertDataToHash(data, key, orders) {
    let _map = {};
    for (let i = 0; i < data.length; i++) {
        let _key = data[i][key];
        let _value = data[i];
        if (_key in _map) {
            _map[_key].push(_value);
        } else {
            _map[_key] = [_value];
        }
    }
    let _sorted = {};
    for (let i = 0; i < orders.length; i++) {
        let _key = orders[i];
        _sorted[_key] = _map[_key]
    }
    return _sorted;
}

/**
 * Convert region key to header TR
 * @param key
 * @returns {string}
 */
function convertKeyToHeaderTr(key) {
    switch (key) {
        case "APAC":
            return apacheadertr;
        case "EMEA":
            return emeaheadertr;
        case "SOUTH AMERICA":
            return southAmerheadertr;
        case "US":
        default:
            return usheadertr;
    }
}


/**
 * build region blocks
 * @param tbody
 * @param key
 * @param value
 */
function buildRegionBlocks(tbody, key, value) {
    if(!value){
        return;
    }
    let _headerTr = convertKeyToHeaderTr(key);
    //create region block header
    tbody.append($(_headerTr));
    // create rows of each region block
    buildBlockRows(tbody, value);

}

/**
 * Build rows for each region block
 * @param tbody
 * @param data
 */
function buildBlockRows(tbody, data) {
    if(!data){
        return;
    }
    for (let i = 0; i < data.length; i++) {
        let dataset1 = data[i];
        let row = document.createElement('tr'); // create row
        //properties for each row
        for (var j = 0; j < DATA_PROPERTIES.length; j++) // append each column
        {
            var cell = document.createElement('td'); //create a td for every cell
            if (dataset1[DATA_PROPERTIES[j]] === "0") {
                cell.innerHTML = "";
            } else if (dataset1[DATA_PROPERTIES[j]] === "1") {
                cell.innerHTML = "<img class='icons' id='availIcon' src='" + STATUS_URL_PREFIX + "/images/statusAVAILABLE.svg'>";

            } else if (dataset1[DATA_PROPERTIES[j]] === "2") {
                cell.innerHTML = "<img class='icons' id='mainIcon' src='" + STATUS_URL_PREFIX + "/status/images/statusMAINTENANCE.svg'>";
            } else if (dataset1[DATA_PROPERTIES[j]] === "3") {
                cell.innerHTML = "<img class='icons' id='degradIcon' src='" + STATUS_URL_PREFIX + "/images/statusDEGRADEDv02.svg'>";
            } else if (dataset1[DATA_PROPERTIES[j]] === "4") {
                cell.innerHTML = "<img class='icons' id='disruptIcon' src='" + STATUS_URL_PREFIX + "/images/statusDISRUPTION.svg'>";
            } else {
                cell.innerHTML = dataset1[DATA_PROPERTIES[j]];
            }
            row.appendChild(cell); //append value to cell in that row
        }
        tbody.append($(row));
    }
}


function update_content() {
    $.ajax({
        dataType: "json",
        url: STATUS_URL_PREFIX + '/cloud-health-status.json',
        async: false,
        cache: false,
        success: function (data) {
            setTimeout(function () {
                let tmp = convertDataForCloudType(data);
                console.log('tmp', tmp);
                $.each(tmp, function (key, dataMap) {
                    let table = $("#" + key + "_tab_table");
                    let tableBody = table.children("tbody");
                    if (tableBody.length > 0) {
                        tableBody.empty();
                    } else {
                        table.append("<tbody></tbody>");
                    }
                    $.each(dataMap, function (key, value) {
                        buildRegionBlocks(tableBody, key, value);
                    });
                });

                $('tr.header').click(function () {
                    $(this).nextUntil('tr.header').slideToggle('fast');
                });
            }, 1000);
        }
    });
}
