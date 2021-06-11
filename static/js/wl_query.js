let modes = ["Subway", "Tram", "Bus"]


function initSelectors() {
    d3.select(".selector")
        .append("div").attr("class", "select-wrapper")
        .append("select").selectAll()
        .data(modes)
        .enter()
        .append("option").text((d) => {return d;})
        .attr("value", (d) => { return d;})
}