import "ol/ol.css";
import Overlay from "ol/Overlay.js";
import { toLonLat } from "ol/proj.js";
import { toStringHDMS } from "ol/coordinate.js";
import { getLayerByname } from "./customFunctions";
import { Stroke, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import { WFS, GeoJSON } from "ol/format";
import { Vector } from "ol/layer";
/**
 * Elements that make up the popup.
 */
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

const map = $("#map").data("map");

const vectorSource = new VectorSource();
/**
 * Create an overlay to anchor the popup to the map.
 */

const style = new Style({
  stroke: new Stroke({
    color: "blue",
    width: 5,
  }),
});

const vector = new Vector({
  source: vectorSource,
  style: style,
});

map.addLayer(vector);

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.addOverlay(overlay);

/**
 * Add a click handler to the map to render the popup.
 */
map.on("singleclick", function (evt) {
  var display = localStorage.getItem("display");
  if (display == "false") {
    const coordinate = evt.coordinate;
    const hdms = toStringHDMS(toLonLat(coordinate));

    const parcelsLayer = getLayerByname("BigC");
    const parcelsSource = parcelsLayer.getSource();

    const view = map.getView();
    const resolution = view.getResolution();
    const projection = view.getProjection();

    const parcelInfo = $("#parcel-info");
    parcelInfo.html("");

    const noFeatures = $("#no-features");
    noFeatures.html("<p>No Features</p>");

    const parcelUrl = parcelsSource.getFeatureInfoUrl(
      coordinate,
      resolution,
      projection,
      { INFO_FORMAT: "application/json" }
    );

    if (parcelUrl) {
      $.ajax({
        url: parcelUrl,
        method: "GET",
        success: function (result) {
          const parcel = result.features[0];

          if (parcel) {
            const parcelName = parcel.properties.layer;
            const number = parcel.properties.objectid;
            const parcelArea = parcel.properties.shape_area;

            const features = new GeoJSON().readFeatures(parcel);
            vectorSource.clear(true);
            vectorSource.addFeatures(features);

            parcelInfo.html(
              `<h5>Parcel Info</h5> <p>Parcel Number: ${parcelName}</p> <p>Number: ${number}</p> <p>Area (sqm): ${parcelArea.toFixed(
                2
              )}</p>`
            );
            noFeatures.html("");
          }
        },
      });
    }

    overlay.setPosition(coordinate);
  }
});
