let mapWidth = 1020;
let mapHeight = 500;
let margin = 10;
let map = null;
let viennaProjection = null
let viennaPathGenerator = null
let s = null

function refreshMap() {
    if (map == null) { return; }
    mapWidth = Math.floor(d3.select(".map").style("width").replace("px", ""))
    mapHeight = Math.max(756, Math.floor(d3.select(".map").style("height").replace("px", "")))
    viennaProjection = d3.geoMercator().fitExtent([[margin, margin], [mapWidth - margin, mapHeight - margin]], s);
    viennaPathGenerator = d3.geoPath().projection(viennaProjection);

    redrawMap();
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
