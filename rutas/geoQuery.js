// rutas/geoQuery.js (Node.js / Firebase Functions)
const { getFirestore } = require('firebase-admin/firestore');
const { geohashQueryBounds, distanceBetween } = require('geofire-common');
const firestore = getFirestore();

module.exports = async (req, res) => {
  const { lat, lng, radius } = req.query;
  const center = [parseFloat(lat), parseFloat(lng)];
  const bounds = geohashQueryBounds(center, parseFloat(radius));
  const snapshots = await Promise.all(
    bounds.map(b =>
      firestore.collection('solicitudes_lavado')
        .where('geohash', '>=', b[0])
        .where('geohash', '<=', b[1])
        .get()
    )
  );

  // filtrar por distancia real
  const results = [];
  snapshots.forEach(snap => {
    snap.forEach(doc => {
      const { coords } = doc.data();
      const dist = distanceBetween(center, [coords.latitude, coords.longitude]);
      if (dist <= radius * 1000) {
        results.push({ id: doc.id, ...doc.data() });
      }
    });
  });

  res.json(results);
};