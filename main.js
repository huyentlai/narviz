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
const cutOffDate1 = "2019-12-01";
const cutOffDate2 = "2021-12-10";

function showOverview() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").html(`
            <h2>NVIDIA Stock Performance Overview</h2>
            <p>NVIDIA's stock performance from early 2018 to mid-2022 encapsulates the volatility and dynamism inherent in the technology sector. This period can be divided into three significant phases marked by distinct trends and driving factors. Initially, from early 2018 to mid-2019, NVIDIA faced a sharp decline in stock price largely due to external market forces. The collapse of the cryptocurrency market led to an oversupply of GPUs, which, coupled with the impact of the US-China trade war, significantly hindered NVIDIA’s growth. The inventory overhang and increased costs due to tariffs added to the pressure, causing the stock to plunge​ (Nasdaq)​​ (InvestorPlace)​.</p>
            <p>The subsequent period from mid-2019 to early 2021 marked a significant recovery for NVIDIA, driven by the burgeoning data center business and the rise of AI and machine learning applications. During this phase, NVIDIA capitalized on the growing demand for its GPUs, which became essential in various high-performance computing applications. The COVID-19 pandemic further accelerated this demand as more businesses and individuals turned to digital solutions, boosting NVIDIA’s gaming and data center segments. This robust growth led to a steady increase in stock price, showcasing the company's resilience and strategic positioning in the tech industry​ (InvestorPlace)​​ (Nasdaq)​.</p>
            <p>The final phase from early 2021 to mid-2022 saw NVIDIA’s stock reaching its peak before experiencing increased volatility and a general decline. This period was marked by significant market corrections within the tech sector, coupled with NVIDIA facing supply chain issues and regulatory scrutiny over its proposed acquisition of ARM. Despite these challenges, the company's long-term growth prospects remained strong, driven by the continued expansion in AI and data center markets. However, the immediate market reactions to these challenges led to a pullback in stock price, reflecting the broader uncertainties in the tech industry​ (Nasdaq)​​ (InvestorPlace)​.</p>
        `);
    
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

    svg.append("path")
        .datum(window.data.filter(d => d.Date < new Date(cutOffDate1)))
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

    svg.append("path")
        .datum(window.data.filter(d => d.Date >= new Date(cutOffDate1) && d.Date < new Date(cutOffDate2)))
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

    svg.append("path")
        .datum(window.data.filter(d => d.Date >= new Date(cutOffDate2)))
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-width", 4);
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html("Click to see detailed view of Recent Period")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("stroke-width", 2);
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .on("click", function() {
            showScene3();
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
            annotation.color = "orange";
            return annotation;
        }));
    svg.append("g").call(makeAnnotations);
}

function showScene1() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("In 2018, NVIDIA experienced a significant downturn primarily due to the collapse of the cryptocurrency market. The company had heavily invested in producing GPUs for crypto mining, and the sudden drop in cryptocurrency prices led to a decrease in demand for these products. Additionally, NVIDIA faced an inventory overhang problem as GPUs piled up unsold. Another contributing factor was the escalating trade war between the US and China, which caused global semiconductor demand to drop and increased costs due to tariffs​ (Nasdaq)​​ (InvestorPlace)​.");

    const filteredData = window.data.filter(d => d.Date < new Date(cutOffDate1));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume Period 1",
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
    d3.select("#visualization").append("div").attr("class", "description").text("NVIDIA's stock began to recover in mid-2019, driven by robust growth in its data center business. The company's GPUs became essential for AI and machine learning applications, leading to higher sales and improved profitability. The COVID-19 pandemic further accelerated the adoption of digital technologies, boosting demand for NVIDIA's products. The company also benefitted from the strong performance of its gaming segment, driven by the launch of new GPUs and the overall increase in gaming activity during the pandemic​ (InvestorPlace)​​ (Nasdaq)​.");

    const filteredData = window.data.filter(d => d.Date >= new Date(cutOffDate1) && d.Date < new Date(cutOffDate2));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume Period 2",
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

function showScene3() {
    d3.select("#visualization").html("");  // Clear previous content
    d3.select("#visualization").append("div").attr("class", "description").text("Scene 3 covers third period");

    const filteredData = window.data.filter(d => d.Date >= new Date(cutOffDate2));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume Period 3",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Volume (Millions)",
        true,
        "blue",
        "grey",
        false,
        false
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
    //svg.append("g").attr("transform", "translate(" + width + ",0)").call(d3.axisRight(yRight));
    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yRight))
        .selectAll("path")
        .attr("stroke-dasharray", "2,2")  // Make the axis line dotted
        .attr("stroke-width", 0.8); 
    
    const lineLeft = d3.line()
        .x(d => x(d.Date))
        .y(d => yLeft(yValueAccessorLeft(d)));

    const lineRight = d3.line()
        .x(d => x(d.Date))
        .y(d => yRight(yValueAccessorRight(d)));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartColorRight)
        .attr("stroke-width", 2)
        .attr("stroke-width", 0.8)  // Make the line thinner
        .attr("stroke-dasharray", "2,2")  // Make the line dashed
        .attr("d", lineRight);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartColorLeft)
        .attr("stroke-width", 2)
        .attr("d", lineLeft);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -100)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("fill", "lightgray")
        .text(title);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "lightgray")
        .text(yAxisLabelLeft);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "lightgray")
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
                annotation.color = "orange";
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
                annotation.color = "orange";
                return annotation;
            }));
        svg.append("g").call(makeAnnotations);
    }
}

function addTooltip(svg, x, y, point, yValueAccessor, label, yField) {
    svg.append("circle")
        .attr("cx", x(point.Date))
        .attr("cy", y(yValueAccessor(point)))
        .attr("r", 5)
        .attr("fill", "orange")
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
        .style("fill", "orange")
        .text(`${label}: ${yValueAccessor(point).toFixed(2)}`);
}
