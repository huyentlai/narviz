// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Load your dataset
    d3.csv('path/to/your/data.csv').then(function(data) {
        // Process data and initialize visualization
        console.log(data);
        scenes[0]();  // Initialize the first scene
    });
});

// Define parameters
let currentScene = 0;

// Define scenes
const scenes = [
    function scene1() {
        d3.select("#visualization").html("");  // Clear previous scene
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        // Add D3 code to create your visualization for scene 1
        // Example: A simple bar chart
        const data = [10, 20, 30, 40, 50];
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 50)
            .attr("y", d => 600 - d * 10)
            .attr("width", 40)
            .attr("height", d => d * 10)
            .attr("fill", "steelblue");
    },
    function scene2() {
        d3.select("#visualization").html("");  // Clear previous scene
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        // Add D3 code to create your visualization for scene 2
        // Example: A simple line chart
        const data = [10, 20, 30, 40, 50];
        const line = d3.line()
            .x((d, i) => i * 100)
            .y(d => 600 - d * 10);

        svg.append("path")
            .datum(data)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);
    }
    // Add more scenes as needed
];

// Define triggers
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight") {
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene]();
    } else if (event.key === "ArrowLeft") {
        currentScene = (currentScene - 1 + scenes.length) % scenes.length;
        scenes[currentScene]();
    }
});
