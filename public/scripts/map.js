mapboxgl.accessToken = MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
  projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup()
    .setHTML(
      `
      <style>
      .mapboxgl-popup-content {
        background-color: #212529;
        color: white;
      }
      .mapboxgl-popup-content h5 {
        font-weight: 700
      }
      .mapboxgl-popup-content p {
        font-size: 16px;
        font-weight: 500;
      }
      .mapboxgl-popup-close-button {
        background-color: transparent;
        color: white;
        outline: none;
      }
      </style>
      <h5>${campground.title}</h5>
      <p>${campground.location}</p>
      `
    )
  )
  .addTo(map)