import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export type MapStop = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  stops: MapStop[];
};

export function LeafletMap({ stops }: Props) {
  const centerLat = stops.length > 0 ? stops[0].latitude : -2.900128;
  const centerLng = stops.length > 0 ? stops[0].longitude : -79.005896;

  const markersHtml = stops.map((stop, index) => {
    return `
      var marker${index} = L.marker([${stop.latitude}, ${stop.longitude}]).addTo(map);
      marker${index}.bindPopup("<b>${stop.name}</b>");
    `;
  }).join('\n');

  const latlngsHtml = stops.map(stop => `[${stop.latitude}, ${stop.longitude}]`).join(',');
  const polylineHtml = stops.length > 1 ? `
    var latlngs = [${latlngsHtml}];
    var polyline = L.polyline(latlngs, {color: '#00205B', weight: 4}).addTo(map);
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  ` : `
    map.setView([${centerLat}, ${centerLng}], 13);
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);
        
        ${markersHtml}
        ${polylineHtml}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.map}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 250,
  },
  map: {
    flex: 1,
  }
});
