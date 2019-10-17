// ------------------------
// Set global variables
// ------------------------         
      var colourMaskSet = 'notset';
      var threshMask = 'notset';
      var threshold;
      var R;  //for colour mask
      var G;  //for colour mask
      var B;  //for colour mask
      var setR = 60; //for colour colourise
      var setG = 40; //for colour colourise
      var setB;       //for colour colourise    
      var myImageData; 
      var newImageData;  
      var pixelComponents;
      var idx; 
      var convolutionWidth;
      var convolutionHeight;
      var convolutionMask;
      var factor; 
      var bias ;
      var convolutionKernel_OutputArraySize;
      var convolutionKernel_Output;
     var switchImg = 0;
                  
// ------------------------
// Display options
// ------------------------

function divDisplay() {
  var selection = document.getElementById("effect").value;    
      if(selection == "sepia") 
        {colourSel.style.display = "block";}
     else  
        {colourSel.style.display = "none";} 
            
     if(selection == "boxBlur"
        || selection == "gausian"
        || selection == "motionBlur"
        ||selection == "sobel"
        || selection == "robertsCross"
        || selection == "sharpen"
        || selection == "emboss"
        || selection == "emboss45"
        || selection == "canny"
         ) 
           {biasSel.style.display = "block";}
        else  
           { biasSel.style.display = "none";} 
                                    
      if(selection == "sobel"
         || selection == "thresholdEffect"
         || selection == "robertsCross"
         || selection == "sharpen"
         || selection == "canny"   
         || selection == "merge"                 
         ) 
           { thresholdSel.style.display = "block";}
       else  
           {thresholdSel.style.display = "none";}  
}

function resetOptions(){   
        R = 0;
        G = 0;
        B = 0;
        setR = 0; 
        setG = 0; 
        setB = 0; 
        document.getElementById("thresh").value = 0; 
        document.getElementById("bias").value = 0; 
        document.getElementById("colorMask").value = "#000000";
        document.getElementById("setColour").value = "#000000";
        document.getElementById("maskThresh").value = 127.5;
        document.getElementById("colThresh").value = 75;        
}

// ------------------------
// Upload images  form default or file
// ------------------------          
var mySrcImg = new Image();
mySrcImg.src = "demo.jpg";   
// mySrcImg.src = "example42.bmp";     

mySrcImg.addEventListener('load', function () {loadImg();}, false);

function addLoadEventToFileSelect() {
 document.getElementById("files").addEventListener('change',loadFile,false);
}
 
function loadFile(evt){
        var files = evt.target.files;
        var fileSelected = files[0];

for(var i = 0; i< files.length; i++)
{
          if(!files[i].type.match('image.*'))
            {return;}
      var reader = new FileReader();
         reader.onload =(function(theFile){
         return function (e) {
          document.getElementById("outputImage").innerHTML +=
          "<img src =\"" + e.target.result + "\" alt=\"Image from file\" id=\"imgOutput\" width =\"50%\" //><input type=\"button\" id=\"clickMe\" Value=\"Process Image\" onClick=\"srcImg()\"/>";
         };
        })(files[i]);
        reader.readAsDataURL(files[i]);
}
}

function srcImg() {
        var tmpImg = document.getElementById("imgOutput");
        mySrcImg.src = tmpImg.src;
        loadImg()
}

function loadImg() {
          var canvas=document.getElementById("canvas");
          var context=canvas.getContext("2d");  
          if (!context|| !context.getImageData ||!context.putImageData||!context.drawImage){
            rerurn;
          }
          canvas.width = mySrcImg.width;
          canvas.height = mySrcImg.height;        
          context.drawImage(mySrcImg,0,0);
          
             myImageData;
            try {
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                } catch (e){
                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                }
          context.putImageData(myImageData, 0,0);
          var result = document.getElementById("resultimg");
          result.src = canvas.toDataURL(); 
        }
        

// ------------------------
// Masking functions
// ------------------------  
function  setThreshMask(set) { threshMask = set;
            if(set == "setOver"||set == "setUnder") 
                 { setThreshMaskDiv.style.display = "block";}
             else  
                 {setThreshMaskDiv.style.display = "none";} 
          }   
function  setColourMask(set) {
            colourMaskSet = set;
            if(set == "set") 
                 { setColourMaskDiv.style.display = "block";}
             else  
                 {setColourMaskDiv.style.display = "none";} 
          }              

// convert the hex values in to rgb when selected from picker and set as mask.
function  setColourForMask() { 
          var colour = document.getElementById("colorMask").value;
          function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
          function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
          function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
          function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h} 
          R = hexToR(colour);
          G = hexToG(colour);
          B = hexToB(colour);
          }
          
