document.addEventListener('DOMContentLoaded', function() {
    d3.csv('NVDA.csv').then(function(data) {
        data.forEach(d => {
            d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
            d.Close = +d.Close;
            d.Volume = +d.Volume;
        });
        window.data = data;  
        showOverview(); 
    });
});

const margin = { top: 50, right: 50, bottom: 120, left: 120 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

const cutOffDate = "2020-02-01";
const cutOffDate1 = "2019-12-01";
const cutOffDate2 = "2021-12-10";

function showOverview() {
    d3.select("#visualization").html("");  
    d3.select("#visualization")
        .append("div")
        .attr("class", "description")
        .style("padding-left", "100px")  
        .style("padding-right", "100px") 
        .style("fill", "darkgrey")
        .style("font-size", "14px")  
        .html(`
            <h2 style="font-size: 18px;">Who is NVIDIA</h2>
            <p>NVIDIA is the inventor of GPU and is still a pioneer in this technology. The company "specializes in products and platforms" for multiple busines types and markets.</p>

            <h2 style="font-size: 18px;">NVIDIA Stock Performance Overview (mid-2017 to mid-2022)</h2>
            <p>NVIDIA over the 5 year span tells a magnificent story of ups and downs of the stock price of a leading technological company headquartered in Silicon Vallley. The stock adventures of NVIDIA over this span could be divided into three significantly different growth periods.</p>
            <p>Crypto Crash: the first 1.5 years of dealing with market turmoil and a crash effect that ended up in a fall sharp in the middle of a downward trend.</p>
            <p>Datacenter Bloom: an incredible recovery marked by huge surge in price.</p>
            <p>The Pullback: Long-term growth continues to thrive but general market challenges kept the stock price in check.</p>
            <p>Overall, the story of NVIDIA stock reflects the volatility and dynamic nature of the tech industry and is very interesting to observe and good motivation for further discussion. This chart is interactive and invites you to click on different color-coded line segments to discover more details as well as observation about the other data that could be useful for your own insights.</p>
            <p>The dataset that goes with this narrative was retried from <a href="https://www.kaggle.com/datasets/harshsingh2209/nvidia-stock-pricing-20172022?resource=download" target="_blank">Kaggle Data Source</a></p>
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
        .style("fill", "grey")
        .style("padding-bottom", "40px")
        .text("NVIDIA Stock Overview");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "grey")
        .text("Closing Price (USD)");

    const annotations = [
        {
            note: { label: "Decrease in stock price", title: "Crypto Crash" },
            x: x(new Date("2019-01-01")),
            y: y(50),
            dy: -40,
            dx: 25
        },
        {
            note: { label: "Volatile peak", title: "Datacenter + AI Boom" },
            x: x(new Date("2021-10-20")),
            y: y(250),
            dy: -35,
            dx: -45
        },
        {
            note: { label: "Drop and stabilize", title: "Fallback" },
            x: x(new Date("2022-03-01")),
            y: y(210),
            dy: 35,
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

    //Footnote
    d3.select("#visualization").append("div")
        .attr("class", "footer")
        .style("padding", "10px 20px")
        .style("font-size", "12px")
        .style("text-align", "center")
        .html(`
            <p>© 2024 by Huyen Lai - CS416. All rights reserved.</p>
            <p>References</p>
            <p><a href="https://www.nasdaq.com" target="_blank">Nasdaq</a> <br>
            <a href="https://www.investorplace.com" target="_blank">InvestorPlace</a> <br> 
            <a href="https://www.gartner.com/en/research/methodologies/gartner-hype-cycle" target="_blank">Gartner Hype Cycle</a><br>
            <a href="https://www.kaggle.com/datasets/harshsingh2209/nvidia-stock-pricing-20172022?resource=download" target="_blank">Kaggle Data Source</a>
            </p>
        `);

}

function showScene1() {
    d3.select("#visualization").html("");  
    d3.select("#visualization")
        .append("div")
        .attr("class", "description")
        .style("padding-left", "100px")  
        .style("padding-right", "100px") 
        .style("fill", "grey")
        .style("font-size", "14px")  
        .html(`
            <h2 style="font-size: 18px;">Crypto Crash (early 2018 to end of 2019)</h2>
            <p>Even thought there was increase in certain segments of this period, the overall trend was definitely downward considering the general market was forward-looking and compared to the company previous' strong growth. There were two main catalysts in this downward trend of closing price in Nvidia stock. They seemed like separate factors, but these two reasons are strongly tied together and they both had consequences that caused the decreasing trend to continue over these two years.</p>
            <p>First of all, the crypto burst or "Crypto Crash", i.e. the crash of the cryptocurrency market early 2018, has unanimously affected NVIDIA stock price. Cryptocurrency is heavily dependent on CPUs and GPUs. A slowing global economy as well as  escalating trade war between the USA with China have caused NVIDIA to have it steep drop in October 2018.</p>
            <p>But it didn't stop from there, NVIDIA stock price continued to drop drastically all the way to January 2019, because of the second catalyst - its third-quarter report release. This was disappointing to Wall Street, on which the company attributed this pummeling to the effects of a "crypto hangover". </p>
        `);

    const filteredData = window.data.filter(d => d.Date < new Date(cutOffDate1));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume: early 2018 to end of 2019",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Trading Volume (Millions)",
        true,
        "red",
        "grey",
        true,
        false,
        false
    );
}

function showScene2() {
    d3.select("#visualization").html("");  
    d3.select("#visualization")
        .append("div")
        .attr("class", "description")
        .style("padding-left", "60px")  
        .style("padding-right", "60px")
        .style("fill", "grey")
        .style("font-size", "14px")  
        .html(`
            <h2 style="font-size: 18px;">The Datacenter Boom: end of 2019 to early 2021</h2>
            <p>After the dreadful drop in price in the previous year, starting in mid-2019, NVIDIA's stock began to rise again. This whole period of time saw big jumps, and sometimes almost vertical increase, largely thanks to its data center game well-played, sophisticated high-end technology that answered the demand of big markets such as China's, and AI prospects. </p>
            <p>The super-jump in late 2021 could also be explained with a post-Covid-19 report release - a special circumstance where during the epidemic, more people had to stay work from home and needed better technology form their own connection. </p>
        `);

    const filteredData = window.data.filter(d => d.Date >= new Date(cutOffDate1) && d.Date < new Date(cutOffDate2));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume: end of 2019 to early 2021",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Trading Volume (Millions)",
        true,
        "green",
        "grey",
        false,
        true,
        false
    );
}

function showScene3() {
    d3.select("#visualization").html("");  
    d3.select("#visualization")
        .append("div")
        .attr("class", "description")
        .style("padding-left", "100px")  
        .style("padding-right", "100px")
        .style("fill", "grey")
        .style("font-size", "14px")  
        .html(`
            <h2 style="font-size: 18px;">The Pullback: early to mid 2022 </h2>
            <p>After reaching the highest point in their stock price, NVIDIA saw an almost immediate drop, but only to the same point as before the volatile peak. This could be due to several reasons which could explain this trend that is observed in our chart. </p>
            <p>Market correction came in first, this is general market adjusting to any tech hype, in this particular case, the AI hype. Some of this discussion could be found in the Gartner Hype Cycle website. <a href="https://www.gartner.com/en/research/methodologies/gartner-hype-cycle" target="_blank">Gartner Hype Cycle</a></p>
            <p>Supply chain problems came in second. The aftermath of Covid-19 manufacturing capacity and logistical disruptions have caused a global chip shortage, and NVIDIA also failed victim to this issue.</p>
            <p>Despite these issues, NVIDIA's stock closing price remained strong and stable at this period of time with good-looking growth prospects.
        `);

    const filteredData = window.data.filter(d => d.Date >= new Date(cutOffDate2));

    createChart(
        filteredData,
        "NVIDIA Stock Closing Prices and Trading Volume: Early to mid-2022",
        d => d.Close,
        "Closing Price (USD)",
        d => d.Volume / 1e6,
        "Trading Volume (Millions)",
        true,
        "blue",
        "grey",
        false,
        false,
        true
    );
}

function createChart(data, title, yValueAccessorLeft, yAxisLabelLeft, yValueAccessorRight, yAxisLabelRight, addHoverEffect, chartColorLeft, chartColorRight, isScene1, isScene2, isScene3) {
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
        .attr("stroke-dasharray", "2,2")  
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
        .attr("stroke-width", 0.8)  
        .attr("stroke-dasharray", "2,2")  
        .attr("d", lineRight);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", chartColorLeft)
        .attr("stroke-width", 2)
        .attr("d", lineLeft);


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("fill", "grey")
        .style("padding-bottom", "40px")
        .text(title);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "grey")
        .text(yAxisLabelLeft);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right + 40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "grey")
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
                tooltip.text(`Close: ${yValueAccessorLeft(d)} Volume: ${yValueAccessorRight(d).toFixed(2)}M`)  // Use text instead of html
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).transition().duration(100).style("opacity", 0);
                tooltip.transition().duration(500).style("opacity", 0);
            });
    }


    /*if (addHoverEffect) {
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
    }*/

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
                    title: `General downward trend`,
                    label: `Highest to Lowest point: NVIDIA's stock price fell 56% over about 3 months.`,
                    align: "left",
                    wrap: width / 3
                },
                x: x(new Date("2018-12-01")),
                y: yLeft(65),
                dx: 0,
                dy: 0
            },
            {
                note: { label: "The (AI) hype was real", title: "Vertical jump" },
                x: x(new Date("2018-02-15")),
                y: yLeft(42),
                dy: -35,
                dx: 45
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
                    title: `Big Boost by AI and market demand`,
                    label: `Lowest to highest point: A whooping jump of 680% in price`,
                    align: "middle",
                    wrap: width / 3
                },
                x: x(new Date("2020-08-01")),
                y: yLeft(220),
                dx: 0,
                dy: 0
            },
            {
                note: { label: "The (AI) hype was real", title: "Vertical jump" },
                x: x(new Date("2021-10-20")),
                y: yLeft(250),
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
    
    if (isScene3) {
        const annotations = [
            {
                type: d3.annotationXYThreshold,
                note: {
                    title: `Market Correction`,
                    label: `Highest to Lowest point: Dipped by 50%, and stabilized`,
                    align: "middle",
                    wrap: width / 3
                },
                x: x(new Date("2022-02-15")),
                y: yLeft(180),
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
    
    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150}, ${height + margin.top})`);  // Adjust the Y position closer to the chart
    
    // Left axis line legend
    legend.append("line")
        .attr("x1", 0)
        .attr("x2", 40)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", chartColorLeft)
        .attr("stroke-width", 2);
    
    legend.append("text")
        .attr("x", 50)
        .attr("y", 5)
        .text("Closing Price")
        .style("fill", "grey")
       .style("font-size", "14px")
        .attr("alignment-baseline", "middle");
    
    // Right axis line legend
    legend.append("line")
        .attr("x1", 0)
        .attr("x2", 40)
        .attr("y1", 20)
        .attr("y2", 20)
        .attr("stroke", chartColorRight)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");  // Make the legend line dotted
    
    legend.append("text")
        .attr("x", 50)
        .attr("y", 25)
        .text("Trading Volume")
        .style("fill", "grey")
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle");

    //add footnote
    d3.select("#visualization").append("div")
        .attr("class", "footer")
        .style("padding", "10px 20px")
        .style("font-size", "12px")
        .style("text-align", "center")
        .html(`
            <p>© 2024 by Huyen Lai - CS416. All rights reserved.</p>
            <p>References:</p>
            <p><a href="https://www.nasdaq.com" target="_blank">Nasdaq</a> <br>
            <a href="https://www.investorplace.com" target="_blank">InvestorPlace</a> <br> 
            <a href="https://www.gartner.com/en/research/methodologies/gartner-hype-cycle" target="_blank">Gartner Hype Cycle</a><br>
            <a href="https://www.kaggle.com/datasets/harshsingh2209/nvidia-stock-pricing-20172022?resource=download" target="_blank">Kaggle Data Source</a>
            </p>
        `);


    

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
