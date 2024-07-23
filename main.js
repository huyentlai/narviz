document.addEventListener('DOMContentLoaded', function() {
    d3.csv('NVDA.csv').then(function(data) {
        data.forEach(d => {
            d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
            d.Close = +d.Close;
            d.Volume = +d.Volume;
        });
        window.data = data;  // Make data available globally
        showOverview();  // Show overview on load
    });
});

// Define margins and dimensions
const margin = { top: 50, right: 50, bottom: 120, left: 120 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Tooltip div
const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

const cutOffDate = "2020-02-01"

function showOverview() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("The dataset gives informative context and details to understand these trends");

    // Chart 1: Closing Prices
    // createChart(window.data, "NVIDIA Stock Closing Prices (Jan 2017 - Jun 2022)", d => d.Close, "Closing Price (USD)", "Close", false);

    // Chart 2: Trading Volume
    // createChart(window.data, "NVIDIA Stock Trading Volume (Jan 2017 - Jun 2022)", d => d.Volume / 1e6, "Volume (Millions)", "Volume", false);

    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().domain(d3.extent(window.data, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(window.data, d => d.Close)]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    const line1 = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Close));

    const line2 = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Close));

    // Section 1: Jan 2017 - Mar 2020
    svg.append("path")
        .datum(window.data.filter(d => d.Date < new Date(cutOffDate)))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line1);

    // Section 2: Mar 2020 - Jun 2022
    svg.append("path")
        .datum(window.data.filter(d => d.Date >= new Date(cutOffDate) && d.Date <= new Date("2022-06-30")))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line2);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("NVIDIA Stock Overview");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Closing Price (USD)");

    // Annotations
    /*const annotations = [
        {
            type: d3.annotationCallout,
            // note: { title: "Crypto collapse and datahouse crisis", label: `High: ${financialCrisisPeak.High}` },
            note: { title: "Crypto collapse and datahouse crisis", label: "Annotation1" },
            x: x(new Date("2020-06-01")),
            y: y(window.data.find(d => d.Date.getTime() === new Date("2020-06-01").getTime()).Close),
            dy: -30,
            dx: 30
        },
        {
            note: { label: "Annotation2" },
            x: x(new Date("2021-09-01")),
            y: y(window.data.find(d => d.Date.getTime() === new Date("2021-09-01").getTime()).Close),
            dy: -30,
            dx: 30
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);*/

    const annotations = [
            {
                note: { label: "Plateau in stock price", title: "Cryto crash and datahouse crisis" },
                x: x(new Date("2019-01-01")),
                y: y(50),
                dy: -40,
                dx: 25
            },
            {
                note: { label: " Soar in stock price", title: "AI boom" },
                x: x(new Date("2021-10-01")),
                y: y(260),
                dy: -35,
                dx: -45
            }
        ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);

}

function showScene1() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 1 covers first period");

    const filteredData = window.data.filter(d => d.Date < new Date(cutOffDate));

    // Chart 1: Closing Prices
    createChart(filteredData, "NVIDIA Stock Closing Prices", d => d.Close, "Closing Price (USD)", "Close", true, "red", true);

    // Chart 2: Trading Volume
    createChart(filteredData, "NVIDIA Stock Trading Volume", d => d.Volume / 1e6, "Volume (Millions)", "Volume", false, "red", false);

}

function showScene2() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 2 covers first period");

    const filteredData = window.data.filter(d => d.Date >= new Date(cutOffDate));

    // Chart 1: Closing Prices
    createChart(filteredData, "NVIDIA Stock Closing Prices", d => d.Close, "Closing Price (USD)", "Close", true, "green", false);
    
    // Chart 2: Trading Volume
    createChart(filteredData, "NVIDIA Stock Trading Volume", d => d.Volume / 1e6, "Volume (Millions)", "Volume", false, "green", false);
}

function createChart(data, title, yValueAccessor, yAxisLabel, yField, addHoverEffect, chartColor, isScene1) {
    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right + 40)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, yValueAccessor)]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    if (isScene1) {
        const annotations = [
            {
                type: d3.annotationXYThreshold,
                note: {
                    title: `The market fell 40% over one year and two months.`,
                    label: `Plateau in closing price`,
                    align: "left",  // to align the text in the middle
                    wrap: width / 3  // to control the width of the text box
                },
                x: x(new Date("2018-12-01")),// x position is in the middle of the peak and bottom dates
                y: y(60),  // y position is in the middle of the peak and bottom prices
                dx: 0,  // offset in x direction
                dy: 0   // offset in y direction
            }
        ]; 
        const makeAnnotations = d3.annotation().annotations(annotations);
        svg.append("g").call(makeAnnotations);
    }
    else {
        const annotations = [
            {
                type: d3.annotationXYThreshold,
                note: {
                    title: `Improvement in data center`,
                    label: `Steady rise`,
                    align: "middle",  // to align the text in the middle
                    wrap: width / 3  // to control the width of the text box
                },
                x: x(new Date("2020-08-01")),// x position is in the middle of the peak and bottom dates
                y: y(190),  // y position is in the middle of the peak and bottom prices
                dx: 0,  // offset in x direction
                dy: 0   // offset in y direction
            },
            {
                note: { label: "Soar in stock price", title: "AI boom" },
                x: x(new Date("2021-10-01")),
                y: y(260),
                dy: -35,
                dx: -45
            }
        ]; 
        const makeAnnotations = d3.annotation().annotations(annotations);
        svg.append("g").call(makeAnnotations);
    }

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartColor)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.Date))
            .y(d => y(yValueAccessor(d)))
        );

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(title);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text(yAxisLabel);

    if (addHoverEffect) {
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(yValueAccessor(d)))
            .attr("r", 4)
            .attr("fill", "orange")
            .style("opacity", 0)
            .on("mouseover", function(event, d) {
                d3.select(this).transition().duration(50).style("opacity", .5);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Close:`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).transition().duration(50).style("opacity", 1);
                tooltip.transition().duration(200).style("opacity", 0);
            });
    }

    // Add fixed tooltips for highest and lowest points
    const highest = d3.max(data, yValueAccessor);
    const lowest = d3.min(data, yValueAccessor);
    const highestPoint = data.find(d => yValueAccessor(d) === highest);
    const lowestPoint = data.find(d => yValueAccessor(d) === lowest);

    addTooltip(svg, x, y, highestPoint, yValueAccessor, "Highest", yField);
        
    addTooltip(svg, x, y, lowestPoint, yValueAccessor, "Lowest", yField);
}

function addTooltip(svg, x, y, point, yValueAccessor, label, yField) {
    svg.append("circle")
        .attr("cx", x(point.Date))
        .attr("cy", y(yValueAccessor(point)))
        .attr("r", 5)
        .attr("fill", "black")
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${label}: ${yValueAccessor(point)} ${yField === "Volume" ? "M" : ""}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    svg.append("text")
        .attr("x", x(point.Date) + 10)  // Position to the right
        .attr("y", y(yValueAccessor(point)) + 5)  // Align vertically with the point
        .attr("text-anchor", "start")  // Align text to the start
        .style("font-size", "12px")
        .style("fill", "black")
        .text(`${label}: ${yValueAccessor(point).toFixed(2)}`);
}
