/*
    document.addEventListener('DOMContentLoaded', function() {
    d3.csv('https://flunky.github.io/cars2017.csv').then(function(data) {
        console.log(data);
        scenes[0](); 
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
];

document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight") {
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene]();
    } else if (event.key === "ArrowLeft") {
        currentScene = (currentScene - 1 + scenes.length) % scenes.length;
        scenes[currentScene]();
    }
});
*/

async function init() {

const data = await d3.csv("https://flunky.github.io/cars2017.csv");
const margin = {top: 50, right: 50, bottom: 50, left: 50}, width = 200, height = 200;
const translateX = margin.left + width;

const svg = d3.select("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);


const x = d3.scaleLog()
.base(10)
.domain([10, 150])
.range([0, width]);

const y = d3.scaleLog()
.base(10)
.domain([10, 150])
.range([height, 0]);

const yAxis = d3.axisLeft(y)
.tickValues([10, 20, 50, 100])
.tickFormat(d3.format("~s"));

const xAxis = d3.axisBottom(x)
.tickValues([10, 20, 50, 100])
.tickFormat(d3.format("~s"));

svg.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", d => x(d.AverageCityMPG))
.attr("cy", d => y(d.AverageHighwayMPG))
.attr("r", d => 2 + (+d.EngineCylinders))

svg.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`)
.call(yAxis);

svg.append("g")
.attr("transform", `translate(${margin.left},${translateX})`)
.call(xAxis);
}
init()
