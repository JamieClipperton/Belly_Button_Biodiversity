function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
        var Result = samplesArray[0];

        var ids = Result.otu_ids;
        var labels = Result.otu_labels;
        var sampleValues = Result.sample_values.map((value) => parseInt(value));


        var yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        var barInfo = [
            {
                y: yticks,
                x: sampleValues.slice(0, 10).reverse(),
                text: labels.slice(0, 10).reverse(),
                type: "bar",
                orient:"h",
            }
        ];
        var barLooks = {
            title: "Top 10 Bacteria Cultures",
            margin: { t: 30, 1: 150},
            paper_bgcolor: "lightgrey",
            plot_bgcolor: "lightgrey"
        };
        Plotly.newPlot("bar", barInfo, barLooks);

        var bubbleInfo = [
            {
                x: ids, 
                y: sampleValues,
                text: labels,
                mode: "markers",
                marker: {
                    size: sampleValues,
                    color: ids,
                    colorscale: "viridis"
                }
            }
        ];

        var bubbleLooks = {
            title: "Bacteria Cultures per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            paper_bgcolor: "lightgrey",
            plot_bgcolor: "lightgrey"
        };
        Plotly.newPlot("bubble", bubbleInfo, bubbleLooks);

        var metadata = data.metadata.filter(data => data.id == sample);

        var washInfo = metadata[0].washInfo;

        var washGauge = [
            { value: washInfo,
              title: {text: "<br>Belly Button Washing Frequency</br><sup>Scrubs Per Week</sup>"},
              type: "indicator", 
              mode: "gauge+number",
              gauge: {
                axis: {range: [null, 10]},
                bar: {color: "black"},
                steps: [
                    {range: [0,2], color:"red"},
                    {range: [2,4], color:"orange"},
                    {range: [4,6], color:"yellow"},
                    {range: [6,8], color:"green"},
                    {range: [8,10], color:"blue"}
                ]
              }
              }
        ];

        var gaugeLooks = {
            width: 600,
            height: 500,
            margin: {t: 0, b: 0},
            paper_bgcolor: "lightgrey",
            plot_bgcolor: "lightgrey"
        };
        Plotly.newPlot("gauge", washGauge, gaugeLooks);
    });
}