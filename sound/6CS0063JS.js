// myJavaScriptFile.js
// Sound Example - Simple Visualiser - A graph of the waveform / Time Domain. 

// *******************************
// Sound Visualisation variables.
// *******************************

// Set the width and height of the canvases.
var WIDTH = 640;
var HEIGHT = 360;
var spectrogramCanvasWIDTH = 640;
var spectrogramCanvasHEIGHT = 500;

// The analyser and visualiser variables
var spectrogramLeftPos = 0;
var analyser;
var freqDomain;
var ampPeak;
var priorAmpPeak;
var ampPeakIndex = 0;
var ampPeakLength = 1;
var freqPeak;
var startTime;
var timePeak;

// Audio Context.
var audioContext;

// A sound.
var uploadedfileBuffer = [];

// A sound sources.
var aSoundSource = null; 
var oscillator = [];
var uploadedfile=[];
var filter=[];
var gainNode = [];
var totalSoundNo = 1;

// Smoothing - A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame. The default value is 0.8.
var SMOOTHING = 0.8;

// FFT Size - The size of the FFT used for frequency-domain analysis. Must be a power of 2.
var FFT_SIZE = 1024;

// *******************************
// Reset all.
// *******************************
function resetAll(){  
        uploadedfileBuffer = [];
        oscillator = [];
        uploadedfile=[];
        filter=[];
        gainNode = [];
        totalSoundNo = 0; 
        document.getElementById("frequency").value = 440;  
        ampPeak = 0;
        priorAmpPeak = 0;
        ampPeakIndex = 0;
        ampPeakLength = 1;
        freqPeak = 0;
        startTime = 0;
        timePeak = 0;    
}

/* The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that 
the browser call a specified function to update an animation before the next repaint. The method takes as an argument 
a callback to be invoked before the repaint.
Here we use this method, or a fallback. */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
  				window.RequestAnimationFrame       || 
  				window.mozRequestAnimationFrame    || 
  				window.oRequestAnimationFrame      || 
  				window.msRequestAnimationFrame     || 
  				function( callback ){
  					window.setTimeout(callback, 1000 / 60);
				};
})();

// ------------------------
// Display options
// ------------------------

// add sound
function changeSound(){
    //chose style div  
        var divOut = document.createElement("div");
        var div = '<h4>Sound ' + (totalSoundNo+1) + '</h4>';       
        div +=  '<div id="soundSel' + totalSoundNo + '" class="hidden">';
    //chose sound type
        div +=  '<select name=\"effect'+ totalSoundNo + '\" id=\"effect' + totalSoundNo + '\" onchange=\"divDisplay('+ totalSoundNo + ')\">';
        div +=  '<option value=\"--Select---\">Input Type</option>';
        div += '<option value=\"oscillator\">Oscillator</option>';
        div += '<option value=\"uploadedfile\">Form File</option>';
        div += '</select>';
    //change oscillator type
        div += '<div id=\'oscillatorSelDisp' + totalSoundNo + '\' style= \'display:none;\'>';
        div += '<select name=\"oscillatorSel' + totalSoundNo + '\" id=\"oscillatorSel' + totalSoundNo +'"\" onchange=\"adjustOscillator('+ totalSoundNo +')\">';
        div += '<option value=\"sine\">Sine</option>';
        div += '<option value=\"square\">Square</option>';
        div += '<option value=\"sawtooth\">Sawtooth</option>',
        div += '<option value=\"triangle\">Triangle</option></select><br>';
    //change frequency
        div += 'Frequency:<input type="text" name="frequency" size= "5" id="frequency'+ totalSoundNo + '"  value="400" onchange="adjustFrequency('+ totalSoundNo + ')" >'; 
    //change Detune
        div += 'Detune:<input type="text" name="detune" size= "5" id="detune'+ totalSoundNo + '"  value="0" onchange="adjustDetune('+ totalSoundNo + ')" ></div>'; 
    //upload file
        div += '<input type="file" style=\'display:none;\' id="uploadfile'+ totalSoundNo + '\" name="'+ totalSoundNo + '" multiple onchange=\"loadaSound()\"/>';
    //select filter
        div +=  '<select name=\"filterType'+ totalSoundNo + '\" id=\"filterType' + totalSoundNo + '\" onchange=\"divDisplay('+ totalSoundNo + '), adjustFilterType('+ totalSoundNo + ')\">';
        div +=  '<option value=\"none\" selected>Select Filter</option>';
        div += '<option value=\"lowpass\">Low pass filter</option>';
        div += '<option value=\"highpass\">High pass filter</option>';
        div += '<option value=\"bandpass\">Band pass filter</option>';
        div += '<option value=\"lowshelf\">Low shelf filter</option>';
        div += '<option value=\"highshelf\">High shelf filter</option>';
        div += '<option value=\"peaking\">Peaking filter</option>';
        div += '<option value=\"notch\">Notch filter</option>';
        div += '<option value=\"allpass\">All pass filter</option>';   
        div += '</select>';
    //change frequency
        div += '<div id=\'filterfrequencySel'+ totalSoundNo + '\' style=\'display:none;\'>';
        div += 'Frequency:<input type=\"text\" name=\"filterFrequency\" size= \"5\" id=\"filterFrequency'+ totalSoundNo + '\"  value=\"400\" onchange=\"adjustFilterFrequency('+ totalSoundNo + ')\" >'; 
        div += 'Quality:<input type=\"text\" name=\"filterQuality\" size= \"5\" id=\"filterQuality'+ totalSoundNo + '\"  value=\"0\" onchange=\"adjustQualityFrequency('+ totalSoundNo + ')\" ></div>'; 
    //change Volume
        div += '<div>Volume:<input id=\'volume'+ totalSoundNo + '\' type="range" min="0" max="1" step="0.1" value="1.0" onchange=\"adjustSoundVolume('+ totalSoundNo + ')\">'; 
        div += '<br> Destructive Interference: <input type="checkbox" id="DI'+ totalSoundNo + '" value="false" onchange="adjustSoundVolume('+ totalSoundNo + ')">';
    //end of div         
        div += '</div>';    
     divOut.innerHTML = div;
    divOut.className = 'box sound';                   
     document.getElementById("sounds").appendChild(divOut);   
    	totalSoundNo++
} 
    

