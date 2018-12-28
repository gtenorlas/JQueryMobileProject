//declare variables to use for index.html
var customerObj = null; //holds json data object from customer.json
var invoiceObj = null; //holds json data object from invoice.json
var productObj = null; //holds json data object from product.json
var map = null; //holds the map
var theme = "b"; //default theme to use
var header = `<header data-role="header" data-position="fixed">
                <h5>SellMore</h5>
                <div data-role="navbar">
                    <ul>
                        <li><a href="#home_page" class="ui-btn ui-btn-icon-top ui-icon-home"></a></li>
                        <li><a href="#customer_page" data-transition="flip" class="ui-btn ui-btn-icon-top ui-icon-user"></a></li>
                        <li><a href="#invoice_page" data-transition="pop" class="ui-btn ui-btn-icon-top ui-btn ui-icon-check"></a></li>
                        <li><a href="#product_page" data-transition="slide" class="ui-btn ui-btn-icon-top ui-icon-info"></a></li>
                        <li><a href="#google_page" data-transition="fade" class="ui-btn ui-btn-icon-top ui-icon-location"></a></li>
                    </ul>
                </div>
            </header>`;
var footer = `<footer data-role="footer" data-position="fixed">
                <h1>SellMore Company Ltd. © 2017</h1>
            </footer>`;

/*
 * Document ready short form.
 * Load all json files - customer, invoice, product
 */
$(function () {

//Load Customer
    $.ajax({
        type: "Get",
        url: "data/customer.json",
        dataType: "json",
        success: loadCustomer
    });


    //Load Invoice
    $.ajax({
        type: "Get",
        url: "data/invoice.json",
        dataType: "json",
        success: loadInvoice
    });


    //Load Product
    $.ajax({
        type: "Get",
        url: "data/product.json",
        dataType: "json",
        success: loadProduct
    });

});

/*
 * Function to read customer.json file
 * and call the function to add marker to the map
 * 
 */
function loadCustomer(data) {
    customerObj = data; //assign json object to customerObj
    customerPage(); //create the page for customer

    for (x = 0; x < customerObj.Customer.length; x++) {
        //each customer will be stored to local storage using its ID 
        localStorage.setItem(customerObj.Customer[x].compId, JSON.stringify(customerObj.Customer[x]));

    }
}

/*
 * 
 * @param {type} data
 * @return {undefined}
 */
function loadInvoice(data) {
    invoiceObj = data; //assign json object to invoiceObj
    invoicePage(); //create the page for invoice

    for (x = 0; x < invoiceObj.Invoice.length; x++) {
        //each customer will be stored to local storage using its ID 
        localStorage.setItem(invoiceObj.Invoice[x].invNum, JSON.stringify(invoiceObj.Invoice[x]));
    }
}

/*
 *Create product page and load data to local storage 
 * @param {type} data
 * @return {undefined}
 */
function loadProduct(data) {
    productObj = data; //assign json object to customerObj
    productPage(); //create the page for customer

    for (x = 0; x < productObj.Product.length; x++) {
        //each product will be stored to local storage using its ID 
        localStorage.setItem(productObj.Product[x].prodId, JSON.stringify(productObj.Product[x]));

    }
}

/*
 * Function to create the page for customer
 * Page is added to the pageContainer of index.html
 * 
 */
