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

function showOverview() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("The dataset gives informative context and details to understand these trends");

    // Chart 1: Closing Prices
    createChart(window.data, "NVIDIA Stock Closing Prices (Jan 2017 - Jun 2022)", d => d.Close, "Closing Price (USD)", "Close", false);

    // Chart 2: Trading Volume
    createChart(window.data, "NVIDIA Stock Trading Volume (Jan 2017 - Jun 2022)", d => d.Volume / 1e6, "Volume (Millions)", "Volume", false);

    const annotations1 = [
        {
            note: { label: "Drop due to market correction", title: "Market Event" },
            x: x(new Date("2020-06-01")),
            y: y(110),
            dy: -50,
            dx: 50
        }
    ];

    const makeAnnotations1 = d3.annotation().annotations(annotations1);
    svg.append("g").call(makeAnnotations1);

    const annotations2 = [
        {
            note: { label: "Drop due to market correction", title: "Market Event" },
            x: x(new Date("2020-03-01")),
            y: y(210),
            dy: -10,
            dx: 10
        }
    ];

    const makeAnnotations2 = d3.annotation().annotations(annotations2);
    svg.append("g").call(makeAnnotations2);

}

function showScene1() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 1 covers first period");

    const filteredData = window.data.filter(d => d.Date < new Date("2021-03-01"));

    // Chart 1: Closing Prices
    createChart(filteredData, "NVIDIA Stock Closing Prices (Jan 2017 - Mar 2021)", d => d.Close, "Closing Price (USD)", "Close", true);

    // Chart 2: Trading Volume
    createChart(filteredData, "NVIDIA Stock Trading Volume (Jan 2017 - Mar 2021)", d => d.Volume / 1e6, "Volume (Millions)", "Volume", false);

}

function showScene2() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 2 covers first period");

    const filteredData = window.data.filter(d => d.Date >= new Date("2021-03-01"));

    // Chart 1: Closing Prices
    createChart(filteredData, "NVIDIA Stock Closing Prices (Mar 2021 - End of Period)", d => d.Close, "Closing Price (USD)", "Close", true);

    // Chart 2: Trading Volume
    createChart(filteredData, "NVIDIA Stock Trading Volume (Mar 2021 - End of Period)", d => d.Volume / 1e6, "Volume (Millions)", "Volume", false);
}

function createChart(data, title, yValueAccessor, yAxisLabel, yField, addHoverEffect) {
    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, yValueAccessor)]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
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
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Date");

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
            .attr("fill", "red")
            .style("opacity", 0)
            .on("mouseover", function(event, d) {
                d3.select(this).transition().duration(100).style("opacity", 1);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Date: ${d3.timeFormat("%B %d, %Y")(d.Date)}<br>Close: ${d.Close}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).transition().duration(100).style("opacity", 0);
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    
    // Add tooltips for highest and lowest points
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
        .attr("fill", "red")
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
        .attr("x", x(point.Date))
        .attr("y", y(yValueAccessor(point)) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "red")
        .text(label);
}