function divDisplay(num) {
  var selection = document.getElementById("effect"+ num).value; 

    if(selection == "oscillator")             
      {document.getElementById("oscillatorSelDisp"+num).style.display =  "block";}
     else  
      {document.getElementById("oscillatorSelDisp"+num).style.display =  "none";} 
           
     if(selection == "uploadedfile")             
        {document.getElementById("uploadfile"+num).style.display =  "block";
        document.getElementById("uploadfile"+num).addEventListener('change', loadaSound, false);
        }
     else  
        {document.getElementById("uploadfile"+num).style.display =  "none";}  
           
 selection = document.getElementById("filterType"+ num).value;    
      if (!(selection == "none"))             
        {document.getElementById("filterfrequencySel"+num).style.display =  "block";}
     else  
        {document.getElementById("filterfrequencySel"+num).style.display =  "none";}                        
}

function divMasterDisplay() {  
      if (!(document.getElementById("filterTypeMaster").value == "none"))             
        {document.getElementById("filterfrequencySelMaster").style.display =  "block";}
     else  
        {document.getElementById("filterfrequencySelMaster").style.display =  "none";}                        
}

// Add an event to the the window. The load event will call the init function.
window.addEventListener('load', init, false);

// Function to initalise the audio context.
function init() {
	try {
		// Check if the default naming is enabled, if not use the WebKit naming.
	    if (!window.AudioContext) {
	        window.AudioContext = window.webkitAudioContext;
	    }
          audioContext = new AudioContext();
          filterNodeMaster = audioContext.createBiquadFilter();
          gainNodeMaster = audioContext.createGain(); 
		// Initalise the analyser.
		initAnalyser();
	}
	catch(e) {
		alert("Web Audio API is not supported in this browser");
  	}
}

// Add events to document elements.
function addEvents() {
    // Add an events to control the options. 
  document.getElementById("volume").addEventListener('change',adjustVolumeMaster); 
}

// Load a file when a file is selected.
function loadaSound(evt) {
	// Get the FileList object.    
	var fileid = evt.target.id;
	var files = evt.target.files;
  	var fileid = evt.target.name;
	// Get the first file in the list. 
	// This example only works with
	// the first file returned.
	var fileSelected = files[0];
    // Create a file reader.
	var reader = new FileReader();
	reader.onload = function(e) {
    	initSound(this.result,fileid);
  	};  
	// Read in the image file as a data URL.
  	reader.readAsArrayBuffer(fileSelected);
}

// Initalise the sound.
function initSound(arrayBuffer, fileid) {
  eval("uploadedfile["+ fileid +"] =	audioContext.decodeAudioData(arrayBuffer, function(buffer) {uploadedfileBuffer["+ fileid +"] = buffer;}, function(e) {console.log('Error decoding file', e)});" );    
}


