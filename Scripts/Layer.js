import { getLayerByname } from "./customFunctions";

const map = $("#map").data("map");
const layers = map.getLayers();
const closer = $("#draggable-closer");

$("#layers").click(function () {
  const layersDiv = $("#draggable");
  const layersDivTitle = $("#draggable-title");
  const layersDivContent = $("#draggable-content");
  layersDivTitle.html("Layers");
  layersDivContent.html("");
  layersDiv.css("display", "block");

  layers.forEach((layer) => {
    const layerName = layer.get("name");
    if (layerName !== undefined) {
      const element = `<div class="form-check" >
        <input class="form-check-input" type="checkbox" value="" id=${layerName}>
        <label class="form-check-label" for="flexCheckDefault">
          ${layerName}
        </label>
      </div>`;
      layersDivContent.append(element);
      $(`#${layerName}`).prop("checked", layer.getVisible());
    }
  });

  $(".form-check-input").change(function () {
    const checkbox = this;
    const layerName = checkbox.id;
    const layer = getLayerByname(layerName);
    layer.setVisible(checkbox.checked);
  });
});

closer.click(function () {
  $("#draggable").css("display", "none");
});

dragElement(document.getElementById("draggable"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
