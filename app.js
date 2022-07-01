function plots(sampleId) {
    d3.json("samples.json").then(data => {
        var cleanedInfo = data.samples.filter(d => d.id == sampleId);
        console.log(cleanedInfo);

        var sap_val = cleanedInfo[0].sap_val;
        var otu_ids = cleanedInfo[0].otu_ids;
        var otu_labels= cleanedInfo[0].otu_labels;
        var otu_id_label= otu_ids.map(x => "OTU " + x);
        var washInfo = data.metadata.filter(d => d.id == sampleId)[0].washInfo;

        // Bar Chart
        var traceBar = {
            x: sap_val.slice(0,10).reverse(),
            y: otu_id_label.slice(0,10).reverse(),
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };

        var dataBar = [traceBar];

        var layoutBar = {
            height: 500,
            width: 500
            }

        Plotly.newPlot("bar", dataBar, layoutBar);
        
        // Bubble Plot
        var traceBubble = {
            x: otu_ids,
            y: sap_val,
            mode: "markers",
            marker: {
                size: sap_val,
                color: otu_ids
            },
            text: otu_labels
        };

        var dataBubble = [traceBubble];

        var layoutBubble = {
            xaxis:{
                title: "OTU ID"
            },
            height: 700,
            width: 1200
        }

        Plotly.newPlot("bubble", dataBubble, layoutBubble);

        // Gauge Chart
        var level = washInfo * 20;

        var degrees = 180 - level, radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        var mainPath = "M -.0 -0.05 L .0 0.05 L ";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var traceGauge = [
            {
                type: "scatter",
                x: [0],
                y: [0],
                marker: {
                    size: 12, color: "850000"
                },
                showlegend: false,
                name: "Washes",
                text: washInfo,
                hoverinfo: "text+name"
            },
            {
              values: [1, 1, 1, 1, 1, 1, 1, 1 ,1, 9],
              rotation: 90,
              text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              textinfo: "text",
              textposition: "inside",
              marker: {
                colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
                ]
              },
              labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              hoverinfo: "label",
              hole: 0.5,
              type: "pie",
              showlegend: false
            }
        ];

        var layoutGauge = {
            shapes: [
                {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                    color: "850000"
                }
                }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week",
            height: 700,
            width: 700,
            xaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
            };
        
            // Plot gauge chart
            Plotly.newPlot('gauge', traceGauge, layoutGauge); 
        });

}

// Function to get demographic information table
function demographicInfo(subjectId) {
    // Read the json file to get data
        d3.json("samples.json").then((data)=> {

            // Metadata info for the demographic info
            var metadata = data.metadata;
    
            // Filter info by subjectId
            var result = metadata.filter(meta => meta.id.toString() == subjectId)[0];
            
            // Insert into sample-metadata
            var demographicInfo = d3.select("#sample-metadata");
            
            // Remove text from demographic info
            demographicInfo.html("");
    
            // Append info to panel
            Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toLowerCase() + ": " + key[1] + "\n");    
            });
        });
    }


// Function to initialise page plots
function init() {
    // Read json data
    d3.json("samples.json").then((data) => {
        
        // Select drop down menu
        var dropDownMenu = d3.select("#selDataset");

        // Get subjectId from dropdown
        data.names.forEach(function (name) {
            dropDownMenu.append("option").text(name).property("value");
        });
        
        // Call functions to plot graphs and show subject info
        plots(data.names[0]);
        demographicInfo(data.names[0]);
    });
}


// Function to change plots
function optionChanged(){
    // Select drop down menu
    var dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    var subjectId = parseInt(dropdownMenu.property("value"));

    // Call back functions to update plots
    plots(subjectId);
    demographicInfo(subjectId);
}

// Initialise page
init();