function  colourMask(pixelComponents, i){
             var colVary = document.getElementById("colThresh").value;  
              if((R-colVary < pixelComponents [i] && pixelComponents [i] < R+colVary)  &&
                  (G-colVary < pixelComponents [i+1] && pixelComponents [i+1] < G+colVary) &&
                  (B-colVary < pixelComponents [i+2] && pixelComponents [i+2] < B+colVary)) 
                  {
                  if (document.getElementById("invertColourMask").checked) 
                    {return false }else{return true}
                  }else{
                  if (document.getElementById("invertColourMask").checked) 
                    {return true }else{return false}
                  }   
              }  

// ------------------------
// Set options
// ------------------------                        
function  setColourOption() {      
          var colour = document.getElementById("setColour").value;
          function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
          function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
          function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
          function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h} 
          setR = hexToR(colour);
          setG = hexToG(colour);
          setB = hexToB(colour);
          }                                              
// ------------------------
// Main Image Processing 
// ------------------------   
function  change(){
      alert ("Start pixel processing.");  
          var canvas=document.getElementById("canvas");
          var context=canvas.getContext("2d");  
          var process = document.getElementById("effect").value;
            try {
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                newImageData = context.getImageData(0, 0,canvas.width, canvas.height); 
                } catch (e){
                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height); 
                newImageData = context.createImageData(0, 0, canvas.width, canvas.height);
                }
          pixelComponents = newImageData.data;
// loop through rows and columns        
         for (var x = 0; x < canvas.width; x++) {
          for (var y = 0; y < canvas.height; y++) {
// align row column coordinates with one dimsional array                    
           idx = (x + y * canvas.width)*4;
           
// apply selected mask              
            var masked = false;   
             if(colourMaskSet == 'set')    
             { masked = colourMask(pixelComponents,idx);}
             if(threshMask == 'setOver')    
             {if ((pixelComponents[idx] + pixelComponents[idx+1] + pixelComponents[idx+2]) /3 > 0+Number(document.getElementById("maskThresh").value))
             {masked = true;}}
             if(threshMask == 'setUnder')    
             {if ((pixelComponents[idx] + pixelComponents[idx+1] + pixelComponents[idx+2]) /3 < 0+Number(document.getElementById("maskThresh").value))
             {masked = true;} }

              if(!masked) 
                      {                     
                      if(process == 'greyscale')    {grayscale();} 
                      if(process == 'grayscaleProminent')    {grayscaleProminent();} 
                      if(process == 'grayscaleLuminosity')    {grayscaleLuminosity();}   
                      if(process == 'thresholdEffect')    {thresholdEffect();}                       
                      if(process == 'sepia')        {sepia();} 
                      if(process == 'invert')       {invert();}    
                      if(process == 'emboss')       {emboss(x,y);}  
                      if(process == 'emboss45')     {emboss45(x,y);}   
                      if(process == 'sharpen')      {sharpen(x,y);}  
                      if(process == 'boxBlur')      {boxBlur(x,y)} 
                      if(process == 'motionBlur')   {motionBlur(x,y); }                                                    
                      if(process == 'gausian')   {gausian(x,y); } 
                      if(process == 'sobel')        {sobel(x,y);} 
                      if(process == 'robertsCross') {robertsCross(x,y); }
                      if(process == 'nonMaximumSuppression') {nonMaximumSuppression(x,y); }   
                      if(process == 'nonMaximumSuppressionHorizontal') {nonMaximumSuppressionHorizontal(x,y); } 
                      if(process == 'outline') {outline(x,y); }
                      if(process == 'canny') {gausian(x,y); robertsCross(x,y); nonMaximumSuppression(x,y);}      
                      if(process == 'merge') {merge(x,y);}               
                    }         
       }
      }   
      alert ("Finished pixel processing."); 
 //         context.putImageData(myImageData, 0,0);
          context.putImageData(newImageData, 0,0);
   
                    var result = document.getElementById("resultimg");
          result.src = canvas.toDataURL();           
 }




// ------------------------
// Simple Pixel Processing 
// -----------------------
     
function  grayscale(){
          var avg = (pixelComponents[idx] + pixelComponents[idx+1] +pixelComponents[idx+2])/3;
          pixelComponents[idx ] = avg; 
          pixelComponents[idx+1] = avg; 
          pixelComponents[idx+2] = avg;   
      }
      
function  grayscaleLuminosity(){
          var avg = (0.3*pixelComponents [idx]) + (0.59*pixelComponents [idx+1]) + (0.11*pixelComponents [idx+2]);
          pixelComponents[idx ] = avg; 
          pixelComponents[idx+1] = avg; 
          pixelComponents[idx+2] = avg;   
      }  
                                    
