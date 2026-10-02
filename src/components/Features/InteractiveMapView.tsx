import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useTheme } from '@/hooks/useTheme';
import { Task, TaskStatus } from '@/types';
import { TASK_STATUS_LABELS } from '@/constants';

export interface InteractiveMapViewRef {
  centerOnCoordinates: (coords: { latitude: number; longitude: number }[]) => void;
  resetView: (latitude: number, longitude: number) => void;
}

interface InteractiveMapViewProps {
  tasks: (Task & { location: { address: string; latitude: number; longitude: number } })[];
  onSelectTask: (taskId: string) => void;
  initialLatitude: number;
  initialLongitude: number;
}

export const InteractiveMapView = forwardRef<InteractiveMapViewRef, InteractiveMapViewProps>(
  ({ tasks, onSelectTask, initialLatitude, initialLongitude }, ref) => {
    const { colors, isDark, radius } = useTheme();
    const webViewRef = useRef<WebView | null>(null);

    const getPinColor = (status: TaskStatus): string => {
      switch (status) {
        case 'New':
          return colors.statusNew;
        case 'In Progress':
          return colors.statusInProgress;
        case 'Completed':
          return colors.statusCompleted;
        case 'Cancelled':
          return colors.statusCancelled;
      }
    };

    useImperativeHandle(ref, () => ({
      centerOnCoordinates: (coords) => {
        if (!webViewRef.current || coords.length === 0) {
          return;
        }
        const boundsJson = JSON.stringify(
          coords.map((c) => [c.latitude, c.longitude])
        );
        const js = `
          if (window.leafletMap && window.L) {
            var bounds = L.latLngBounds(${boundsJson});
            if (bounds.isValid()) {
              window.leafletMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
            }
          }
          true;
        `;
        webViewRef.current.injectJavaScript(js);
      },
      resetView: (lat, lng) => {
        if (!webViewRef.current) {
          return;
        }
        const js = `
          if (window.leafletMap) {
            window.leafletMap.setView([${lat}, ${lng}], 13);
          }
          true;
        `;
        webViewRef.current.injectJavaScript(js);
      },
    }));

    useEffect(() => {
      if (!webViewRef.current) {
        return;
      }
      const serializedTasks = JSON.stringify(
        tasks.map((task) => ({
          id: task.id,
          title: task.title,
          address: task.location.address,
          latitude: task.location.latitude,
          longitude: task.location.longitude,
          status: task.status,
          statusLabel: TASK_STATUS_LABELS[task.status],
          color: getPinColor(task.status),
        }))
      );
      const js = `
        if (window.updateMapTasks) {
          window.updateMapTasks(${serializedTasks});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    }, [tasks, isDark]);

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as {
          type?: string;
          taskId?: string;
        };
        if (data.type === 'OPEN_TASK' && data.taskId) {
          onSelectTask(data.taskId);
        }
      } catch {
        return;
      }
    };

    const darkModeStyle = isDark
      ? `
        .leaflet-tile-pane {
          filter: brightness(0.65) invert(1) contrast(2.5) hue-rotate(200deg) saturate(0.3) brightness(0.7);
        }
      `
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            * { -webkit-tap-highlight-color: transparent; }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background-color: ${colors.background};
              overflow: hidden;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            #map {
              width: 100%;
              height: 100%;
              background-color: ${colors.background};
            }
            ${darkModeStyle}
            .leaflet-popup-content-wrapper {
              background: ${colors.surface};
              color: ${colors.textPrimary};
              border-radius: ${radius.md}px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.15);
              padding: 6px;
            }
            .leaflet-popup-tip {
              background: ${colors.surface};
            }
            .popup-title {
              font-weight: 600;
              font-size: 14px;
              margin: 0 0 4px 0;
              color: ${colors.textPrimary};
            }
            .popup-address {
              font-size: 12px;
              color: ${colors.textSecondary};
              margin: 0 0 8px 0;
              line-height: 16px;
            }
            .popup-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: ${radius.xs}px;
              font-size: 11px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 8px;
            }
            .popup-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              box-sizing: border-box;
              text-align: center;
              background-color: ${colors.primary};
              color: #ffffff;
              border: none;
              border-radius: ${radius.md}px;
              padding: 12px 16px;
              min-height: 48px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
            }
            .leaflet-control-attribution {
              font-size: 10px !important;
              background: ${isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'} !important;
              color: ${colors.textSecondary} !important;
              padding: 2px 6px !important;
            }
            .leaflet-control-attribution a {
              color: ${colors.primary} !important;
              text-decoration: none !important;
            }
            .custom-pin {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .pin-marker {
              width: 28px;
              height: 28px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .pin-inner {
              width: 10px;
              height: 10px;
              background: #ffffff;
              border-radius: 50%;
              transform: rotate(45deg);
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            var map = L.map('map', {
              zoomControl: false,
              attributionControl: true
            }).setView([${initialLatitude}, ${initialLongitude}], 13);
            window.leafletMap = map;

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            var markersLayer = L.layerGroup().addTo(map);

            function createMarkerIcon(color) {
              return L.divIcon({
                className: 'custom-pin',
                iconSize: [28, 28],
                iconAnchor: [14, 28],
                popupAnchor: [0, -28],
                html: '<div class="pin-marker" style="background-color: ' + color + ';"><div class="pin-inner"></div></div>'
              });
            }

            window.updateMapTasks = function(tasksList) {
              markersLayer.clearLayers();
              if (!tasksList || tasksList.length === 0) {
                return;
              }

              var latLngs = [];
              tasksList.forEach(function(task) {
                var lat = task.latitude;
                var lng = task.longitude;
                latLngs.push([lat, lng]);

                var icon = createMarkerIcon(task.color);
                var marker = L.marker([lat, lng], { icon: icon });

                var popupContent = '' +
                  '<div class="popup-title">' + task.title + '</div>' +
                  '<div class="popup-address">' + task.address + '</div>' +
                  '<div class="popup-badge" style="background-color: ' + task.color + ';">' + task.statusLabel + '</div>' +
                  '<button class="popup-btn" onclick="openTask(\\'' + task.id + '\\')">Открыть наряд</button>';

                marker.bindPopup(popupContent, { maxWidth: 220 });
                markersLayer.addLayer(marker);
              });

              if (latLngs.length > 0) {
                var bounds = L.latLngBounds(latLngs);
                if (bounds.isValid()) {
                  map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
                }
              }
            };

            function openTask(taskId) {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'OPEN_TASK',
                  taskId: taskId
                }));
              }
            }

            var initialTasks = ${JSON.stringify(
              tasks.map((task) => ({
                id: task.id,
                title: task.title,
                address: task.location.address,
                latitude: task.location.latitude,
                longitude: task.location.longitude,
                status: task.status,
                statusLabel: TASK_STATUS_LABELS[task.status],
                color: getPinColor(task.status),
              }))
            )};
            window.updateMapTasks(initialTasks);
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webView}
          onMessage={handleMessage}
          userAgent="Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 FieldWorkerApp/1.0"
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          overScrollMode="never"
        />
      </View>
    );
  }
);

InteractiveMapView.displayName = 'InteractiveMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
