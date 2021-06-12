let modes = [{"name": "Subway", "value": 4}, {"name": "Tram", "value": 1},
    {"name": "Bus", "value": 2}, {"name": "Train", "value": 5}]
let subway = new Map()
subway.set("U1", "#E3000F")
subway.set("U2", "#A862A4")
subway.set("U3", "#EF7C00")
subway.set("U4", "#00963F")
subway.set("U5", "#008F95")
subway.set("U6", "#9D6830")
let districs = []

let selectedMode = 4


function initSelectors() {
    d3.select(".selector")
        .append("div").attr("class", "select-wrapper")
        .append("select")
        .on("change", (d) => {
            selectedMode = event.target.value;
            refreshMap();
        })
        .selectAll()
        .data(modes)
        .enter()
        .append("option").text((d) => {
            return d.name;})
        .attr("value", (d) => { return d.value;})
    drawLines();
}

function drawLines() {

    d3.json("../static/data/OEFFLINIENOGD.json").then((lines) => {
        /*
        viennaProjection = d3.geoMercator().fitExtent([[margin, margin], [mapWidth - margin, mapHeight - margin]], lines);
        viennaPathGenerator = d3.geoPath().projection(viennaProjection);
         */

        d3.select("#svg_map").append("g")
              .selectAll('path')
              .data(lines.features)
              .enter().filter((d) => { return d.properties.LTYP == selectedMode;}).append('path')
              .attr('stroke-width', '100.')
            .attr("class", "line").raise()
              .attr('d', viennaPathGenerator)
              .attr('fill', 'none')
              .attr('stroke', (d) => {
                  if (subway.get(d.properties.LBEZEICHNUNG) != null) {
                      return subway.get(d.properties.LBEZEICHNUNG);
                  }
                  return '#0000ff'
              });

    });
}