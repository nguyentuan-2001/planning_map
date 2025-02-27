const map = $("#map").data("map");
const mapLayers = map.getLayers();

export function getLayerByname(layerName) {
  let layer = null;

  mapLayers.forEach((lyr) => {
    if (lyr.get("name") === layerName) {
      layer = lyr;
    }
  });
  return layer;
}
