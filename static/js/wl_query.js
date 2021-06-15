let subway = new Map([["U1", "#E3000F" ], ["U2", "#A862A4"], ["U3", "#EF7C00"],
    ["U4", "#00963F"], ["U5", "#008F95"], ["U6", "#9D6830"]])
let modes = [{"name": "All", "value": 0}, {"name": "Subway", "value": 4, "color": subway}, {"name": "Tram", "value": 1, "color": '#CD295A'},
    {"name": "Bus", "value": 2, "color": '#C582F0'}, {"name": "Train", "value": 5, "color": '#38ADAE'},
    {"name": "Wiener Lokalbahnen", "color": "#CD295A", "value": 6}]

let selectedMode = 4
let c = "#ff00ff"

let delays = null
let spinners = null
let nCircle = 8

function callSpinners() {
    if (spinners === null) {
        spinners = d3.select("#svg_map").append("g").selectAll("circle")
            .data(Array(nCircle)).enter()
            .append("circle").attr("id", (_,i) => "s" + i)
            .attr("cx", (_, i) => mapWidth/2+50*Math.cos(i/nCircle*2*Math.PI))
            .attr("cy", (_, i) => mapHeight/2+50*Math.sin(i/nCircle*2*Math.PI))
            .attr("r", 10)
            .attr("fill", "#595959")
    }
    console.log(spinners)
}

function queryData() {

    if (d3.select("input#delays_radio:checked").node() === null) {
        d3.selectAll("#svg_map").selectAll("g").selectAll("path.line")
            .attr("data-hasDelay", false).raise()
        delays = null;
        return; }
    if (delays == null) {
        callSpinners()
    }

    //$SCRIPT_ROOT = {{ request.script_root | safe }}
    $.getJSON("/_data",
        (d) => {
            delays = d;
    })
    if (delays == null) {        return;
    }

    let lines = d3.selectAll("#svg_map").selectAll("g").selectAll("path.line")
    lines.attr("data-hasDelay", false).raise()
    let dshort = delays.stoerungkurz
    delays.stoerungkurz.forEach((e) => {
        lines.filter(d => {
            if (!('relatedLines' in e)) {
                return false
            }
            var hasDelay = false
            e.relatedLines.forEach((l) => {
                if (d.properties.lines.includes(l)) {
                    hasDelay = true};
            })
            return hasDelay;
        }).attr("data-hasDelay", true)
    })

    spinners.raise()
}

setInterval(queryData, 10000)

function initSelectors() {
    var table = document.getElementById("selection_table");
    var cells = table.getElementsByTagName("td");

    var i;
    for (i = 0; i < cells.length; i++) {
      var currentCell= table.rows[0].cells[i];
      var createClickHandler = function(cell) {
        return function() {
          var id = cell.innerHTML;
          // set back the previously selected option's style to normal
          var j;
          for(j = 0; j < 5; j++) {
            table.rows[0].cells[j].style.cssText = 'font-size:1.2em;text-decoration:none;';
          }
          // set the style of the selected cell
          cell.style.cssText = 'font-size:2.2em;text-decoration:underline;';
          modes.forEach(mode => {if(mode.name == id) selectedMode = mode.value;});
          refreshMap();
        };
      };
      currentCell.onclick = createClickHandler(currentCell);
      // by default the first cell (Subway) is selected
      table.rows[0].cells[0].style.cssText = 'font-size:2.2em;text-decoration:underline;';
    }
}

function drawLines() {
    d3.json("../static/data/OEFFLINIENOGD.json").then((lines) => {

        d3.select("#svg_map").append("g")
              .selectAll('path')
              .data(lines.features)
              .enter().filter((d) => {
                  return d.properties.LTYP == selectedMode || selectedMode == 0 ||
                    (selectedMode == d.properties.LTYP - 5 && selectedMode == 1);})
                .append('path')
              .attr("class", "line").raise()
              .attr('d', viennaPathGenerator)
              .attr('fill', 'none')
              .attr("data-hasDelay", false)
              .attr("data-lineNumbers", (d) => {return d.properties.LBEZEICHNUNG; })
              .attr('stroke', (d) => {
                  // select color
                  lineType = d.properties.LTYP;
                  modes.forEach(mode => {if(mode.value == lineType) c = mode.color;});

                  d.properties.lines = d.properties.LBEZEICHNUNG.split(", ")

                  // subway
                  if (subway.get(d.properties.LBEZEICHNUNG) != null) {
                      return subway.get(d.properties.LBEZEICHNUNG);
                  }

                  // else
                  return c;
              })
              .on("mouseover", (d) => {
                var line = d.properties.lines[0];

                d3.select("#svg_map")
                  .selectAll('path')
                  .filter((d) => { return d.properties.LBEZEICHNUNG != null && d.properties.lines.includes(line);})
                  .attr('stroke', (d) => {
                      // select color
                      lineType = d.properties.LTYP;
                      if(lineType == 1 || lineType == 6) {
                        return "#38ADAE";
                      }
                      else return "#CD295A";
                  });

                d3.select("#line_name")
                    .style("visibility", "visible")
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
                document.getElementById("line_name").innerHTML = line;
              })
              .on("mouseout", (d) => {
                var line = d.properties.lines[0];

                d3.select("#svg_map")
                  .selectAll('path')
                  .filter((d) => { return  d.properties.LBEZEICHNUNG != null && d.properties.lines.includes(line);})
                  .attr('stroke', (d) => {
                      // select color
                      lineType = d.properties.LTYP;
                      modes.forEach(mode => {if(mode.value == lineType) c = mode.color;});

                      // subway
                      if (subway.get(d.properties.LBEZEICHNUNG) != null) {
                          return subway.get(d.properties.LBEZEICHNUNG);
                      }

                      // else
                      return c;
                  });

                d3.select("#line_name")
                  .style("visibility", "hidden");
                document.getElementById("line_name").innerHTML = "";
              }).raise();

    });
}

function filterLinesByDistrict(district) {

    d3.json("../static/data/BEZIRKSGRENZEOGD.json").then(function(districts) {

        districts.features.forEach(d => {
            if(d.properties.BEZNR == district) {

                d3.selectAll('.line')
                  .filter((l) => {
                    var notInDistrict = true;
                    l.geometry.coordinates.forEach(coord => {
                        if(d3.geoContains(d.geometry, coord)) {
                            notInDistrict = false;
                        }
                    });
                    return notInDistrict;
                  })
                  .remove();
            }
        });
    });

}
