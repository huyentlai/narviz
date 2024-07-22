document.addEventListener('DOMContentLoaded', function() {
    d3.csv('NVDA.csv').then(function(data) {
        data.forEach(d => {
            d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
            d.Close = +d.Close;
            d.Volume = +d.Volume;
        });
        scenes[0](data);  // Initialize the first scene with data

        // Add event listeners for scene buttons
        document.getElementById('scene1Btn').addEventListener('click', function() {
            scenes[0](data);
        });

        document.getElementById('scene2Btn').addEventListener('click', function() {
            scenes[1](data);
        });

        document.getElementById('scene3Btn').addEventListener('click', function() {
            scenes[2](data);
        });
    });
});

// Define parameters
let currentScene = 0;

// Define scenes
const scenes = [scene1, scene2, scene3];

function scene1(data) {
    d3.select("#visualization").html("");  // Clear previous scene
    const svg = d3.select("#visualization").append("svg")
        .attr("width", 800)
        .attr("height", 600)
        .append("g")
        .attr("transform", "translate(50,50)");

    const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, 700]);
    const y = d3.scaleLinear().domain([d3.min(data, d => d.Close), d3.max(data, d => d.Close)]).range([500, 0]);

    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Close));

    svg.append("g").attr("transform", "translate(0,500)").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("text")
        .attr("x", 350)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("NVIDIA Stock Closing Prices");

    svg.append("text")
        .attr("x", 350)
        .attr("y", 540)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Date");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -250)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Closing Price (USD)");

    const annotations = [
        {
            note: { label: "Significant rise in stock price", title: "Major Event" },
            x: x(new Date("2019-12-01")),
            y: y(240),
            dy: -50,
            dx: -50
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);
}
