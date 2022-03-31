// map creation and initial configuration
var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: 'map',
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4
  })
});

// additional controls
map.addControl(new ol.control.FullScreen());
map.addControl(new ol.control.OverviewMap());

// load states geojson 
var urlStates = 'https://raw.githubusercontent.com/raphaelfv/desafio-estag-petrec-2020/main/estados.geojson';

// create states layer 
var layerStates = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: urlStates,
    format: new ol.format.GeoJSON()
  })
});

// add states layer
map.addLayer(layerStates);


const select = new ol.interaction.Select();
map.addInteraction(select);

const selectedFeatures = select.getFeatures();


const dragBox = new ol.interaction.DragBox({
  condition: ol.events.condition.platformModifierKeyOnly,
});

map.addInteraction(dragBox);

dragBox.on('boxend', function () {
  const extent = dragBox.getGeometry().getExtent();
  const boxFeatures = vectorSource
    .getFeaturesInExtent(extent)
    .filter((feature) => feature.getGeometry().intersectsExtent(extent));

  const rotation = map.getView().getRotation();
  const oblique = rotation % (Math.PI / 2) !== 0;

  if (oblique) {
    const anchor = [0, 0];
    const geometry = dragBox.getGeometry().clone();
    geometry.rotate(-rotation, anchor);
    const extent = geometry.getExtent();
    boxFeatures.forEach(function (feature) {
      const geometry = feature.getGeometry().clone();
      geometry.rotate(-rotation, anchor);
      if (geometry.intersectsExtent(extent)) {
        selectedFeatures.push(feature);
      }
    });
  } else {
    selectedFeatures.extend(boxFeatures);
  }
});

dragBox.on('boxstart', function () {
  selectedFeatures.clear();
});

const infoBox = document.getElementById('info');

selectedFeatures.on(['add', 'remove'], function () {
  const names = selectedFeatures.getArray().map(function (feature) {
    return feature.get('name');
  });
  if (names.length > 0) {
    console.log('entrei!');
    infoBox.innerHTML = names.join(', ');
  } else {
    console.log('errei!');
    infoBox.innerHTML = 'None';
  }
});