function customerPage() {
    var newPage = $("<div data-role='page' id='customer_page' data-theme='" + theme + "'>" + header);
    var bodyPage = '<section class="ui-content" role="main">';
    bodyPage += "<h1>Customers</h1>";
    bodyPage += "<ul data-role='listview' data-filter='true'  data-filter-placeholder='Filter customer..'>";
    for (x = 0; x < customerObj.Customer.length; x++) {
        bodyPage += "<li class='customer_profile' id='" + customerObj.Customer[x].compId + "'>" + //get customerID so it can be retrieved from local storage
                "<a href='#pop_customer' data-rel='popup' data-transition='pop'>" + customerObj.Customer[x].compName + "</a>" + //create link to pop_customer
                "</li>";
    }
    bodyPage += "</ul>";

    //add the pop_customer as popup to the customer page
    bodyPage += '<div data-role="popup" class="ui-content" id="pop_customer" style="max-width:500px">' +
            '</div>';


    bodyPage += '</section>';

    newPage.append(bodyPage + footer);
    newPage.appendTo($.mobile.pageContainer);

    //handle click event for customer profile
    //adjust the popup dialog contents for customer
    $(".customer_profile").click(function () {
        var customerID = $(this).attr("id"); //get customer id
        //alert(customerID);
        //retrieve the data from local storage and convert it into a JSON object
        var getCustomerInfo = JSON.parse(localStorage.getItem(customerID));
        var popupContent = $("#pop_customer");
        popupContent.empty(); //clear contents

        //add new contents below
        popupContent.append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>');
        popupContent.append("Customer name: " + getCustomerInfo.compName + "</br>");
        popupContent.append("Customer address: " + getCustomerInfo.compAddr + "</br>");
        popupContent.append("Customer contact: " + getCustomerInfo.compContact + "</br>");
        popupContent.append("Customer phone: <a href='tel:" + getCustomerInfo.compPhone + "'>" +  getCustomerInfo.compPhone  +  "</a></br>");
        popupContent.append("Customer email: <a href=mailto:" + getCustomerInfo.compEmail + ">" + getCustomerInfo.compEmail + "</a></br></br>");
        popupContent.append(getCustomerInfo.compName + " invoices:<ul>");
        for (x = 0; x < getCustomerInfo.invNum.length; x++) {
            popupContent.append("<li class='customer_profile_invoice' id='" + getCustomerInfo.invNum[x] + "'>" + //get customerID so it can be retrieved from local storage
                    getCustomerInfo.invNum[x] +
                    "</li>");
        }
        popupContent.append("</ul>");

    });

}


function invoicePage() {
    var newPage = $("<div data-role='page' id='invoice_page' data-theme='" + theme + "'>" + header);
    var bodyPage = '<section class="ui-content" role="main">';
    bodyPage += "<h1>Invoices</h1>";
    bodyPage += "<ul data-role='listview'>";
    for (x = 0; x < customerObj.Customer.length; x++) {
        bodyPage += '<li data-role="list-divider">' + customerObj.Customer[x].compName + '</li>';
        for (y = 0; y < customerObj.Customer[x].invNum.length; y++) {
            bodyPage += "<li class='invoice_profile' id='" + customerObj.Customer[x].invNum[y] + "'>" + //get invoiceID so it can be retrieved from local storage
                    "<a href='#panel_invoice'>" + customerObj.Customer[x].invNum[y] + "</a>" + //create link to panel_invoice
                    "</li>";
        }
    }
    bodyPage += "</ul>";

    //add a panel element to load the invoice details
    bodyPage += '<div data-role="panel" id="panel_invoice" data-theme="c" data-display="overlay"></div>';
    bodyPage += '</section>';

    newPage.append(bodyPage + footer);
    newPage.appendTo($.mobile.pageContainer);

    //handle click event for invoice profile
    //adjust the panel contents based off invoiceID
    $(".invoice_profile").click(function () {
        var invoiceID = $(this).attr("id"); //get invoice id
        //alert(customerID);
        //retrieve the data from local storage and convert it into a JSON object
        var getInvoiceInfo = JSON.parse(localStorage.getItem(invoiceID));
        var panelContent = $("#panel_invoice");
        var getCustomerInfo = JSON.parse(localStorage.getItem(getInvoiceInfo.compId)); //get customer info using foreign key from invoice.json
        panelContent.empty(); //clear contents

        //add new contents below
        panelContent.append('<h3 style="text-align:center;">' + getInvoiceInfo.invNum + "<h3>");
        panelContent.append('<p>');
        panelContent.append("Customer: " + getCustomerInfo.compName + "</br>");
        panelContent.append("Date: " + getInvoiceInfo.invDate + "</br>");
        panelContent.append("Amount: $" + getInvoiceInfo.invAmt.toFixed(2) + "</br>");
        panelContent.append('</p>');
        panelContent.append('<hr>');
        for (x = 0; x < getInvoiceInfo.product.length; x++) {
            var getProductInfo = JSON.parse(localStorage.getItem(getInvoiceInfo.product[x].prodId)); //get product info from local storage using the foreign key from invoice.json
            panelContent.append(getProductInfo.prodDesc + ' : ' + getInvoiceInfo.product[x].qty + ' pieces</br>');
        }
        panelContent.append("<hr>");
        panelContent.append('</br></br>');

    });

}

