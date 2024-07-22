import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Icon, Style} from 'ol/style.js';
import {OGCMapTile, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {fromLonLat} from 'ol/proj.js';

const rome = new Feature({
  geometry: new Point(fromLonLat([12.5, 41.9])),
});

const london = new Feature({
  geometry: new Point(fromLonLat([-0.12755, 51.507222])),
});

const madrid = new Feature({
  geometry: new Point(fromLonLat([-3.683333, 40.4])),
});
const paris = new Feature({
  geometry: new Point(fromLonLat([2.353, 48.8566])),
});
const berlin = new Feature({
  geometry: new Point(fromLonLat([13.3884, 52.5169])),
});

rome.setStyle(
  new Style({
    image: new Icon({
    //   color: '#BADA55',
    //   crossOrigin: 'anonymous',
      src: 'https://e7.pngegg.com/pngimages/236/41/png-clipart-illustration-of-map-icon-google-map-maker-google-maps-computer-icons-map-marker-text-heart.png',
    }),
  })
);

london.setStyle(
  new Style({
    image: new Icon({
      color: 'rgba(255, 0, 0, .5)',
      crossOrigin: 'anonymous',
      src: 'data/bigdot.png',
      scale: 0.2,
    }),
  })
);

madrid.setStyle(
  new Style({
    image: new Icon({
      crossOrigin: 'anonymous',
      src: 'data/bigdot.png',
      scale: 0.2,
    }),
  })
);

paris.setStyle(
  new Style({
    image: new Icon({
      color: '#8959A8',
      crossOrigin: 'anonymous',
      src: 'data/dot.svg',
    }),
  })
);

berlin.setStyle(
  new Style({
    image: new Icon({
      crossOrigin: 'anonymous',
      src: 'data/dot.svg',
    }),
  })
);
const vectorSource = new VectorSource({
  features: [rome, london, madrid, paris, berlin],
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const rasterLayer = new TileLayer({
  source: new OGCMapTile({
    url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
    crossOrigin: '',
  }),
});

const map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([2.896372, 44.6024]),
    zoom: 3,
  }),
});