function  grayscaleProminent(){
          var avg =  (Math.max(pixelComponents [idx], pixelComponents [idx+1], pixelComponents [idx+2]) + Math.min(pixelComponents [idx], pixelComponents [idx+1], pixelComponents [idx+2])) / 2;
          pixelComponents[idx ] = avg; 
          pixelComponents[idx+1] = avg; 
          pixelComponents[idx+2] = avg;   
      }        
          
function  thresholdEffect(){
          if ((pixelComponents[idx] + pixelComponents[idx+1] + pixelComponents[idx+2]) /3 > 127.5+Number(document.getElementById("thresh").value))
          {   
            pixelComponents[idx ] = 0; 
            pixelComponents[idx+1] = 0; 
            pixelComponents[idx+2] = 0; 
          }  else {   
            pixelComponents[idx ] = 255; 
            pixelComponents[idx+1] = 255; 
            pixelComponents[idx+2] = 255; 
          } 
      }
 
function  sepia(){

          pixelComponents[idx ] = pixelComponents[idx ]+setR/2; 
          pixelComponents[idx+1] = pixelComponents[idx+1]+setG/2; 
          pixelComponents[idx+2] = pixelComponents[idx+2]+setB/2;      
      }

function  invert(){
          pixelComponents[idx ] = 255-pixelComponents[idx ]; 
          pixelComponents[idx+1] = 255-pixelComponents[idx+1]; 
          pixelComponents[idx+2] = 255-pixelComponents[idx+2]; 
      }
          
// ------------------------
// Convolution Processing
// ------------------------
                             
function  boxBlur(x,y){
       // The convolution width and height.
      convolutionWidth = 3;
      convolutionHeight = 3;
      
      factor = 1.0; 
      bias = 0 + Number(document.getElementById("bias").value);
      
      // The Convolution mask.
      convolutionMask = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask[i]=new Array(convolutionWidth);
      }
      convolutionMask[0][0] = 0.1111111111;	convolutionMask[1][0] = 0.1111111111; 	convolutionMask[2][0] = 0.1111111111;
      convolutionMask[0][1] = 0.1111111111; 	convolutionMask[1][1] = 0.1111111111; 	convolutionMask[2][1] = 0.1111111111;
      convolutionMask[0][2] = 0.1111111111; 	convolutionMask[1][2] = 0.1111111111; 	convolutionMask[2][2] = 0.1111111111;
      // END:- The Convolution mask.
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroup(x,y,convolutionMask);
  }   

function  gausian(x,y){
       // The convolution width and height.
      convolutionWidth = 5;
      convolutionHeight = 5;
      
      factor = 1/273; 
      bias = 0.0;
      
      // The Convolution mask.
      convolutionMask = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask[i]=new Array(convolutionWidth);
      }
      convolutionMask[0][0] = 1;	convolutionMask[1][0] = 4; 	convolutionMask[2][0] = 7; 	convolutionMask[3][0] = 4; 	convolutionMask[4][0] = 1;
      convolutionMask[0][1] = 4; 	convolutionMask[1][1] = 16; 	convolutionMask[2][1] = 26; 	convolutionMask[3][1] = 16; 	convolutionMask[4][1] = 4;
      convolutionMask[0][2] = 7; 	convolutionMask[1][2] = 26; 	convolutionMask[2][2] = 41; 	convolutionMask[3][2] = 26; 	convolutionMask[4][2] = 7;
      convolutionMask[0][3] = 4; 	convolutionMask[1][3] = 16; 	convolutionMask[2][3] = 26; 	convolutionMask[3][3] = 16; 	convolutionMask[4][3] = 4;
      convolutionMask[0][4] = 1; 	convolutionMask[1][4] = 4; 	convolutionMask[2][4] = 7; 	convolutionMask[3][4] = 4; 	convolutionMask[4][4] = 1;
      // END:- The Convolution mask.
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroup(x,y,convolutionMask);
  }              
                   

 function  motionBlur(x,y){
       // The convolution width and height.
      convolutionWidth = 5;
      convolutionHeight = 5;
      factor = 1/5; 
      bias = 0 + Number(document.getElementById("bias").value);
      // The Convolution mask.
      convolutionMask = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask[i]=new Array(convolutionWidth);
      }
      convolutionMask[0][0] = 0;	convolutionMask[1][0] = 0; 	convolutionMask[2][0] = 0; 	convolutionMask[3][0] = 0; 	convolutionMask[4][0] = 0;
      convolutionMask[0][1] = 0; 	convolutionMask[1][1] = 0; 	convolutionMask[2][1] = 0; 	convolutionMask[3][1] = 0; 	convolutionMask[4][1] = 0;
      convolutionMask[0][2] = 1; 	convolutionMask[1][2] = 1; 	convolutionMask[2][2] = 1; 	convolutionMask[3][2] = 1; 	convolutionMask[4][2] = 1;
      convolutionMask[0][3] = 0; 	convolutionMask[1][3] = 0; 	convolutionMask[2][3] = 0; 	convolutionMask[3][3] = 0; 	convolutionMask[4][3] = 0;
      convolutionMask[0][4] = 0; 	convolutionMask[1][4] = 0; 	convolutionMask[2][4] = 0; 	convolutionMask[3][4] = 0; 	convolutionMask[4][4] = 0;
      // END:- The Convolution mask.
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroup(x,y,convolutionMask);
   }  
                  
        