// Play the sound.
function playSound(buffer) {
	aSoundSource = audioContext.createBufferSource(); // creates a sound source.
 
  for (Count = 0; Count < totalSoundNo; Count++) {
          var selection = document.getElementById("effect"+Count).value;
          if(selection == 'oscillator')    {    
              oscillator[Count] = audioContext.createOscillator();
              newOscillator(Count);
              applyOptions(oscillator[Count],Count);
          } 
          if(selection == 'uploadedfile'){
              uploadedfile[Count] = audioContext.createBufferSource();
              newFile(Count);// creates a sound source.
              applyOptions(uploadedfile[Count],Count);
          }        
    } 

// link master nodes
  gainNodeMaster.connect(filterNodeMaster);
 // Connect the source to the analyser.
  filterNodeMaster.connect(analyser); 
	analyser.connect(audioContext.destination);
// set master volume 
  gainNodeMaster.gain.value = document.getElementById('volume').value;          

//Set filter value or disconnect            
    if (document.getElementById("filterTypeMaster").value == "none") { 
      // Disconnect the source and filter.
      gainNodeMaster.disconnect(0);
      filterNodeMaster.disconnect(0);
      // Connect the source directly.
      gainNodeMaster.connect(analyser);
    }else{                        
      filterNodeMaster.type = document.getElementById("filterTypeMaster").value;
      filterNodeMaster.frequency.value = document.getElementById("filterFrequencyMaster").value;
      filterNodeMaster.Q.value = document.getElementById("filterQualityMaster").value;     
      } 



    for (Count = 0; Count < totalSoundNo; Count++) {
          var selection = document.getElementById("effect"+Count).value; 
          eval(selection+"["+ Count +"].start(0)");
          startTime = analyser.context.currentTime;    
    } 
    // Start visualizer.
    requestAnimFrame(drawVisualisation);   
}

// Stop the sound.
// Simple stop. Will only stop the last 
// sound if you press play more than once.
function stopSound() {
    for (Count = 0; Count < totalSoundNo; Count++) {
          var selection = document.getElementById("effect"+Count).value; 
          eval(selection+"["+ Count +"].stop(0)");    
    } 
	if (aSoundSource) {
    aSoundSource.stop(0);
	}
}   


// *******************************
// Oscillator Node
// *******************************
function newOscillator(soundNo) {     
    oscillator[soundNo].frequency.value = document.getElementById("frequency"+soundNo).value;
    oscillator[soundNo].detune.value = document.getElementById("detune"+soundNo).value;
    oscillator[soundNo].type = document.getElementById("oscillatorSel"+soundNo).value;
    var nodeName = "oscillator["+soundNo+"]" ;                                                               
}  
// Adjust the type of occilator. 
function adjustOscillator(soundNo) { 
if (!(typeof oscillator[soundNo] === "undefined")) 
 {oscillator[soundNo].type = document.getElementById("oscillatorSel"+soundNo).value;}
}
                                                            
// Adjust the frequency of occilator. 
function adjustFrequency(soundNo) {
  if (!(typeof oscillator[soundNo] === "undefined"))
  {oscillator[soundNo].frequency.value = document.getElementById("frequency"+soundNo).value;}
}

// Adjust the tuneing of occilator. 
function adjustDetune(soundNo) { 
if (!(typeof oscillator[soundNo] === "undefined"))
  oscillator[soundNo].detune.value = document.getElementById("detune"+soundNo).value; 
}

// *******************************
// file node
// *******************************
function newFile(soundNo) {     
    uploadedfile[soundNo].buffer = uploadedfileBuffer[soundNo]; // tell the source which sound to play.
    var nodeName = "uploadedfile["+soundNo+"]" ;                                                               
}

// *******************************
// control Options
// *******************************
function applyOptions(nodeName,soundNo) {
// Tree  of filters 
        filter[soundNo]=audioContext.createBiquadFilter();
        nodeName.connect(filter[soundNo]);
        gainNode[soundNo] = audioContext.createGain();
        filter[soundNo].connect(gainNode[soundNo]);
        gainNode[soundNo].connect(gainNodeMaster); 
// set gain        
        adjustSoundVolume(soundNo)

//Set filter value or disconnect         
      var filterType = document.getElementById("filterType"+ soundNo).value;    
      if (filterType == "none") { 
        // Disconnect the source and filter.
        nodeName.disconnect(0);
        filter[soundNo].disconnect(0);
        // Connect the source directly.
        nodeName.connect(gainNode[soundNo]);
      }else{                        
        filter[soundNo].type = document.getElementById("filterType"+soundNo).value;
        filter[soundNo].frequency.value = document.getElementById("filterFrequency"+soundNo).value;
        filter[soundNo].Q.value = document.getElementById("filterQuality"+soundNo).value;
       }               
}

