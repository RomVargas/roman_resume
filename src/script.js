import './css/styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ThreeGlobe from 'three-globe';

import countries from "./all.geo.json"
import lines from "./lines.json"
import map from "./map.json"
// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);


// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: '#7C509B' });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('textures/images/space.jpg');
scene.background = spaceTexture;

// Avatar

const romanTexture = new THREE.TextureLoader().load('textures/images/roman.png');

const roman = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: romanTexture }));

scene.add(roman);

// Moon

const moonTexture = new THREE.TextureLoader().load('textures/images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('textures/images/textura-luna.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

roman.position.z = -5;
roman.position.x = 2;

// Earth


var geom = new THREE.SphereBufferGeometry(5, 180, 90);
var colors = [];
var color = new THREE.Color();
var q = ["pink", "red", "red", "red", "maroon", "maroon", "maroon"];
for (let i = 0; i < geom.attributes.position.count; i++) {
  color.set(q[THREE.Math.randInt(0,q.length - 1)]);
  color.toArray(colors, i * 3);
}
geom.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

var loader = new THREE.TextureLoader();
loader.setCrossOrigin('');
var texture = loader.load('textures/images/earthmap1k.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);
var disk = loader.load('textures/images/circle.png');

var points = new THREE.Points(geom, new THREE.ShaderMaterial({
  vertexColors: THREE.VertexColors,
  uniforms: {
    visibility: {
      value: texture
    },
    shift: {
      value: 0
    },
    shape: {
      value: disk
    },
    size: {
      value: 0.3
    },
    scale: {
      value: window.innerHeight / 2
    }
  },
  vertexShader: `
  				
      uniform float scale;
      uniform float size;
      
      varying vec2 vUv;
      varying vec3 vColor;
      
      void main() {
      
        vUv = uv;
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( scale / length( mvPosition.xyz )) * (0.3 + sin(uv.y * 3.1415926) * 0.6 );
        gl_Position = projectionMatrix * mvPosition;

      }
  `,
  fragmentShader: `
      uniform sampler2D visibility;
      uniform float shift;
      uniform sampler2D shape;
      
      varying vec2 vUv;
      varying vec3 vColor;
      

      void main() {
      	
        vec2 uv = vUv;
        uv.x += shift;
        vec4 v = texture2D(visibility, uv);
        if (length(v.rgb) > 1.0) discard;

        gl_FragColor = vec4( vColor, 1.0 );
        vec4 shapeData = texture2D( shape, gl_PointCoord );
        if (shapeData.a < 0.0625) discard;
        gl_FragColor = gl_FragColor * shapeData;
		
      }
  `,
  transparent: false
}));
points.position.setX(-20);
scene.add(points);

// Eart2

var Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animateIn: true
    })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.5)
    .showAtmosphere(true)
    .atmosphereColor("#3a228a")
    .atmosphereAltitude(0.25) 

    setTimeout(() => {
        Globe.arcsData(lines.pulls)
        .arcColor((e) => {
            return e.status ? "#9cff00" : "#ff4000"
        })
        .arcAltitude((e) => {
            return e.arcAlt
        })
        .arcStroke((e) => {
            return e.status ?0.5 : 0.3
        })
        .arcDashLength(0.9)
        .arcDashGap(4)
        .arcDashAnimateTime(1000)
        .arcsTransitionDuration(1000)
        .arcDashInitialGap((e) => e.order * 1)
        .labelsData(map.maps)
        .labelColor(() => "#ffcb21")

        .labelDotRadius(0.5)
        .labelSize((e) => e.size)
        .labelText("city")
        .labelResolution(6)
        .labelAltitude(0.01)
        .pointsData(map.maps)
        .pointColor(() => "#ffcb21")
        .pointsMerge(true)
        .pointAltitude(0.03)
        .pointRadius(0.05)
    }, 1000)


    Globe.rotateY(-Math.PI * (5/9))
    Globe.rotateZ(-Math.PI / 6)
    const globeMaterial = Globe.globeMaterial()
    globeMaterial.color = new THREE.Color(0x3a228a)
    globeMaterial.emissive = new THREE.Color(0x220038)
    globeMaterial.emissiveIntensity = 0.1
    globeMaterial.shininess = 0.7

    scene.add(Globe)

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  roman.rotation.y += 0.01;
  roman.rotation.z += 0.01;

  points.rotation.x += 0.05
  points.rotation.y += 0.075;
  points.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();