function  pixelGroup(x,y,convolutionMask){
// ------------------------
// Pixel Group Processing..
// ------------------------
              var idx = (x + y * canvas.width)*4;
                for(var filterx=0; filterx <convolutionWidth; filterx++){
                    for (var filtery=0; filtery <convolutionHeight; filtery++){
                    
                       var tmpX = ((x-Math.floor (convolutionWidth/2))+filterx + canvas.width) %canvas.width;
                       var tmpY = ((y-Math.floor (convolutionHeight/2))+filtery + canvas.height) %canvas.height;
                       var convolutionKernel_Index = (tmpX + tmpY * canvas.width)*4;
                       
                       var outputIndex = (filterx + filtery * convolutionWidth) * 4 ;

                      convolutionKernel_Output[outputIndex] = convolutionMask[filterx][filtery]* factor *
                                            myImageData.data[convolutionKernel_Index];
                      convolutionKernel_Output[outputIndex+1] = convolutionMask[filterx][filtery]* factor *
                                            myImageData.data[convolutionKernel_Index+1];
                      convolutionKernel_Output[outputIndex+2] = convolutionMask[filterx][filtery]* factor *
                                            myImageData.data[convolutionKernel_Index+2]; 
                      convolutionKernel_Output[outputIndex+3] = 225;                                                                                                           
                    }
                }
            
               var newPixel = new Array(4);
               for (i=0; i<4; i++){
               newPixel[i]= 0;
               }
               for (i=0; i<convolutionKernel_OutputArraySize; i+=4){
               newPixel[0] = newPixel [0] +  convolutionKernel_Output [i]+bias;
               newPixel[1] = newPixel [1] +  convolutionKernel_Output [i+1]+bias;
               newPixel[2] = newPixel [2] +  convolutionKernel_Output [i+2]+bias;
               newPixel[3] = newPixel [3] +  convolutionKernel_Output [i+3]+bias; 
               }  
               
               newImageData.data[idx] = Math.min(Math.max(newPixel[0],0),255);
               newImageData.data[idx+1] = Math.min(Math.max(newPixel[1],0),255);               
               newImageData.data[idx+2] = Math.min(Math.max(newPixel[2],0),255);              
               newImageData.data[idx+3] = Math.min(Math.max(newPixel[3],0),255);
            }
            
            
                
            
 function  sobel(x,y){
       // The convolution width and height.
      convolutionWidth = 3;
      convolutionHeight = 3;
      factor = 1;       
      bias = 0 + Number(document.getElementById("bias").value);
      threshold = 0 + Number(document.getElementById("thresh").value);
    
      // The Convolution mask 1.
      var convolutionMask1 = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask1[i]=new Array(convolutionWidth);
      }
      convolutionMask1[0][0] = -1;	convolutionMask1[1][0] = 0; 	convolutionMask1[2][0] = 1; 	
      convolutionMask1[0][1] = -2; 	convolutionMask1[1][1] = 0; 	convolutionMask1[2][1] = 2; 	
      convolutionMask1[0][2] = -1; 	convolutionMask1[1][2] = 0; 	convolutionMask1[2][2] = 1;
      // END:- The Convolution mask 1.   
      var convolutionMask2 = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask2[i]=new Array(convolutionWidth);
      }
      convolutionMask2[0][0] = 1;	convolutionMask2[1][0] = 2; 	convolutionMask2[2][0] = 1; 	
      convolutionMask2[0][1] = 0; 	convolutionMask2[1][1] = 0; 	convolutionMask2[2][1] = 0; 	
      convolutionMask2[0][2] = -1; 	convolutionMask2[1][2] = -2; 	convolutionMask2[2][2] = -1; 	

      // END:- The Convolution mask.      
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroupMask(x,y,convolutionMask1, "noProir", "edge");
      pixelGroupMask(x,y,convolutionMask2, "coProir", "edge");
                  }   
                  
 function  robertsCross(x,y){                    
       // The convolution width and height.
      convolutionWidth = 2;
      convolutionHeight = 2;
      factor = 1;       
      bias = 0 + Number(document.getElementById("bias").value);
      threshold = 0 + Number(document.getElementById("thresh").value);
      // The Convolution mask 1.
      var convolutionMask1 = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask1[i]=new Array(convolutionWidth);
      }
      convolutionMask1[0][0] = 1;	convolutionMask1[1][0] = 0; 	 	
      convolutionMask1[0][1] = 0; 	convolutionMask1[1][1] = -1;  	
      // END:- The Convolution mask 1.
      // The Convolution mask 2.
      var convolutionMask2 = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask2[i]=new Array(convolutionWidth);
      }
      convolutionMask2[0][0] = 0;	convolutionMask2[1][0] = 1; 	 	
      convolutionMask2[0][1] = -1; 	convolutionMask2[1][1] = 0; 	 		
      // END:- The Convolution mask.      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroupMask(x,y,convolutionMask1, "noProir", "edge");
      pixelGroupMask(x,y,convolutionMask2, "coProir", "edge");
                  }                                                        
                  
