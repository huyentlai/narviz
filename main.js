document.addEventListener('DOMContentLoaded', function() {
    d3.csv('NVDA.csv').then(function(data) {
        data.forEach(d => {
            d.Date = new Date(d.Date);
            d.Close = +d.Close;
        });
        scenes[0](data);  // Initialize the first scene with data
    });
});

let currentScene = 0;

const scenes = [
    function scene1(data) {
        d3.select("#visualization").html("");  // Clear previous scene
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([50, 750]);
        const y = d3.scaleLinear().domain([d3.min(data, d => d.Close), d3.max(data, d => d.Close)]).range([550, 50]);

        const line = d3.line()
            .x(d => x(d.Date))
            .y(d => y(d.Close));

        svg.append("g").attr("transform", "translate(0,550)").call(d3.axisBottom(x));
        svg.append("g").attr("transform", "translate(50,0)").call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

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
    },
    function scene2(data) {
        d3.select("#visualization").html("");  // Clear previous scene
        const svg = d3.select("#visualization").append("svg")
            .attr("width", 800)
            .attr("height", 600);

        const x = d3.scaleTime().domain(d3.extent(data, d => d.Date)).range([50, 750]);
        const y = d3.scaleLinear().domain([d3.min(data, d => d.Close), d3.max(data, d => d.Close)]).range([550, 50]);

        const line = d3.line()
            .x(d => x(d.Date))
            .y(d => y(d.Close));

        svg.append("g").attr("transform", "translate(0,550)").call(d3.axisBottom(x));
        svg.append("g").attr("transform", "translate(50,0)").call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        const annotations = [
            {
                note: { label: "Drop due to market correction", title: "Market Event" },
                x: x(new Date("2020-03-01")),
                y: y(210),
                dy: -50,
                dx: 50
            }
        ];

        const makeAnnotations = d3.annotation().annotations(annotations);
        svg.append("g").call(makeAnnotations);
    }

];

// Define triggers
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight") {
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene](data);
    } else if (event.key === "ArrowLeft") {
        currentScene = (currentScene - 1 + scenes.length) % scenes.length;
        scenes[currentScene](data);
    }
});
