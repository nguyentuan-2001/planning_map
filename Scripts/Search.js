import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector.js";
import { Stroke, Style, Icon } from "ol/style";
import { and, equalTo } from "ol/format/filter";
import { WFS, GeoJSON } from "ol/format";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { fromLonLat } from "ol/proj.js";

const map = $("#map").data("map");
const searchBtn = $("#search");

const wfsUrl = "http://localhost:8888/geoserver/BIGC/wfs";

const vectorSource = new VectorSource();

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

searchBtn.click(function () {
  const parcel = $("#parcelInput").val().toString();

  if (parcel.length == 0) {
    window.alert("Please enter parcel number.");
    return;
  }

  const featureRequest = new WFS().writeGetFeature({
    srcName: "EPSG:3857",
    featureNS: "http://localhost:8888/geoserver/BIGC",
    featurePrefix: "datamoi",
    featureTypes: ["datamoi"],
    outputFormat: "application/json",
    // filter: and(equalTo("parcel_n", parcel), equalTo("block_n", block)),
    filter: equalTo("objectid", parcel),
  });

  fetch(wfsUrl, {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      if (json.features.length > 0) {
        const layersDivContent = $("#list-content");
        layersDivContent.html("");

        json.features.forEach((layer) => {
          const element = `<div class="item-content">
             <div>
             <p>
             Name: ${layer.properties.layer}
             </p>
             <p>
             Join Count: ${layer.properties.join_count}
             </p>
             <p>
             Linetype: ${layer.properties.linetype}
             </p>
             <p>
             Shape Area: ${layer.properties.shape_area.toFixed(2)}
             </p>
             <p>
             Shape Leng: ${layer.properties.shape_leng.toFixed(2)}
             </p>
             </div>
              <a href="#" class="zoom">View</a>
            </div>`;

          const $element = $(element);
          const $zoom = $element.find(".zoom");

          layersDivContent.append($element);

          $zoom.click(function (e) {
            const features = new GeoJSON().readFeatures(layer);
            vectorSource.clear(true);
            vectorSource.addFeatures(features);

            map
              .getView()
              .fit(vectorSource.getExtent(), { padding: [100, 100, 100, 100] });
          });
        });
      }
    });
});