function  emboss(x,y){
       // The convolution width and height.
      convolutionWidth = 3;
      convolutionHeight = 3;
      factor = 1; 
      bias = 128 + Number(document.getElementById("bias").value);
      // The Convolution mask.
      convolutionMask = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask[i]=new Array(convolutionWidth);
      }
      convolutionMask[0][0] = -1;	  convolutionMask[1][0] = 0; 	convolutionMask[2][0] = 1; 
      convolutionMask[0][1] = -1; 	convolutionMask[1][1] = 0; 	convolutionMask[2][1] = 1; 	
      convolutionMask[0][2] = -1; 	convolutionMask[1][2] = 0; 	convolutionMask[2][2] = 1; 	
      // END:- The Convolution mask.
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroupMask(x,y,convolutionMask, "noProir");
                  }                                     
function  emboss45(x,y){
       // The convolution width and height.
      convolutionWidth = 3;
      convolutionHeight = 3;
      factor = 1; 
      bias = 128 + Number(document.getElementById("bias").value);
      // The Convolution mask.
      convolutionMask = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask[i]=new Array(convolutionWidth);
      }
      convolutionMask[0][0] = 0;	  convolutionMask[1][0] = 1; 	convolutionMask[2][0] = 1; 
      convolutionMask[0][1] = -1; 	convolutionMask[1][1] = 0; 	convolutionMask[2][1] = 1; 	
      convolutionMask[0][2] = -1; 	convolutionMask[1][2] = -1; 	convolutionMask[2][2] = 0; 	
      // END:- The Convolution mask.
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroupMask(x,y,convolutionMask, "noProir");
                  } 
 function  sharpen(x,y){                          
       // The convolution width and height.
      convolutionWidth = 5;
      convolutionHeight = 5;
      factor = 1/8; 
      bias = 0 + Number(document.getElementById("bias").value);
      threshold = 100 + Number(document.getElementById("thresh").value);
      // The Convolution mask.
      convolutionMask = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask[i]=new Array(convolutionWidth);
      }
      convolutionMask[0][0] = -1;	convolutionMask[1][0] = -1; 	convolutionMask[2][0] = -1; 	convolutionMask[3][0] = -1; 	convolutionMask[4][0] = -1;
      convolutionMask[0][1] = -1; 	convolutionMask[1][1] = 2; 	convolutionMask[2][1] = 2; 	convolutionMask[3][1] = 2; 	convolutionMask[4][1] = -1;
      convolutionMask[0][2] = -1; 	convolutionMask[1][2] = 2; 	convolutionMask[2][2] = 8; 	convolutionMask[3][2] = 2; 	convolutionMask[4][2] = -1;
      convolutionMask[0][3] = -1; 	convolutionMask[1][3] = 2; 	convolutionMask[2][3] = 2; 	convolutionMask[3][3] = 2; 	convolutionMask[4][3] = -1;
      convolutionMask[0][4] = -1; 	convolutionMask[1][4] = -1; 	convolutionMask[2][4] = -1; 	convolutionMask[3][4] = -1; 	convolutionMask[4][4] = -1;
      // END:- The Convolution mask.
//      convolutionMask[0][0] = 1;	convolutionMask[1][0] = 1; 	convolutionMask[2][0] = 1;
//      convolutionMask[0][1] = 1; 	convolutionMask[1][1] = -7; 	convolutionMask[2][1] = 1; 
//      convolutionMask[0][2] = 1; 	convolutionMask[1][2] = 1; 	convolutionMask[2][2] = 1; 
      // END:- The Convolution mask.
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroupMask(x,y,convolutionMask,"coProir");
      } 

       

                                          
