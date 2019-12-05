const wooCommerceRestAPI = require('@woocommerce/woocommerce-rest-api').default;
const fs = require('fs');
const rx = require('rxjs');
const operators = require('rxjs/operators');
const consumer_credentials = require('./credentials');
const orderArray = []

// function fetchOrderList1(iterations){
//     for(var i=1; i<=iterations;i++){
//         console.log('fetching-->',i);
//         const orderList = authGet.get('orders', {
//             page: i,
//             per_page: 5,
//             after: '2019-10-01T00:00:00Z',
//             before: '2019-10-06T00:00:00Z',
//         })
//             .then(result => orderArray[i] = result.data).then(display => console.log(orderArray))
//             .catch(err => console.log(err));
//     }
// }

// async function fetchOrderList(){
//     const iteration = [1,2,3,4,5,6];
//     try {
//         for await (let i of iteration){ //lar ele of array
//             console.log('fetching->', i);
//             const data = await authGet.get('orders', {
//                 page: i,
//                 per_page: 20,
//                 after: '2019-10-01T00:00:00Z',
//                 before: '2019-10-06T00:00:00Z',
//                 // search: 'Singh', // searching by a persons name
//                 // orderby: 'date', 
//                 // order: 'asc',
//             });
//             console.log(data.status)
//             if(data.status === 200) {
//                 data.data.forEach(ele => orderArray.push(ele));
//                 if(data.data.length < 20){
//                     break;
//                 }
//             }
//             console.log('fetched Orders ->', orderArray.length);
//         }
//     } catch (e) {
//         console.log(e)
//     }
//     fs.writeFile('data.json',JSON.stringify(orderArray), (res, err) => {
//         if(err) {
//             console.log(err);
//         };

//         console.log('Done Writing');
//     });
//     console.log('*******************Done****************');
//     //console.log(orderArray);
//     return orderArray;
// }

// async function fetchOrderListWithWhileLoop(){
//     var orderArray = [];
//     var counter = 1;
//     var data_length = 0;
//     const per_page_limit = 20;
//     try{        
//         do{
//             const data = await authGet.get('orders',{
//                 page: counter,
//                 per_page: per_page_limit,
//                 after: '2019-11-01T00:00:00Z',
//                 before: '2019-11-05T00:00:00Z',
//             });
//             console.log(data.status);
//             if (data.status == 200){
//                  data.data.forEach(order => orderArray.push(order));
//                 //orderArray.concat(data.data);
//                 console.log("Successfully fetched orders:", data.data.length);
//                 data_length = data.data.length;
//                 counter++;
//             }else{
//                 console.log("error code:", data.status);
//                 break;
//             }
//         }while(data_length === per_page_limit);
//         console.log('total orders Fetched: ', orderArray.length);
//     }catch(e){
//         console.log(e);
//     }
//     // console.log("The order list :----------------------->", orderArray);
//     return orderArray;
// }

function validateClient(client_credentials){
    wooCommerceToken = {
        url: 'https://artwalaz.com',
        consumerKey: client_credentials.consumer_key,
        consumerSecret: client_credentials.consumer_secret,
        wpAPI: true,
        version: 'wc/v3'
    }
    console.log("Created the credential token!!");
    return wooCommerceToken;
}

async function fetchOrderListWithParameters(client_credentials, start_date, end_date){
    // Creating the authGet() from the credentials received
    const wooCommerceCredentials = validateClient(client_credentials);
    const authGet = new wooCommerceRestAPI(wooCommerceCredentials);
    var orderArray = [];
    var counter = 1;
    var data_length = 0;
    const per_page_limit = 20;
    try{        
        do{
            const data = await authGet.get('orders',{
                page: counter,
                per_page: per_page_limit,                
                after: start_date,
                before: end_date,
            });
            /*  const interval_buffer = rx.interval(20000);
                const wooCommerce_robot = ___.pipe({
                operators.buffer(interval_buffer);
            });
            */
            console.log(data.status);
            if (data.status == 200){
                 data.data.forEach(order => orderArray.push(order));
                //orderArray.concat(data.data);
                console.log("Successfully fetched orders:", data.data.length);
                data_length = data.data.length;
                counter++;
            }else{
                console.log("error code:", data.status);
                break;
            }
        }while(data_length === per_page_limit);
        console.log('total orders Fetched: ', orderArray.length);
    }catch(e){
        console.log(e);
    }
    // console.log("The order list :----------------------->", orderArray);
    return orderArray;
}

