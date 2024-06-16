import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;
camera.position.y = 30;
scene.add( camera );
const controls = new OrbitControls(camera, renderer.domElement)

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );
const blinks = new UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.0, 0.15 );
composer.addPass( blinks );

const _density = 0.02;
const fog = new THREE.FogExp2( "black", _density );  
scene.fog = fog;

{
  const planeSize = 80;
  const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
  const planeMat = new THREE.MeshStandardMaterial( {color: 0xffffff} );
  planeMat.color.setRGB( 1.5, 1.5, 1.5 );
  const mesh = new THREE.Mesh( planeGeo, planeMat );
  mesh.rotation.x = Math.PI * - .5;
  mesh.receiveShadow = true;
  scene.add( mesh );

}

const _intensity = 138.8;
const spoout_light = new THREE.SpotLight( '0x00ff00', _intensity );
spoout_light.position.set(14, 26, 0);
spoout_light.target.position.set(0, 0, 0);
spoout_light.castShadow = true;
scene.add( spoout_light );

const _y1 = 10;
const _y2 = 18;
const _y3 = 23;
const sphere_1_geometry = new THREE.SphereGeometry(6, 30, 30);
const sphere_2_geometry = new THREE.SphereGeometry(4, 30, 30);
const sphere_3_geometry = new THREE.SphereGeometry(2, 30, 30);
const sphere_material = new THREE.MeshStandardMaterial( { color: 'white' } );
const sphere_1 = new THREE.Mesh( sphere_1_geometry, sphere_material );
const sphere_2 = new THREE.Mesh( sphere_2_geometry, sphere_material );
const sphere_3 = new THREE.Mesh( sphere_3_geometry, sphere_material );
sphere_1.position.set(0, _y1, 0);
sphere_2.position.set(0, _y2, 0);
sphere_3.position.set(0, _y3, 0);
sphere_1.castShadow = true;
sphere_2.castShadow = true;
sphere_3.castShadow = true;
sphere_1.receiveShadow = true;
sphere_2.receiveShadow = true;
sphere_3.receiveShadow = true;
scene.add( sphere_1 );
scene.add( sphere_2 );
scene.add( sphere_3 );

document.defaultView.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	requestAnimationFrame( animate );

  composer.render();
}

document.getElementById('toggle_light').addEventListener('change', function(){
    if(document.getElementById('toggle_light').checked){
        spoout_light.intensity = 0;
    } else {
        spoout_light.intensity = _intensity;
    }
});

document.getElementById('toggle_blinks').addEventListener('change', function(){
    if(document.getElementById('toggle_blinks').checked){
        blinks.strength = 0;
    } else {
        blinks.strength = 1.5;
    }
});

document.getElementById('toggle_fog').addEventListener('change', function(){
    if(document.getElementById('toggle_fog').checked){
        fog.density = 0;
    } else {
        fog.density = _density;
    }
});

document.getElementById('x_position').addEventListener('input', function(){
    sphere_1.position.x = document.getElementById('x_position').value;
    sphere_2.position.x = document.getElementById('x_position').value;
    sphere_3.position.x = document.getElementById('x_position').value;
});
document.getElementById('y_position').addEventListener('input', function(){
    sphere_1.position.y = parseInt(document.getElementById('y_position').value) + _y1;
    sphere_2.position.y = parseInt(document.getElementById('y_position').value) + _y2;
    sphere_3.position.y = parseInt(document.getElementById('y_position').value) + _y3;
});
document.getElementById('z_position').addEventListener('input', function(){
    sphere_1.position.z = document.getElementById('z_position').value;
    sphere_2.position.z = document.getElementById('z_position').value;
    sphere_3.position.z = document.getElementById('z_position').value;
});

animate();