function  pixelGroupMask(x,y,convolutionMask, id, process){
// ------------------------
// Pixel Group Processing..
// ------------------------
              var idx = (x + y * canvas.width)*4;
                for(var filterx=0; filterx <convolutionWidth; filterx++){
                    for (var filtery=0; filtery <convolutionHeight; filtery++){
                    
                       var tmpX = ((x-Math.floor (convolutionWidth/2))+filterx + canvas.width) %canvas.width;
                       var tmpY = ((y-Math.floor (convolutionHeight/2))+filtery + canvas.height) %canvas.height;
                       var convolutionKernel_Index = (tmpX + tmpY * canvas.width)*4;
                       
                       var outputIndex = (filterx + filtery * convolutionWidth) * 4 ;

                      convolutionKernel_Output[outputIndex] = convolutionMask[filterx][filtery]* 
                                            myImageData.data[convolutionKernel_Index];
                      convolutionKernel_Output[outputIndex+1] = convolutionMask[filterx][filtery]* 
                                            myImageData.data[convolutionKernel_Index+1];
                      convolutionKernel_Output[outputIndex+2] = convolutionMask[filterx][filtery]* 
                                            myImageData.data[convolutionKernel_Index+2]; 
                      convolutionKernel_Output[outputIndex+3] = 225;                                                                                                           
                    }
                }
            
               var newPixel = new Array(4);
               for (i=0; i<4; i++){
               newPixel[i]= 0;
               }
               for (i=0; i<convolutionKernel_OutputArraySize; i+=4){
               newPixel[0] = newPixel [0] +  convolutionKernel_Output [i];
               newPixel[1] = newPixel [1] +  convolutionKernel_Output [i+1];
               newPixel[2] = newPixel [2] +  convolutionKernel_Output [i+2];
               newPixel[3] = newPixel [3] +  convolutionKernel_Output [i+3]; 
               } 
            
                     if (process = "edge")
                       { 
                                                                
                        var avgGradient
                     newPixel[0] = Math.abs(newPixel[0]);
                     newPixel [1] = Math.abs(newPixel[1]);
                     newPixel[2] = Math.abs(newPixel[2]);
                     avgGradient = (newPixel[0] + newPixel[1]+ newPixel[2])/3;
                     
                     newPixel[0] = avgGradient;
                     newPixel[1] = avgGradient;
                     newPixel[2] = avgGradient;  
                    
                      if (newPixel[0] < threshold){   
                                newPixel[0] = 0;
                                newPixel[1] = 0;
                                newPixel[2] = 0;
                                } 
                                
                      
                       }
                       
                     if (process = "emboss")
                       {
                     var avgGradient = (newPixel[0] + newPixel[1]+ newPixel[2])/3;
                     newPixel[0] = avgGradient;
                     newPixel[1] = avgGradient;
                     newPixel[2] = avgGradient;   
                       }
                          
            if(id == 'noProir')        {    
            newImageData.data[idx] = Math.min(Math.max((newPixel[0]* factor + bias),0),255);
            newImageData.data[idx+1] = Math.min(Math.max((newPixel[1]* factor + bias),0),255);              
            newImageData.data[idx+2] = Math.min(Math.max((newPixel[2]* factor + bias),0),255);             
            newImageData.data[idx+3] = Math.min(Math.max((newPixel[3]* factor + bias),0),255);
            }
            
            if(id == 'coProir')        {    
            newImageData.data[idx] = Math.min(Math.max(((newPixel[0]* factor + bias)+newImageData.data[idx]),0),255);
            newImageData.data[idx+1] = Math.min(Math.max(((newPixel[1]* factor + bias)+newImageData.data[idx+1]),0),255);              
            newImageData.data[idx+2] = Math.min(Math.max(((newPixel[2]* factor + bias)+newImageData.data[idx+2]),0),255);             
            newImageData.data[idx+3] = Math.min(Math.max(((newPixel[3]* factor + bias)+ newImageData.data[idx+3]),0),255);
            }
            
            
            } 
            
            
            
