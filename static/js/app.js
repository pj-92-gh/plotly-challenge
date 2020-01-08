//Handle changes to dropdown

function optionChanged(id) {
    createStuff(id);
}

//Main function that creates metadata table and plots graphs

function createStuff(id) {
    d3.json("samples.json").then((data)=> {

        //Populate metadata
        
        var meta_match = data.metadata.filter(m => m.id.toString() === id)[0]
        var metaInfo = d3.select("#sample-metadata")
        metaInfo.html("")
        Object.entries(meta_match).forEach((key) => {   
            metaInfo.append("h5").text(key[0] + " : " + key[1] + "\n") 
        })

        //Start searching for the samples
        var sample_match = data.samples.filter(s => s.id.toString() === id)[0]
        console.log(sample_match)

        //Values
        var sample_values = sample_match.sample_values.slice(0,10).reverse()
        console.log(sample_values)

        //OTU Ids
        var OTU = sample_match.otu_ids.slice(0,10).reverse()
        var otu_clean = OTU.map(o => "OTU " + o)
        console.log(otu_clean)
        
        //Labels
        var sample_labels = sample_match.otu_labels.slice(0,10).reverse()
        console.log(sample_labels)

        //Create the Bar Chart
        var trace = {
            x: sample_values,
            y: otu_clean,
            text: sample_labels,
            type: 'bar',
            orientation: 'h'
        }

        var data = [trace]

        var layout = {
            title: "Top 10 OTU",
            xaxis: {
                title: "Sample Values"
            },
            yaxis: {
                title: "OTUs"
            },
            width: 900
        }
        //Plot Bar
        Plotly.newPlot("bar", data, layout)

        //Create the Bubble Chart
        var trace1 = {
            x: sample_match.otu_ids,
            y: sample_match.sample_values,
            mode: 'markers',
            markers: {
                size: [sample_match.sample_values],
                color: sample_match.otu_ids
            },
            text: sample_match.sample_labels
        }

        var layout_1 = {
            height: 500,
            width: 1100,
            title: "Bubbles for OTU"
        }

        var data1 = [trace1]
        //Plot bubbles
        Plotly.newPlot("bubble", data1, layout_1)

    })
}

//Initialize page
function init() {
    var dropDownMenu = d3.select("#selDataset")
    d3.json("samples.json").then((data)=> {
        data.names.forEach(function(d) {
            dropDownMenu.append("option").text(d).property("value")
        })
        createStuff(data.names[0])
    })
}
init()