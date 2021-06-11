let mapWidth = 500;
let mapHeight = 500;
let margin = 20;
let map = null;

function initMap() {
    // loads the map of Vienna

    console.log(d3.select(".map").node())

    d3.json("../static/data/viennastreets.geojson").then(function(streets) {
        viennaProjection = d3.geoMercator().fitExtent([[margin, margin], [mapWidth - margin, mapHeight - margin]], streets);
        viennaPathGenerator = d3.geoPath().projection(viennaProjection);

        console.log(mapWidth)
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
