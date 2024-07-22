import "ol/ol.css";
import { Map, View } from "ol/";
import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import Projection from "ol/proj/Projection";
import OSM from "ol/source/OSM.js";
import { DrawFunctions } from "./Mesaure";

const serverURL = "http://localhost:8888/geoserver/wms";

const mapProjection = new Projection({
  code: "EPSG:3857",
  units: "m",
  axisOrientation: "new",
  global: false,
});

// const backgroundSource = new TileWMS({
//   url: serverURL,
//   params: {
//     LAYERS: "BIGC:background_bigc",
//     VERSION: "1.1.1",
//     FORMAT: "image/jpeg",
//   },
// });

// const backgroundLayer = new TileLayer({
//   source: backgroundSource,
//   name: "Background",
// });

const bigcSource = new ImageWMS({
  url: serverURL,
  params: {
    LAYERS: "BIGC:datamoi",
    VERSION: "1.1.1",
    FORMAT: "image/png",
  },
});

const bigcLayer = new ImageLayer({
  source: bigcSource,
  name: "BigC",
});

const view = new View({
  // extent: [
  //   11820535.00445471, 2421556.5714437757, 11827808.777048586,
  //   2426423.4337369716,
  // ],
  center: [11823873, 2423891],
  zoom: 15,
  projection: mapProjection,
});
export const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    bigcLayer,
  ],
  view: view,
});

$("#map").data("map", map);

$("#div-search").click(function () {
  $("#list-search").css("transform", "translateX(0)");
});
$("#close-search").click(function () {
  $("#list-search").css("transform", "translateX(-100%)");
});
