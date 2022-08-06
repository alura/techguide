import { d3 } from "@src/infra/d3/useD3";
import React from "react";

export function useBlock(data: any, dependencies = []) {
  const ref = React.useRef();

  React.useEffect(() => {
    const baseSVG = ref.current;
    const svg = d3.select(baseSVG);
    drawBlocks(svg, data);
    return () => {};
  }, dependencies);

  return ref;
}

function drawBlocks(svg: any, data: any) {
  // https://d3-graph-gallery.com/graph/treemap_basic.html
  const size = 445;
  svg.attr("width", size).attr("height", size);
  // stratify the data: reformatting for d3.js
  var root = d3
    .stratify()
    .id((d: any) => d.name) // Name of the entity (column name is name in csv)
    // Name of the parent (column name is parent in csv)
    .parentId((d: any) => d.parent)(data);

  root.sum((d: any) => +d.value); // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap().size([size, size]).padding(4)(root);

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("stroke", "black")
    .on("click", (_, node) => {
      // eslint-disable-next-line no-undef
      window.alert(JSON.stringify(node.data));
    });

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    // First Text
    .append("text")
    .attr("x", (d) => d.x0 + 10) // +10 to adjust position (more right)
    .attr("y", (d) => d.y0 + 20) // +20 to adjust position (lower)
    .text((d) => d.data.name.join(" ")) // Display only the first word
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "white");
}
