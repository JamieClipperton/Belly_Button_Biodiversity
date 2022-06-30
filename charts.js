function init() {
    var grabber = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleInfo = data.names;

        sampleInfo.forEach((sample) => {
            grabber
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        
        var initialSample = sampleInfo[0];
        buildCharts(initialSample);
        buildMetadata(initialSample);
    });
}
