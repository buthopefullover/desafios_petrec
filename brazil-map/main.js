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