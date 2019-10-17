// JavaScript Document

function divDisplay(item) { 
        item.style.backgroundColor = "#acb305";  
        divHide();           
        $("#" + item.id)
        .next("div.content") 
        .slideDown( );
        $("#" + item.id)
        .next("div.iframe") 
        .slideDown( );              
    }

function divHide() { 
    $( ".hidden" ).slideUp();       
    }
  