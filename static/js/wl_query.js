let subway = new Map([["U1", "#E3000F" ], ["U2", "#A862A4"], ["U3", "#EF7C00"],
    ["U4", "#00963F"], ["U5", "#008F95"], ["U6", "#9D6830"]])
let modes = [{"name": "All modes", "value": 0}, {"name": "Subway", "value": 4, "color": subway}, {"name": "Tram", "value": 1, "color": '#CD295A'},
    {"name": "Bus", "value": 2, "color": '#C582F0'}, {"name": "Train", "value": 5, "color": '#38ADAE'},
    {"name": "Wiener Lokalbahnen", "color": "#005295", "value": 6}]
let districs = []

let selectedMode = 4
let c = "#ff00ff"


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
          for(j = 0; j < 4; j++) {
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

    drawLines();
}

function drawLines() {
    d3.json("../static/data/OEFFLINIENOGD.json").then((lines) => {

        d3.select("#svg_map").append("g")
              .selectAll('path')
              .data(lines.features)
              .enter().filter((d) => { return d.properties.LTYP == selectedMode || selectedMode == 0 ||
            (selectedMode == d.properties.LTYP - 5 && selectedMode == 1);}).append('path')
              .attr('stroke-width', '100.')
            .attr("class", "line").raise()
              .attr('d', viennaPathGenerator)
              .attr('fill', 'none')
              .attr('stroke', (d) => {
                  // select color
                  lineType = d.properties.LTYP
                  modes.forEach(mode => {if(mode.value == lineType) c = mode.color;});

                  // subway
                  if (subway.get(d.properties.LBEZEICHNUNG) != null) {
                      return subway.get(d.properties.LBEZEICHNUNG);
                  }

                  // else
                  return c;
              });

    });
}