// ------------------------
// Attempts at mon maximum suppression 
// ------------------------  
function  nonMaximumSuppression(x,y){                        
        var c;
        var ns;
        var we;
        var nwse;
        var nesw;
            
        for (c=0; c<4; c++){      
        if (c==3)
        {newImageData.data[idx+c] = 255;}
        else{
        
        var n = pixelComponents[(x + (y-1) * canvas.width)*4];
        var s = pixelComponents[(x + (y+1) * canvas.width)*4];
         if (n >= pixelComponents[idx+c] ||  s >= pixelComponents[idx+c])
          {ns = 0;} else {ns = newImageData.data[idx+c];}  
        
        var w = pixelComponents[((x-1) + y * canvas.width)*4];
        var e = pixelComponents[((x+1) + y * canvas.width)*4];
        if (w >= pixelComponents[idx+c] ||  e >= pixelComponents[idx+c])
          {we = 0;} else {we = newImageData.data[idx+c];}  
        
        var ne = pixelComponents[((x+1) + (y-1) * canvas.width)*4];
        var sw = pixelComponents[((x-1) + (y+1) * canvas.width)*4]; 
        if (ne >= pixelComponents[idx+c] ||  sw >= pixelComponents[idx+c])
          {nesw = 0;}  else { nesw = newImageData.data[idx+c];}  
          
        var se = pixelComponents[((x+1) + (y+1) * canvas.width)*4];
       var nw = pixelComponents[((x-1) + (y-1) * canvas.width)*4];
        if (nw >= pixelComponents[idx+c] ||  se >= pixelComponents[idx+c])
          {nwse = 0 }  else {nwse = newImageData.data[idx+c];}   
       
       newImageData.data[idx+c] =  ns + we + nesw + nwse;
          
      }
    } 
  } 
  
function  nonMaximumSuppressionHorizontal(x,y){                        
        var c;    
        for (c=0; c<4; c++){      
        if (c==3)
        {newImageData.data[idx+c] = 255;}
        else{
        var n = pixelComponents[(x + (y-1) * canvas.width)*4];
        var s = pixelComponents[(x + (y+1) * canvas.width)*4];
        var w = pixelComponents[((x-1) + y * canvas.width)*4];
        var e = pixelComponents[((x+1) + y * canvas.width)*4];
        var ne = pixelComponents[((x+1) + (y-1) * canvas.width)*4];
        var nw = pixelComponents[((x-1) + (y-1) * canvas.width)*4];
        var se = pixelComponents[((x+1) + (y+1) * canvas.width)*4];
        var sw = pixelComponents[((x-1) + (y+1) * canvas.width)*4]; 
        var notEdge = false;
        if (n >= pixelComponents[idx+c] ||  s >= pixelComponents[idx+c])
          {newImageData.data[idx+c] = 0;}   
          
      }
    } 
  }  


function  outline(x,y){                        
        var c;    
        for (c=0; c<4; c++){      
        if (c==3)
        {newImageData.data[idx+c] = 255;}
        else{
        var n = pixelComponents[(x + (y-1) * canvas.width)*4];
        var s = pixelComponents[(x + (y+1) * canvas.width)*4];
        var w = pixelComponents[((x-1) + y * canvas.width)*4];
        var e = pixelComponents[((x+1) + y * canvas.width)*4];
        var ne = pixelComponents[((x+1) + (y-1) * canvas.width)*4];
        var nw = pixelComponents[((x-1) + (y-1) * canvas.width)*4];
        var se = pixelComponents[((x+1) + (y+1) * canvas.width)*4];
        var sw = pixelComponents[((x-1) + (y+1) * canvas.width)*4]; 
        if (n > pixelComponents[idx+c] ||  s > pixelComponents[idx+c])
          {newImageData.data[idx+c] = 0;}   
        if (w > pixelComponents[idx+c] ||  e > pixelComponents[idx+c])
          {newImageData.data[idx+c] = 0;}
        if (ne > pixelComponents[idx+c] ||  sw > pixelComponents[idx+c])
          {newImageData.data[idx+c] = 0;} 
        if (nw > pixelComponents[idx+c] ||  se > pixelComponents[idx+c])
          {newImageData.data[idx+c] = 0;}            
      }
    } 
  }                                             

function  merge(x,y){                        
        // The convolution width and height.
      convolutionWidth = 3;
      convolutionHeight = 3;
      factor = 1;       
      bias = 0 + Number(document.getElementById("bias").value);
      threshold = 50 + Number(document.getElementById("thresh").value);
    
      // The Convolution mask 1.
      var convolutionMask1 = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask1[i]=new Array(convolutionWidth);
      }
      convolutionMask1[0][0] = -1;	convolutionMask1[1][0] = 0; 	convolutionMask1[2][0] = 1; 	
      convolutionMask1[0][1] = -2; 	convolutionMask1[1][1] = 0; 	convolutionMask1[2][1] = 2; 	
      convolutionMask1[0][2] = -1; 	convolutionMask1[1][2] = 0; 	convolutionMask1[2][2] = 1;
      // END:- The Convolution mask 1.   
      var convolutionMask2 = new Array(convolutionHeight);
      for (i=0; i < convolutionHeight; i++){
      	convolutionMask2[i]=new Array(convolutionWidth);
      }
      convolutionMask2[0][0] = 1;	convolutionMask2[1][0] = 2; 	convolutionMask2[2][0] = 1; 	
      convolutionMask2[0][1] = 0; 	convolutionMask2[1][1] = 0; 	convolutionMask2[2][1] = 0; 	
      convolutionMask2[0][2] = -1; 	convolutionMask2[1][2] = -2; 	convolutionMask2[2][2] = -1; 	

      // END:- The Convolution mask.      
      
      // The Convolution kernel - output.
      // Size is convolution kernel width * height * 4.
      convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
      convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
      // END:- Convolution kernel - output.
      pixelGroupMaskMerge(x,y,convolutionMask1);
 //    pixelGroupMaskMerge(x,y,convolutionMask2 );
                  }                           

