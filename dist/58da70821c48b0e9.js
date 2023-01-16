import"./style.css";import*as THREE from"three";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls.js";import{FontLoader}from"three/examples/jsm/loaders/FontLoader.js";import{TextGeometry}from"three/examples/jsm/geometries/TextGeometry.js";import*as dat from"lil-gui";const gui=new dat.GUI,canvas=document.querySelector(" #webgl"),scene=new THREE.Scene,textureLoader=new THREE.TextureLoader,matcapTexture=textureLoader.load("textures/matcaps/8.png"),fontLoader=new FontLoader;fontLoader.load("/fonts/helvetiker_regular.typeface.json",(e=>{const t=new THREE.MeshMatcapMaterial({matcap:matcapTexture}),r=new TextGeometry("Bruno Simon",{font:e,size:.5,height:.2,curveSegments:12,bevelEnabled:!0,bevelThickness:.03,bevelSize:.02,bevelOffset:0,bevelSegments:5});r.center();const o=new THREE.Mesh(r,t);scene.add(o);const n=new THREE.TorusGeometry(.3,.2,32,64);for(let e=0;e<100;e++){const e=new THREE.Mesh(n,t);e.position.x=10*(Math.random()-.5),e.position.y=10*(Math.random()-.5),e.position.z=10*(Math.random()-.5),e.rotation.x=Math.random()*Math.PI,e.rotation.y=Math.random()*Math.PI;const r=Math.random();e.scale.set(r,r,r),scene.add(e)}}));const sizes={width:window.innerWidth,height:window.innerHeight};window.addEventListener("resize",(()=>{sizes.width=window.innerWidth,sizes.height=window.innerHeight,camera.aspect=sizes.width/sizes.height,camera.updateProjectionMatrix(),renderer.setSize(sizes.width,sizes.height),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))}));const camera=new THREE.PerspectiveCamera(75,sizes.width/sizes.height,.1,100);camera.position.x=1,camera.position.y=1,camera.position.z=2,scene.add(camera);const controls=new OrbitControls(camera,canvas);controls.enableDamping=!0;const renderer=new THREE.WebGLRenderer({canvas});renderer.setSize(sizes.width,sizes.height),renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const clock=new THREE.Clock,tick=()=>{clock.getElapsedTime(),controls.update(),renderer.render(scene,camera),window.requestAnimationFrame(tick)};tick();