/*
 * create product page
 * @return {undefined}
 */
function productPage() {
    var newPage = $("<div data-role='page' id='product_page' data-theme='" + theme + "'>" + header);
    var bodyPage = '<section class="ui-content" role="main">';
    bodyPage += "<h1>Products</h1>";
    bodyPage += '<div data-role="collapsible-set" data-theme="b" data-content-theme="a">'; //create a collapsible set
    for (x = 0; x < productObj.Product.length; x++) {
        bodyPage += '<div data-role="collapsible">'; //new collapsible item
        bodyPage += '<h2>' + productObj.Product[x].prodDesc + '</h2>'; //title of the collapsible
        bodyPage += '<h5>Product ID: ' + productObj.Product[x].prodId + '</h5>'; //additional details provided once collapsed
        bodyPage += '<h5>Product Price: $' + productObj.Product[x].prodAmt.toFixed(2) + '</h5>'; //additional details provided once collapsed
        bodyPage += '</div>';
    }
    bodyPage += "</div>";

    bodyPage += '</section>';
    newPage.append(bodyPage + footer); //add the footer to the page
    newPage.appendTo($.mobile.pageContainer); //add the page to index.html


}

function initMap() {
    //create new map
    //takes two parameter, first is the element to view it to
    //second, is the options of the map
    map = new google.maps.Map(document.getElementById('map_details'), {
        zoom: 9,
        center: {lat: 44.2590, lng: -80.0000}, //location where to centralized the view 
        mapTypeId: google.maps.MapTypeId.ROADMAP //type of map
    });

}

/*
 * find location based on address, then creates marker and infoWindow to the map
 * @param {type} geocoder
 * @param {type} resultsMap
 * @param {type} customer
 * @return {undefined}
 */
function geocodeAddress(geocoder, resultsMap, customer) {

    geocoder.geocode({'address': JSON.stringify(customer.compAddr)}, function (results, status) {
        if (status === 'OK') { //address is found

            //create a marker. Takes two key parameters
            //1. map: the map where to put a marker
            //2. position: the lat and lng locations
            //animation to animate the marker
            var marker = new google.maps.Marker({
                map: resultsMap,
                animation: google.maps.Animation.DROP,
                position: results[0].geometry.location,
                icon: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/64/Map-Marker-Ball-Pink-icon.png'
            });

            //create a new variable which is an info window
            //info window is useful when user needs additional info
            //on the marker. Takes 1 parameter which is the html content
            var infoWindow = new google.maps.InfoWindow({
                content: "<h3>" + customer.compName + "</h3><h5>" + results[0].formatted_address + "</h5>"
            });

            //add listener with a click event
            //when user clicks on the marker it will show the infoWindow
            marker.addListener('click', function () {
                infoWindow.open(resultsMap, marker);
            });


        } else { //error occured or address not found
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}



/*
 * First time the google_page loads, then this function executes.
 * function sets the marker object onto the map object
 * 
 * call geocodeAddress function to set the marker using the customer object passed
 */

$(document).on('pagecreate', '#google_page', function () {
    
    if (!customerObj) { //undefined, user trying to go to google_page directly
        window.location.href="index.html"; //forward page to index html to reload all scripts..
    }

    var geocoder = new google.maps.Geocoder(); // to be used to retrieve the latitude, longitude
    for (x = 0; x < customerObj.Customer.length; x++) {

        //call the function to add marker to the map using the customerObject
        geocodeAddress(geocoder, map, customerObj.Customer[x]); //function to set a marker on the map using the map and address specified
    }


    //resize map to show on screen, so it displays correctly
    //else it waits for window to resize for the map to show correctly (maybe a bug)
    setTimeout(function () {
        google.maps.event.trigger(map, 'resize');
    }, 500);

});