function  pixelGroupMaskMerge(x,y,convolutionMask, id){
// ------------------------
// Pixel Group Processing..
// ------------------------
              var idx = (x + y * canvas.width)*4;

                for(var filterx=0; filterx <convolutionWidth; filterx++){
                    for (var filtery=0; filtery <convolutionHeight; filtery++){
                    
                       var tmpX = ((x-Math.floor (convolutionWidth/2))+filterx + canvas.width) %canvas.width;
                       var tmpY = ((y-Math.floor (convolutionHeight/2))+filtery + canvas.height) %canvas.height;
                       var convolutionKernel_Index = (tmpX + tmpY * canvas.width)*4;
                       
                       var outputIndex = (filterx + filtery * convolutionWidth) * 4 ;

                      convolutionKernel_Output[outputIndex] = convolutionMask[filterx][filtery]* 
                                            myImageData.data[convolutionKernel_Index];
                      convolutionKernel_Output[outputIndex+1] = convolutionMask[filterx][filtery]* 
                                            myImageData.data[convolutionKernel_Index+1];
                      convolutionKernel_Output[outputIndex+2] = convolutionMask[filterx][filtery]* 
                                            myImageData.data[convolutionKernel_Index+2]; 
                      convolutionKernel_Output[outputIndex+3] = 225;                                                                                                           
                    }
                }
            
               var newPixel = new Array(4);
               for (i=0; i<4; i++){
               newPixel[i]= 0;
               }
               for (i=0; i<convolutionKernel_OutputArraySize; i+=4){
               newPixel[0] = newPixel [0] +  convolutionKernel_Output [i];
               newPixel[1] = newPixel [1] +  convolutionKernel_Output [i+1];
               newPixel[2] = newPixel [2] +  convolutionKernel_Output [i+2];
               newPixel[3] = newPixel [3] +  convolutionKernel_Output [i+3]; 
               } 
            
                                                                
                        var avgGradient
                     newPixel[0] = Math.abs(newPixel[0]);
                     newPixel [1] = Math.abs(newPixel[1]);
                     newPixel[2] = Math.abs(newPixel[2]);
                     avgGradient = (newPixel[0] + newPixel[1]+ newPixel[2])/3;
                     
                     newPixel[0] = avgGradient;
                     newPixel[1] = avgGradient;
                     newPixel[2] = avgGradient;  
                    
                      if (newPixel[0] < threshold){   
                                newPixel[0] = 0;
                                newPixel[1] = 0;
                                newPixel[2] = 0;
                                } 
                                               
            if(id == 'noProir')        {    
            mapImageData.data[idx] = Math.min(Math.max((newPixel[0]* factor + bias),0),255);
            mapImageData.data[idx+1] = Math.min(Math.max((newPixel[1]* factor + bias),0),255);              
            mapImageData.data[idx+2] = Math.min(Math.max((newPixel[2]* factor + bias),0),255);             
            mapImageData.data[idx+3] = Math.min(Math.max((newPixel[3]* factor + bias),0),255);
            }
            
            if(id == 'coProir')        {    
            mapImageData.data[idx] = Math.min(Math.max(((newPixel[0]* factor + bias)+mapImageData.data[idx]),0),255);
            mapImageData.data[idx+1] = Math.min(Math.max(((newPixel[1]* factor + bias)+mapImageData.data[idx+1]),0),255);              
            mapImageData.data[idx+2] = Math.min(Math.max(((newPixel[2]* factor + bias)+mapImageData.data[idx+2]),0),255);             
            mapImageData.data[idx+3] = Math.min(Math.max(((newPixel[3]* factor + bias)+ mapImageData.data[idx+3]),0),255);
            }

if (mapImageData.data[idx] == 0){   
        if (switchImg == 1) 
              {switchImg = 0;
             } else 
            {switchImg = 1;
            newImageData.data[idx] = pixelComponents[idx];
            newImageData.data[idx+1] = pixelComponents[idx+1];           
            newImageData.data[idx+2] = pixelComponents[idx+2];        
            newImageData.data[idx+3] = pixelComponents[idx+3];
             }
           }
            
            
            }                                                                        