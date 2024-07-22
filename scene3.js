document.addEventListener('DOMContentLoaded', function() {
    d3.csv('NVDA.csv').then(function(data) {
        data.forEach(d => {
            d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
            d.Close = +d.Close;
            d.Volume = +d.Volume;
        });
        scenes[0](data);  // Initialize the first scene with data

        // Add event listeners for navigation buttons
        document.getElementById('prevBtn').addEventListener('click', function() {
            currentScene = (currentScene - 1 + scenes.length) % scenes.length;
            scenes[currentScene](data);
        });

        document.getElementById('nextBtn').addEventListener('click', function() {
            currentScene = (currentScene + 1) % scenes.length;
            scenes[currentScene](data);
        });
    });
});

// Define parameters
let currentScene = 0;

// Define scenes
const scenes = [scene1, scene2, scene3];

function scene3(data) {
    d3.select("#visualization").html("");  // Clear previous scene
    const svg = d3.select("#visualization").append("svg")
        .attr("width", 800)
        .attr("height", 600)
        .append("g")
        .attr("transform", "translate(50,50)");

    const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([0, 700]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Volume)]).range([500, 0]);

    svg.append("g").attr("transform", "translate(0,500)").call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")));
    svg.append("g").call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => x(d.Date))
            .y(d => y(d.Volume))
        );

    svg.append("text")
        .attr("x", 350)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("NVIDIA Stock Trading Volume");

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
        .text("Volume");

    const annotations = [
        {
            note: { label: "Highest trading volume", title: "Volume Peak" },
            x: x(new Date("2020-02-20")),
            y: y(300000000),
            dy: -50,
            dx: 50
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);
}
