// Assign website to an url variable

const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Build the metadata panel

function buildMetadata(sample)

{d3.json(url).then
  ((data) => 
   
   {// get the metadata field

    let metadata = data.metadata;
    
    // Filter the metadata for the object with the desired sample number

    let filteredData1 = metadata.filter(metadata => metadata.id == sample);
    console.log(filteredData1);

    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    let newTags = filteredData1[0]
    Object.entries(newTags).forEach(([key, value]) => 
      {panel.append("p").text (`${key}: ${value}`);});
   }
  );
}

// function to build both charts

function buildChart(sample) 
{
  d3.json(url).then((data) => {

    // Get the samples field

    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
  
    let filteredData2 = samples.filter(samples => samples.id == sample)[0];
    console.log(filteredData2);

    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = filteredData2.otu_ids;
    let otu_labels = filteredData2.otu_labels;
    let sample_values = filteredData2.sample_values;

    // Build a Bubble Chart

    let bubbleTrace = 
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: 
      {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Electric'
      }
    };
    let bubblelayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
      height: 500,
      width: 1200,
    };
    
    // Render the Bubble Chart

    Plotly.newPlot('bubble', [bubbleTrace], bubblelayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: 'h'
    };
    console.log(barTrace);

    let barlayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: "Number of Bacteria"},
    };

    // Render the Bar Chart

    Plotly.newPlot('bar', [barTrace], barlayout);
  });
}

// Function to run on page load

function init() 

{d3.json(url).then((data) => 

  { // Get the names field

    let names = data.names
    console.log(names); 

    // Use d3 to select the dropdown with id of `#selDataset`

    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    names.forEach(name => 
      {dropdown.append("option").text(name).property("value", name);});

    // Get the first sample from the list

    let firstSample = names[0];
    console.log(firstSample);

    // Build charts and metadata panel with the first sample

    buildChart(firstSample);
    buildMetadata(firstSample);
 });
}

// Function for event listener

function optionChanged(newSample) 

{ //Get the new sample from the list

  console.log(newSample);

  // Build charts and metadata panel each time a new sample is selected

  buildChart(newSample);
  buildMetadata(newSample); 
}

// Initialize the dashboard

init();
