import { useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Point from '@arcgis/core/geometry/Point';
import PopupTemplate from '@arcgis/core/PopupTemplate';

import esri = __esri;
// import RouteTask from '@arcgis/core/tasks/RouteTask';
// import RouteParameters from '@arcgis/core/tasks/support/RouteParameters';
// import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';


 // Variabilă globală pentru MapView
 let mapView: MapView | null = null;

export const HotelsMap = () => {
  const hoteluri = [
    'Hotel1',
    'Hotel2',
    'Hotel3',
    'Hotel4',
    'Hotel5',
    'Hotel6',
    'Hotel7',
    'Hotel8',
    'Hotel9',
    'Hotel10'
  ];

  const template = new PopupTemplate({
    title: "{Name}", // Utilizează coloanele din CSV pentru titlu
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Description", // Afișează descrierea
            label: "Descriere",
            visible: true
          },
          // Adaugă alte câmpuri dacă este necesar
        ]
      }
    ]
  });

//   }
// const [view, setView] = useState(null);
// const [stops, setStops] = useState([]);

  useEffect(() => {
    if (!mapView) {
      const myMap = new Map({
        basemap: 'topo'
      });

      mapView = new MapView({
        map: myMap,
        container: 'mapView',
        center: new Point({
          longitude: 28.621806,
          latitude: 44.242451
        }),
        zoom: 16

      });

      const layer = new FeatureLayer({
        url: 'https://services6.arcgis.com/FxvouggrQfuokNNA/arcgis/rest/services/hotels_featurelayer3/FeatureServer/0',
        outFields: ["*"],
        popupTemplate: template,
        renderer: new SimpleRenderer({
          symbol: new SimpleMarkerSymbol({
            color: "green",
            size: 12,
            outline: {
              color: [255, 255, 255],
              width: 2
            }
          })
        })
      });


      myMap.add(layer);
    }

    return () => {
      if (mapView) {
        mapView.destroy();
        mapView = null;
      }
    };
  }, []);



  return (
    <div>
      <h1>Lista Hoteluri</h1>
      <ul>
        {hoteluri.map((hotel, index) => (
          <li key={index}>{hotel}</li>
        ))}
      </ul>
      <div id="mapView" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default HotelsMap;
