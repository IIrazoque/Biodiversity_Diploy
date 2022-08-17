function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredSamples[0];

    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuids = result.otu_ids;
    var otulabels = result.out_labels;
    var samplevalues = result.sample_values.slice(0,10).reverse(); 

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: samplevalues,
      y: yticks,
      marker: {
        color: "#FFA399"
      },
      type: "bar",
      orientation: "h",
      text: otulabels
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Found in Belly Buttons"
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


//--------------- BuBBLE CHART --------------------//

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuids,
      y: samplevalues,
      text: otulabels,
      mode: "markers",
      marker: {
        color: samplevalues,
        size: samplevalues,
        colorscale: "Magma"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture per Sample",
      x: {title: "Bacteria reference ID"},
      hovermode: true
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)


  //-------------- GAUGE CHART -----------------------//
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;

    // Create a variable that holds the first sample in the array.
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);


    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];


    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    

    // 3. Create a variable that holds the washing frequency.
    var wfreqs = gaugeResult.wfreq;
    // Create the yticks for the bar chart.

    // Use Plotly to plot the bar data and layout.
    //Plotly.newPlot();
    
    // Use Plotly to plot the bubble data and layout.
    //Plotly.newPlot();
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Belly Button Washing Frequency <br></br> Weekly Scrubs"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},

        bar: {
          color: "white", width: 5},
        steps:[
          {range: [0, 2], color: "#E7BDB8"},
          {range: [2, 4], color: "#FFA399"},
          {range: [4, 6], color: "#E57266"},
          {range: [6, 8], color: "#B24C68"},
          {range: [8, 10], color: "#B23355"}
        ],
        dtick: 2
      }
    }];
 
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
