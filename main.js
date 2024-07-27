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

const cutOffDate = "2020-02-01";

function showOverview() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("The dataset gives informative context and details to understand these trends");

    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().domain(d3.extent(window.data, d => d.Date)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(window.data, d => d.Close)]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Close));

    // Section 1: Jan 2017 - Mar 2020
    svg.append("path")
        .datum(window.data.filter(d => d.Date < new Date(cutOffDate)))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 4);
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html("Click to see detailed view of Stable Period")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("stroke-width", 2);
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .on("click", function() {
            showScene1();
        });

    // Section 2: Mar 2020 - Jun 2022
    svg.append("path")
        .datum(window.data.filter(d => d.Date >= new Date(cutOffDate) && d.Date <= new Date("2022-06-30")))
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 4);
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html("Click to see detailed view of AI boom")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("stroke-width", 2);
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .on("click", function() {
            showScene2();
        });

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
    const annotations = [
        {
            note: { label: "Plateau in stock price", title: "Crypto crash and datahouse crisis" },
            x: x(new Date("2019-01-01")),
            y: y(50),
            dy: -40,
            dx: 25
        },
        {
            note: { label: "Soar in stock price", title: "AI boom" },
            x: x(new Date("2021-10-01")),
            y: y(260),
            dy: -35,
            dx: -45
        }
    ];

    const makeAnnotations = d3.annotation()
        .annotations(annotations)
        .editMode(false)
        .notePadding(15)
        .type(d3.annotationCalloutElbow)
        .accessors({
            x: d => x(new Date(d.Date)),
            y: d => y(d.Close)
        })
        .annotations(annotations.map(annotation => {
            annotation.color = "orange";  // Set annotation color to orange
            return annotation;
        }));
    svg.append("g").call(makeAnnotations);
}

function showScene1() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 1 covers first period");

    const filteredData = window.data.filter(d => d.Date < new Date(cutOffDate));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume (Jan 2017 - Mar 2020)",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Volume (Millions)",
        true,
        "red",
        "grey",
        true,
        false
    );
}

function showScene2() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 2 covers second period");

    const filteredData = window.data.filter(d => d.Date >= new Date(cutOffDate));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume (Mar 2020 - Jun 2022)",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Volume (Millions)",
        true,
        "green",
        "grey",
        false,
        true
    );
}

function createChart(data, title, yValueAccessorLeft, yAxisLabelLeft, yValueAccessorRight, yAxisLabelRight, addHoverEffect, chartColorLeft, chartColorRight, isScene1, isScene2) {
    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right + 40)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, width]);
    const yLeft = d3.scaleLinear().domain([0, d3.max(data, yValueAccessorLeft)]).range([height, 0]);
    const yRight = d3.scaleLinear().domain([0, d3.max(data, yValueAccessorRight)]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(yLeft));
    svg.append("g").attr("transform", "translate(" + width + ",0)").call(d3.axisRight(yRight));

    const lineLeft = d3.line()
        .x(d => x(d.Date))
        .y(d => yLeft(yValueAccessorLeft(d)));

    const lineRight = d3.line()
        .x(d => x(d.Date))
        .y(d => yRight(yValueAccessorRight(d)));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartColorLeft)
        .attr("stroke-width", 2)
        .attr("d", lineLeft);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartColorRight)
        .attr("stroke-width", 2)
        .attr("d", lineRight);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(title);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left - 80)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text(yAxisLabelLeft);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right - 80)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text(yAxisLabelRight);

    if (addHoverEffect) {
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => yLeft(yValueAccessorLeft(d)))
            .attr("r", 4)
            .attr("fill", "yellow")
            .style("opacity", 0)
            .on("mouseover", function(event, d) {
                d3.select(this).transition().duration(100).style("opacity", 1);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Close: ${yValueAccessorLeft(d)}<br>Volume: ${yValueAccessorRight(d).toFixed(2)}M`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).transition().duration(100).style("opacity", 0);
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }

    // Add fixed tooltips for highest and lowest points
    const highest = d3.max(data, yValueAccessorLeft);
    const lowest = d3.min(data, yValueAccessorLeft);
    const highestPoint = data.find(d => yValueAccessorLeft(d) === highest);
    const lowestPoint = data.find(d => yValueAccessorLeft(d) === lowest);

    addTooltip(svg, x, yLeft, highestPoint, yValueAccessorLeft, "Highest", yAxisLabelLeft);
    addTooltip(svg, x, yLeft, lowestPoint, yValueAccessorLeft, "Lowest", yAxisLabelLeft);

    if (isScene1) {
        const annotations = [
            {
                type: d3.annotationXYThreshold,
                note: {
                    title: `The market fell 40% over one year and two months.`,
                    label: `Plateau in closing price`,
                    align: "left",
                    wrap: width / 3
                },
                x: x(new Date("2018-12-01")),
                y: yLeft(60),
                dx: 0,
                dy: 0
            }
        ];
        const makeAnnotations = d3.annotation()
            .annotations(annotations)
            .editMode(false)
            .notePadding(15)
            .type(d3.annotationCalloutElbow)
            .accessors({
                x: d => x(new Date(d.Date)),
                y: d => y(d.Close)
            })
            .annotations(annotations.map(annotation => {
                annotation.color = "orange";  // Set annotation color to orange
                return annotation;
            }));
        svg.append("g").call(makeAnnotations);
    }

    if (isScene2) {
        const annotations = [
            {
                type: d3.annotationXYThreshold,
                note: {
                    title: `Improvement in data center`,
                    label: `Steady rise`,
                    align: "middle",
                    wrap: width / 3
                },
                x: x(new Date("2020-08-01")),
                y: yLeft(190),
                dx: 0,
                dy: 0
            },
            {
                note: { label: "Soar in stock price", title: "AI boom" },
                x: x(new Date("2021-11-01")),
                y: yLeft(260),
                dy: -35,
                dx: -45
            }
        ];
        const makeAnnotations = d3.annotation().annotations(annotations);
        svg.append("g").call(makeAnnotations);
    }
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
        .attr("x", x(point.Date) + 10)
        .attr("y", y(yValueAccessor(point)) + 5)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("fill", "black")
        .text(`${label}: ${yValueAccessor(point).toFixed(2)}`);
}