// Adjust filter type. 
function adjustFilterType(soundNo) { 
if (!(typeof filter[soundNo] === "undefined")) 
  {filter[soundNo].type = document.getElementById("filterType"+soundNo).value;}
}
// Adjust filter frequency. 
function adjustFilterFrequency(soundNo) { 
  if (!(typeof filter[soundNo] === "undefined")) 
  {filter[soundNo].frequency.value = document.getElementById("filterFrequency"+soundNo).value;}
}
// Adjust filter quality. 
function adjustFilterQuality(soundNo) { 
  if (!(typeof filter[soundNo] === "undefined")) 
  {filter[soundNo].Q.value = document.getElementById("filterQuality"+soundNo).value;}
}

// Adjust the volume. 
function adjustSoundVolume(soundNo) { 
  if (document.getElementById("DI"+soundNo).checked) 
  {gainNode[soundNo].gain.value = -1;}
  else
  {gainNode[soundNo].gain.value = document.getElementById("volume"+soundNo).value;}
  
}


// Adjust master controls. 
function adjustVolumeMaster() { 
 gainNodeMaster.gain.value = this.value; 
}
function adjustMasterFilterType() {  
  filterNodeMaster.type = document.getElementById("filterTypeMaster").value;
}
function adjustMasterFilterFrequency() { 
  filterNodeMaster.frequency.value = document.getElementById("filterFrequencyMaster").value;
}
function adjustMasterFilterQuality() { 
  filterNodeMaster.frequency.value = document.getElementById("filterQualityMaster").value;
}

// *******************************
// Visualisation Functions.
// *******************************

// Function to initalise the analyser.
function initAnalyser() {
analyser = audioContext.createAnalyser();
analyser.smothingTimeConstant = SMOOTHING;
analyser.ffrtSize = FFT_SIZE;
}

// Draw the visualisation.
function drawVisualisation() {
    var canvas = document.getElementById("canvasMain");
    var context = canvas.getContext("2d");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context.fillStyle = "rgb(255,255,255)";
    context.fillRect(0,0,WIDTH,HEIGHT);
    drawTimeDomainVisualisation(context);
    drawFrequencyDomainVisualisation(context);
    drawSpectrogramVisualisation();
    requestAnimFrame(drawVisualisation);
    
    var highestValueLengthASINDEX = ampPeakIndex+ampPeakLength;
    var tempINDEX = Math.round((ampPeakIndex+highestValueLengthASINDEX)/2); 
    
    document.getElementById("debugInfo").innerHTML =
    "freqDomain.lendth: " + freqDomain.length
    + " <br> Highest Amplitude Value: " + ampPeak 
    + " <br> Highest Value Index: " + ampPeakIndex
    + " <br> Highest Value Length: " + ampPeakLength  
    + " <br> Highest Value Length AS INDEX: " +  highestValueLengthASINDEX
    + " <br> temp INDEX: " + tempINDEX
    + " <br> getValueToFrequency: " + getValueToFrequency(tempINDEX) 
    + " <br> getFrequencyToIndex: " + getFrequencyToIndex(getValueToFrequency(tempINDEX)) 
    ;
    ampPeak = 0;
}

// Draw the time domain visualisation.
function drawTimeDomainVisualisation(context) {
  var timeDomain = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(timeDomain);
  
  for (var i=0; i<analyser.frequencyBinCount; i++)
      {
      var value = timeDomain[i];
      var percent = value / 256;
      
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/analyser.frequencyBinCount;
      context.fillStyle = "black";
      context.fillRect (i*barWidth, offset, 1, 1);
      timePeak = timeDomain[i];
      }
}

// Draw the frequency domain visualisation.
function drawFrequencyDomainVisualisation(context) {
      freqDomain = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqDomain);
    // document.getElementById("debugInfo").innerHTML ="freqDomain.lendth: " + freqDomain.length;
      for (var i=0; i<analyser.frequencyBinCount; i++)
          {
          var  value = freqDomain[i];
          var percent = value / 256; 
          var height = HEIGHT * percent;
          var offset = HEIGHT - height - 1;
          var barWidth = WIDTH/analyser.frequencyBinCount;
          var hue = i/analyser.frequencyBinCount  * 360;
          context.fillStyle = "hsl(" + hue +", 100%, 50%)";
          context.fillRect (i*barWidth, offset, barWidth, height);
          }
}