function writeOrderListToFile(orderArray){
    return new Promise((resolve, reject) => {
        fs.writeFile('data.json', JSON.stringify(orderArray), (res, err) =>{
            if(err){
                reject("Error while writing to a file:", err);
            }
            console.log("Done writing");
            resolve();
        })
    })
}

function transformOrderList(orderlist) {
    const transformed = [];
    orderlist.forEach(order => {
        order.line_items.forEach(item => {
            const localtrnsfrm = {                                
                 order_status             : order.status,          
                 //gst                    : 'temp',                      
                 //batch_id                 : 'temp',                 
                 //invoice_date             : 'temp',             
                 //invoice_no               : order.order_key,               
                 //item_status              : 'temp',              
                 //forward_courier_name     : 'temp',    
                 //forward_awb              : 'temp',            
                 //reverse_awb              : 'temp',            
                 //returned_date            : 'temp',           
                 marketplace              : 'WOOCOMMERCE',              
                 //shipment_state           : 'temp',          
                 //product_sku              : 'temp',            
                 order_id                 : order.id,              
                 order_item_id            : line_items.id,           
                 purchase_date            : order.date_created,           
                 payments_date            : order.date_paid,  
                 buyer_name               : order.billing.first_name,
                 buyer_email              : order.billing.email,
                 buyer_phone_number       : order.billing.phone,
                 sku                      : item.sku,
                 product_name             : items.name,
                 quantity_purchased       : items.quantity,
                 currency                 : order.currency,
                 item_price               : items.subtotal,
                 item_tax                 : items.subtotal_tax,
                 shipping_price           : order.shipping_price,
                 shipping_tax             : order.shipping_tax,
                 ship_service_level       : 'temp',
                 recipient_name           : order.shipping,first_name,
                 billing_address1         : order.billing.address_1,
                 billing_address2         : order.billing.address_2,
                 billing_address3         : 'temp',
                 billing_city             : order.billing.city,
                 billing_state            : order.billing.state,
                 billing_postal_code      : order.billing.postcode,
                 billing_country          : order.billing.country,
                 billing_phone_number     : order.billing.phone,
                 //shipment_start_location  : 'temp',
                 //shipment_end_location    : 'temp',
                 ship_address1            : order.shipping.address_1,
                 ship_address2            : order.shipping.address_2,
                 //ship_address3            : 'temp',
                 ship_city                : order.shipping.city,
                 ship_state               : order.shipping.state,
                 ship_postal_code         : order.shipping.postcode,  
                 ship_country             : order.shipping.country,           
                 ship_phone_number        : '', // TBT
                 item_promotion_discount  : order.coupon_lines,
                 item_promotion_id        : 'temp',
                 ship_promotion_discount  : 'temp',
                 ship_promotion_id        : 'temp',
                 delivery_start_date      : 'temp',
                 delivery_end_date        : 'temp',
                 delivery_time_zone       : 'temp',
                 delivery_instructions    : 'temp',
                 sales_channel            : 'temp',
                 payment_method           : order.payment_method,           
                 cod_collectible_amount   : order.total,  
                 already_paid             : 'temp',
                 payment_method_fee       : '',
                 is_business_order        : 'temp',        
                 purchase_order_number    : 'temp',
                 price_designation        : 'temp',
                 fulfilled_by             : 'MERCHANT',
                 documents                : 'temp',
                 customer_gst             : 'temp',
                 marketplace_invoice_no   : 'temp',
                 marketplace_invoice_date : 'temp',
                 is_combo                 : 'temp',
                 is_invoiced              : 'temp',
                 warehouse_id             : 'temp',
                 product_id               : 'temp',
                 extras                   : 'temp'
            }
            transformed.push(localtrnsfrm);
        })
    })
    return transformed;
}

// async function gettingOrdersAndWritingToFile(){
//     var orderArray = await fetchOrderListWithWhileLoop();
//     await writeOrderListToFile(orderArray);
//     console.log("End of method gettinOrdersAndWritingToFile");
// }

// transformedList = transformOrderList(fetchOrderList());

async function gettingOrdersAndWritingToFileWithParameters(client_credentials, start_date, end_date){
    var orderArray = await fetchOrderListWithParameters(client_credentials, start_date, end_date);
    await writeOrderListToFile(orderArray);
    console.log("End of method File with Parameters");
}

gettingOrdersAndWritingToFileWithParameters(
    {consumer_key: consumer_credentials.consumer_key, 
    consumer_secret:consumer_credentials.consumer_secret}, 
    '2019-11-01T00:00:00Z', '2019-11-05T00:00:00Z'
);