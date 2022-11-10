var index =1;
var money = 0.00;
var currentItem;
var currentItemIndex;
let items = [];
var change;

$(document).ready(function() 
{
    getItems();
})

function getItems()
{
    $.get("https://cors-everywhere.herokuapp.com/http://vending.us-east-1.elasticbeanstalk.com/items", function(data,status)
    {
         $("#itemsContainer").empty();
         index=1;
        data.forEach(element => 
        {
           
  
            $("#itemsContainer").append("<div class ='col-sm-4 item' id='item'><div class='card shadow-sm mb-3 mt-3'><div class='card-body'><h6 class='card-title text-center text-nowrap' id="+index+" style='overflow: hidden;'> "+ index + ". " +element.name + "</h6><p class='card-text text-center'><br> $"+element.price+ "<br><br> Quantity Left: "+ element.quantity +"</p></div></div></div>");
            let item = {
                "id":element.id,
                "name": element.name,
                "price": element.price,
                "quantity": element.quantity,
                "index": index
            }
            items.push(item);
            index++;

        });
       console.log(items);
    });
}


function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function addDollar()
{
    money= money +1.00;
   
    money = roundToTwo(money);

    console.log(money);
}

function addQuarter()
{
    money =money + 0.25;
    
    money = roundToTwo(money);

    console.log(money);
}

function addDime()
{
    money= money+ 0.10;

    money = roundToTwo(money);
    console.log(money);
}

function addNickel()
{
    money = money+ 0.05;

    money = roundToTwo(money);
    console.log(money);
}

$(document).on('click','.item',function() 
{
   $("#itemInput").attr('value', $(this).children('div').children('div').children('h6')[0].innerText);

    currentItem = $(this).children('div').children('div').children('h6')[0].innerText;
    currentItemIndex =  $(this).children('div').children('div').children('h6').attr("id");
    $("#messageOutput").attr('value',"");
    $("#changeDisplay").attr('value',"");
    
})


$(document).on('click', '#dollar',function(){
    addDollar();
    $('#moneyinform').attr('value', money.toFixed(2));
})

$(document).on('click', '#quarter',function(){
    addQuarter();
    $('#moneyinform').attr('value', money.toFixed(2));
})

$(document).on('click', '#dime',function(){
    addDime();
    $('#moneyinform').attr('value',money.toFixed(2));
})

$(document).on('click', '#nickel',function(){
    addNickel();
    $('#moneyinform').attr('value',money.toFixed(2));
})


$(document).on('click',"#makePurchase",function(){

    if( $("#itemInput").attr('value') == undefined )
    {
        $("#messageOutput").attr('value',"No Item Selected!");
        return;
    }
    console.log($("#itemInput").attr('value'));

    if($("#moneyinform").attr('value') ==undefined)
        $("#moneyinform").attr('value',0);

    var item = items.filter(item => item.index == currentItemIndex);

    console.log("the value in id is:"+ item[0].id);
    $.ajax({
        url:"http://vending.us-east-1.elasticbeanstalk.com/money/" + $("#moneyinform").attr('value')+ "/item/"+item[0].id,
        type:"POST",
        async: true,
        success: function(output)
        {
            console.log("Request submitted successfully!");
            console.log(output);
            getItems();
            change = output;
            $("#messageOutput").attr('value',"Thank You!!");
            $("#changeDisplay").attr('value',change.quarters + " Quarters, " + change.dimes + " Dimes, " + change.nickels + " Nickles, " + change.pennies + " Pennies" );
            $("#moneyinform").attr('value',"0.00");
        },
        error: function(output)
        {
            console.log(output.responseJSON.message);
            $("#messageOutput").attr('value',output.responseJSON.message);
            getItems();
        }
    })
    



});

$(document).on('click',"#changeReturn", function(){
    var change = {
        "quarters":0,
        "dimes":0,
        "nickels":0,
        "pennies":0
    }
    var inserted = $("#moneyinform").attr('value');
    console.log(inserted);

    change.quarters = Math.floor(inserted/0.25);

    inserted = inserted - (0.25 * change.quarters);

    change.dimes = Math.floor(inserted/0.10);

    inserted = inserted - (0.10 * change.dimes);

    change.nickels = roundToTwo(inserted/0.05);

    console.log(change.quarters + " Quarters, " + change.dimes + " Dimes, " + change.nickels + " Nickles" );

    $("#changeDisplay").attr('value',change.quarters + " Quarters, " + change.dimes + " Dimes, " + change.nickels + " Nickles"); 
    $("#moneyinform").attr('value',"0.00");
    money =0;
});