function drawSpectrogramVisualisation (){
  var canvas = document.getElementById("canvas2");
  var context = canvas.getContext("2d");
  var tempCanvas = document.createElement("canvas");
      tempCanvas.width = spectrogramCanvasWIDTH;
      tempCanvas.height = spectrogramCanvasHEIGHT;
  var tempCtx = tempCanvas.getContext("2d");
  
  tempCtx.drawImage(canvas,0,0, spectrogramCanvasWIDTH, spectrogramCanvasHEIGHT);
  var freqDomain = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqDomain);
   
  if(spectrogramLeftPos == spectrogramCanvasWIDTH) {
    for (var i=0; i<analyser.frequencyBinCount; i++){
      var value = freqDomain[i];  
      tempCtx.fillStyle = myColor.getColor(value).hex();
      calculatePeak(i,value);
      tempCtx.fillRect(spectrogramCanvasWIDTH-1,(spectrogramCanvasHEIGHT - i), 1, 1);
    }
    tempCtx.fillStyle = "#ff69b4";
    tempCtx.fillRect(spectrogramCanvasWIDTH-1,(spectrogramCanvasHEIGHT - ampPeakIndex), 1, 1);   
   context.translate(-1, 0);
   context.drawImage(tempCanvas, 0, 0, spectrogramCanvasWIDTH, spectrogramCanvasHEIGHT);
   context.setTransform (1,0,0,1,0,0); 
   tempCtx.fillStyle = "#ff69b4";
   tempCtx.fillRect(spectrogramLeftPos,(spectrogramCanvasHEIGHT - ampPeakIndex), 1, 1);
  } else {
    for (var i = 0; i < analyser.frequencyBinCount; i++){
      var value = freqDomain[i];
      tempCtx.fillStyle = myColor.getColor(value).hex();
      calculatePeak(i,value);
      tempCtx.fillRect(spectrogramLeftPos,(spectrogramCanvasHEIGHT - i), 1, 1);
      }
    tempCtx.fillStyle = "#ff69b4";
    tempCtx.fillRect(spectrogramLeftPos,(spectrogramCanvasHEIGHT - ampPeakIndex), 1, 1);
    context.drawImage(tempCanvas, 0, 0, spectrogramCanvasWIDTH, spectrogramCanvasHEIGHT);
    spectrogramLeftPos++;
  }
    
}

var myColor = new chroma.ColorScale( 
{
colors: ["#000000", "#ff0000", "#ffff00", "#ffffff"], 
positions: [0, .25, .75, 1],
mode: "rgb",
limits:[0,300]
}
);



 // *******************************
//  Frequency analysis
// *******************************

 // Set values for peak rate 
function calculatePeak(i,value) {
       if( value > ampPeak)  {
          ampPeak = value;
          ampPeakIndex = i;
          ampPeakLength = 1;
          }
        else if( value == ampPeak && priorAmpPeak < value)  {
          ampPeakIndex = i;
          ampPeakLength = 1; 
          }  
        else if( value == ampPeak && priorAmpPeak == value)  {
          ampPeakLength++;
          }             
        priorAmpPeak = value;
  }

 // Get the frequency of a value.
function getValueToFrequency(tmpValue) {
  // Get the Nyquist frequency, ½ of the sampling rate.
  var nyquistFrequency = audioContext.sampleRate / 2; 
  // Map the index / bucket to a frequency.
  var freq = tmpValue * nyquistFrequency / analyser.frequencyBinCount;
  // Return the corresponding frequency.   
  frequencyAnalysisTable(freq); 
  return freq;
}

// Get the index value of a frequency.
function getFrequencyToIndex(freq) {
  // Get the Nyquist frequency, ½ of the sampling rate.
  var nyquistFrequency = audioContext.sampleRate / 2;
  // Maps the frequency to the correct bucket.
  var index = Math.round(freq / nyquistFrequency * analyser.frequencyBinCount);
  // Return the corresponding bucket.
  return index;
} 

// Insert rows in to frequenct analysis table for the first 5 seconds from start.
function frequencyAnalysisTable(freq){    
     if (freqPeak != freq && (analyser.context.currentTime - startTime) < 5 ) {
        var table = document.getElementById("frequencyAnalysisTable");      
          {
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = (analyser.context.currentTime - startTime);
            cell2.innerHTML = freq; 
            freqPeak = freq;       
          }
      }             
} 
    


