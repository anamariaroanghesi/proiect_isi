import { useEffect, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Point from '@arcgis/core/geometry/Point';
import Search from "@arcgis/core/widgets/Search.js";
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Editor from "@arcgis/core/widgets/Editor.js";
import WebMap from "@arcgis/core/WebMap.js";
import Graphic from '@arcgis/core/Graphic'
import esriConfig from "@arcgis/core/config"
import { collection, getDocs } from 'firebase/firestore';
import {app} from '../../firebase';
import { getDatabase, ref, update } from "firebase/database";


 // Variabilă globală pentru MapView
 let mapView: MapView | null = null;

export const HotelsMap = () => {
  const template = new PopupTemplate({
    title: "{Name}", //
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Description",
            label: "Descriere",
            visible: true
          },

        ]
      }
    ]
  });

  useEffect(() => {
    esriConfig.apiKey = "AAPK141cf5017e7d46be8103dcdf5ac1c72dfmnYS9mXcAP0VFehsroRw6vGnwA0XrEzhSoZv4AovVLvO81s5wKxjqjR4oW7L5q2";
    if (!mapView) {
      const myMap = new WebMap({
        basemap: 'arcgis/navigation',
        portalItem: {
          id: "459a495fc16d4d4caa35e92e895694c8"
        }
      });

      mapView = new MapView({
        map: myMap,
        container: 'mapView',
        center: new Point({
          longitude: 28.621806,
          latitude: 44.242451
        }),
        zoom: 15

      });

      const search = new Search({
        view: mapView,

      });
      mapView.ui.add(search, {position: "top-right", index:5});

      const editor = new Editor({
        view: mapView
      });

      mapView.ui.add(editor, "bottom-right");


      const layer = new FeatureLayer({
        url: 'https://services6.arcgis.com/FxvouggrQfuokNNA/arcgis/rest/services/hotels_layers5/FeatureServer/0',
        outFields: ["*"],
        popupTemplate: template,
        renderer: new SimpleRenderer({
          symbol: new SimpleMarkerSymbol({
            color: "green",
            size: 12,
            outline: {
              color: [255, 0, 0],
              width: 2
            }
          })
        })
      });


       myMap.add(layer);
      //  fetchHotels();
      const database = getDatabase(app);
      const locationRef = ref(database);

      navigator.geolocation.watchPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const point = new Point({
            longitude: longitude,
            latitude: latitude
          });

          console.log(latitude)
          console.log(longitude)
          // Save the user's location to Firebase Realtime Database
          const updates = {
            'latitude': latitude,
            'longitude': longitude
          };
          
          update(locationRef, updates)
            .then(() => {
              console.log('Latitude and longitude updated successfully!');
            })
            .catch((error) => {
              console.error('Error updating latitude and longitude:', error);
            });

          // Create a marker symbol to represent the user's location
          const markerSymbol = {
            type: 'simple-marker',
            color: [0, 0, 255], // Blue color (RGB format)
            size: 12
          };

          const markerGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
          });

          mapView?.graphics.removeAll();
          mapView?.graphics.add(markerGraphic);

          // mapView?.goTo({
          //   target: point,
          //   zoom: 15
          // });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
        {
          enableHighAccuracy: true
        }
      );

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

      <h1>Harta Hoteluri</h1>
      {/* <div id="searchWidget" style={{position: 'absolute', top: '22px', right: '20px', zIndex: '10'}}></div> */}
      <div id="mapView" style={{ height: '600px', width: '100%' }}></div>

    </div>
  );
};

const fetchHotels = async () => {
  try {
    const hotelsRef = collection(db, 'hotels'); // 'hotels' is the name of the collection
    if(hotelsRef!=null)
      console.log("okkk");
    const snapshot = await getDocs(hotelsRef);
    
    const hotelsData: { latitude: any; longitude: any; }[] = []; // Array to hold hotel data
    
    snapshot.forEach((doc) => {
      // Access latitude and longitude fields from each document
      const { latitude, longitude } = doc.data().Location;
      
      // Create an object with latitude and longitude
      const hotelLocation = { latitude, longitude };
      
      // Push the hotel location to the array
      hotelsData.push(hotelLocation);
    });

    // Do something with hotelsData, such as displaying it on the map
    console.log(hotelsData);
    
  } catch (error) {
    console.error("Error fetching hotels:", error);
  }
};

export default HotelsMap;
