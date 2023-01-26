function init() {
  // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
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
      Object.entries(result).forEach(([id, metadata]) => {
        PANEL.append("h6").text(`${id.toUpperCase()}: ${metadata}`);
      });
  
    });
  }


// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
     // console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sampleData = data.metadata;
    
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = data.samples.filter((sampleObj) => sampleObj.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata.filter((sampleObj) => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
   

    var metaResult = metaArray[0];
    var result = resultArray[0];
    
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washing_frequency = metaResult.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
     var yticks = otuIDs
    .slice(0, 10)
    .map((otu_id) => ` OTU ${otu_id} `)
    .reverse();


    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        marker: {
          color: [
            'rgb(51, 153, 255)',
            'rgb(51, 110, 255)',
            'rgb(51, 73, 255)',
            'rgb(73, 51, 255)',
            'rgb(107, 51, 255)',
            'rgb(144, 51, 255)',
            'rgb(178, 51, 255)',
            'rgb(209, 51, 255)',
            'rgb(236, 51, 255)',
            'rgb(255, 51, 209)',
          ],
        },
  
        type: 'bar',
        orientation: 'h',
      },
    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
        title: {
        text: 'Top 10 Bacteria Cultures Found',
        font: { size: 24, color: 'rgb(33, 37, 41)' },
      },
      paper_bgcolor: 'rgb(189, 232, 218, 1)',
      plot_bgcolor: 'rgb(189, 232, 218, 1)',
      autosize: true,
      height: 400,
      xaxis: { automargin: true },
      yaxis: { automargin: true },
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var desired_maximum_marker_size = 100;
    var bubbleData = [
      {
        x: otuIDs,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          sizeref:
            (2.0 * Math.max(...sample_values)) / desired_maximum_marker_size ** 2,
          sizemode: 'area',
          color: otuIDs,
          colorscale: [
            [0, 'rgb(248, 77, 123)'],
            [1, 'rgb(36, 84, 164)'],
          ],
          opacity: 0.7,
        },
        type: 'scatter',
      },
    ];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: {
          text: 'Bacteria Cultures Per Sample',
          font: { size: 24, color: 'rgb(33, 37, 41)' },
        },
        paper_bgcolor: 'rgb(230, 204, 229, 1)',
        plot_bgcolor: 'rgb(230, 204, 229, 1)',
        autosize: true,
        height: 400,
        hovermode: otu_labels,
        xaxis: { label: 'OTU ID', automargin: true },
        yaxis: { automargin: true },
      };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
      // console.log(bubbleData['y']);
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washing_frequency,
          type: 'indicator',
          mode: 'gauge+number',
          gauge: {
            axis: { range: [null, 10] },
            steps: [
              { range: [0, 2], color: 'rgb(234, 48, 21, 1)' },
              { range: [2, 4], color: 'rgb(238, 150, 44, 1)' },
              { range: [4, 6], color: 'rgb(238, 231, 44, 1)' },
              { range: [6, 8], color: 'rgb(112, 222, 63, 1)' },
              { range: [8, 10], color: 'rgb(49, 123, 17, 1)' },
            ],
            bar: { color: 'black' },
          },
        },
      ];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
      var gaugeLayout = {
        title: {
          text: 'Belly Button Washing Frequency',
          font: { size: 24, color: 'rgb(33, 37, 41)' },
        },
        paper_bgcolor: 'rgb(232, 221, 189, 1)',
        plot_bgcolor: 'rgb(232, 221, 189, 1)',
        autosize: true,
        height: 400,
        xaxis: { automargin: true },
        yaxis: { automargin: true },
      };
      
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

     });
   }
