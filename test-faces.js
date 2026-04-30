/* eslint-disable @typescript-eslint/no-require-imports */
const THREE = require('three');

function extractFaces(geom) {
  geom.computeVertexNormals();
  const pos = geom.attributes.position.array;
  const index = geom.index ? geom.index.array : null;

  const faces = [];
  const addTriangle = (A, B, C) => {
    const a = new THREE.Vector3(pos[A*3], pos[A*3+1], pos[A*3+2]);
    const b = new THREE.Vector3(pos[B*3], pos[B*3+1], pos[B*3+2]);
    const c = new THREE.Vector3(pos[C*3], pos[C*3+1], pos[C*3+2]);
    const normal = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(b, a),
      new THREE.Vector3().subVectors(c, a)
    ).normalize();

    let found = faces.find(f => f.normal.distanceTo(normal) < 0.05);
    if (!found) faces.push({ normal, _verts: [a, b, c] });
    else found._verts.push(a, b, c);
  };

  if (index) {
    for (let i = 0; i < index.length; i += 3) addTriangle(index[i], index[i+1], index[i+2]);
  } else {
    for (let i = 0; i < pos.length/3; i += 3) addTriangle(i, i+1, i+2);
  }

  // Refine and compute properties
  const results = faces.map(f => {
    let center = new THREE.Vector3();
    let uniqueVerts = [];
    f._verts.forEach(v => {
      if (!uniqueVerts.some(uv => uv.distanceTo(v) < 0.001)) uniqueVerts.push(v);
    });
    uniqueVerts.forEach(v => center.add(v));
    center.divideScalar(uniqueVerts.length);
    
    return {
      center: [Number(center.x.toFixed(4)), Number(center.y.toFixed(4)), Number(center.z.toFixed(4))],
      normal: [Number(f.normal.x.toFixed(4)), Number(f.normal.y.toFixed(4)), Number(f.normal.z.toFixed(4))]
    };
  });
  
  // Sort heavily by Y, then Z, then X to give a deterministic ordering
  return results.sort((a, b) => b.center[1] - a.center[1]);
}

const d4 = extractFaces(new THREE.TetrahedronGeometry(1.02, 0));
const d6 = extractFaces(new THREE.BoxGeometry(1.28, 1.28, 1.28));
const d8 = extractFaces(new THREE.OctahedronGeometry(0.98, 0));
const d12 = extractFaces(new THREE.DodecahedronGeometry(0.92, 0));
const d20 = extractFaces(new THREE.IcosahedronGeometry(0.98, 0));

function createD10Geometry() {
  const vertices = [];
  const indices = [];
  const top = [0, 1.12, 0];
  const bottom = [0, -1.12, 0];
  vertices.push(...top, ...bottom);
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const y = i % 2 === 0 ? 0.26 : -0.26;
    vertices.push(Math.cos(angle) * 0.92, y, Math.sin(angle) * 0.92);
  }
  for (let i = 0; i < 10; i++) {
    const current = 2 + i;
    const next = 2 + ((i + 1) % 10);
    indices.push(0, current, next);
    indices.push(1, next, current);
  }
  return new THREE.PolyhedronGeometry(vertices, indices, 0.92, 0);
}
const d10 = extractFaces(createD10Geometry());

console.log(JSON.stringify({
  4: d4,
  6: d6,
  8: d8,
  10: d10,
  12: d12,
  20: d20
}));
