let mapWidth = 1220;
let mapHeight = 800;
let margin = 50;
let map = null;
let viennaProjection = null
let viennaPathGenerator = null
let s = null

viennaProjection = d3.geoMercator().fitExtent([[margin, margin], [mapWidth - margin, mapHeight - margin]], s);

function refreshMap() {
    if (map == null) { return; }
    mapWidth = Math.floor(d3.select(".map").style("width").replace("px", ""))
    mapHeight = Math.max(756, Math.floor(d3.select(".map").style("height").replace("px", "")))

    viennaPathGenerator = d3.geoPath().projection(viennaProjection);

    redrawMap();

    drawLines();
}

function redrawMap() {
    d3.select("#svg_map").selectAll("g").remove();
    initMap();
    drawLines();
}

function initMap() {
    // loads the map of Vienna

    mapWidth = Math.floor(d3.select(".map").style("width").replace("px", ""))
    mapHeight = Math.max(mapHeight, Math.floor(d3.select(".map").style("height").replace("px", "")))

    d3.json("../static/data/viennastreets.geojson").then(function(streets) {
        s = streets;
        if (viennaProjection == null || viennaPathGenerator == null) {

        viennaProjection = d3.geoMercator().fitExtent([[margin, margin], [mapWidth - margin, mapHeight - margin]], s);
        viennaPathGenerator = d3.geoPath().projection(viennaProjection);
    }

        let svg = d3.select("#svg_map")
            .attr("width", mapWidth)
            .attr("height", mapHeight);

        // construct the map
        map = svg.append("g")
              .selectAll('path')
              .data(streets.features)
              .enter().append('path')
              .attr('d', viennaPathGenerator)
              .attr('fill', 'none')
              .attr('stroke', '#999999')
              .attr('stroke-width', '0.5');
    });
}

function drawDistrictBoarders(district_number) {
    d3.json("../static/data/BEZIRKSGRENZEOGD.json").then(function(districts) {

        d3.select("#svg_map").append("g")
          .selectAll('path')
          .data(districts.features)
          .enter()
          .filter((d) => { return d.properties.BEZNR == district_number;})
          .append('path')
          .attr("class", "border").raise()
          .attr('d', viennaPathGenerator)
          .attr('fill', '#38ADAE')
          .attr('fill-opacity', '0.2')
          .attr('stroke', "black");

    });
}

function drawAllDistrictBoarders() {
    drawLines();
    d3.json("../static/data/BEZIRKSGRENZEOGD.json").then(function(districts) {

        d3.select("#svg_map").append("g")
          .selectAll('path')
          .data(districts.features)
          .enter()
          .append('path')
          .attr("class", "border").raise()
          .attr('d', viennaPathGenerator)
          .attr('fill', 'none')
          .attr('stroke', "black");

    });
}

function clearAllDistrictBoarders() {
    drawLines();
    d3.selectAll('.border')
      .remove();
}

function districtSelected(d) {
    clearAllDistrictBoarders();
    drawLines();

    drawDistrictBoarders(d);

    filterLinesByDistrict(d);
}
