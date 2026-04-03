import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const w = el.offsetWidth, h = el.offsetHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 0, 7);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return;
    }

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';

    const COLORS = [0x8b5e3c, 0x3d5a3e, 0xd9603a, 0x3d6ea8, 0xb87d20, 0x4d7a5a, 0x7a4a6e, 0x2a7a8a];
    const objs: { mesh: THREE.Object3D; drx: number; dry: number; drz: number; baseY: number; fs: number; fo: number }[] = [];

    function makeWire(geo: THREE.BufferGeometry, color: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: .85 });
      const mesh = new THREE.LineSegments(edges, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      scene.add(mesh);
      return mesh;
    }

    const mainBox = makeWire(new THREE.BoxGeometry(1.8, 1.8, 1.8), 0x8b5e3c, 1.8, 0.3, -1, 0.3, 0.5, 0.1);
    objs.push({ mesh: mainBox, drx: .002, dry: .004, drz: .001, baseY: 0.3, fs: 0.4, fo: 0 });

    const boxPositions: [number, number, number, number, number, number][] = [[-2.2, 1.5, -2, .5, .8, .2], [2.8, -1.2, -2.5, .3, .7, .15], [-3, -1, .5, .6, .3, .1], [3.2, 1.8, -.5, .2, .9, .3]];
    boxPositions.forEach(([x, y, z, rx, ry, size], i) => {
      const s = 0.35 + size * .6;
      const m = makeWire(new THREE.BoxGeometry(s, s, s), COLORS[i + 1], x, y, z, rx, ry, 0);
      objs.push({ mesh: m, drx: (Math.random() - .5) * .012, dry: (Math.random() - .5) * .016, drz: (Math.random() - .5) * .008, baseY: y, fs: .3 + Math.random() * .5, fo: i * 1.2 });
    });

    const oct = makeWire(new THREE.OctahedronGeometry(.65), 0xd9603a, -2.4, .8, -.8, .4, .2, 0);
    objs.push({ mesh: oct, drx: .009, dry: .013, drz: .005, baseY: .8, fs: .6, fo: 2 });

    const tet = makeWire(new THREE.TetrahedronGeometry(.55), 0x3d6ea8, 3.0, -1.5, -.5, .3, .6, .1);
    objs.push({ mesh: tet, drx: .007, dry: .01, drz: .004, baseY: -1.5, fs: .5, fo: 3.5 });

    const ico = makeWire(new THREE.IcosahedronGeometry(.6, 0), 0x4d7a5a, -1.5, -2, -1, .2, .3, .1);
    objs.push({ mesh: ico, drx: .005, dry: .008, drz: .003, baseY: -2, fs: .45, fo: 1 });

    const torGeo = new THREE.TorusGeometry(.5, .12, 8, 20);
    const torEdge = new THREE.EdgesGeometry(torGeo);
    const tor = new THREE.LineSegments(torEdge, new THREE.LineBasicMaterial({ color: 0xb87d20, transparent: true, opacity: .7 }));
    tor.position.set(-3.2, 2.2, -1);
    scene.add(tor);
    objs.push({ mesh: tor, drx: .01, dry: .015, drz: .006, baseY: 2.2, fs: .35, fo: 4 });

    const pc = 120, pos = new Float32Array(pc * 3);
    for (let i = 0; i < pc; i++) {
      pos[i * 3] = (Math.random() - .5) * 14;
      pos[i * 3 + 1] = (Math.random() - .5) * 10;
      pos[i * 3 + 2] = (Math.random() - .5) * 8 - 2;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pm = new THREE.PointsMaterial({ color: 0x8b5e3c, size: .05, transparent: true, opacity: .5 });
    const particles = new THREE.Points(pg, pm);
    scene.add(particles);

    let t = 0, animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += .01;
      objs.forEach(o => {
        o.mesh.rotation.x += o.drx;
        o.mesh.rotation.y += o.dry;
        if (o.drz) o.mesh.rotation.z += o.drz;
        o.mesh.position.y = o.baseY + Math.sin(t * o.fs + o.fo) * .28;
      });
      particles.rotation.y += .0008;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = el.offsetWidth, nh = el.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      try { el.removeChild(renderer.domElement); } catch (e) { /* */ }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />;
}
