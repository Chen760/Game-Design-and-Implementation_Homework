
/**
 * Challenge
 * For a game with 10M elements, 1K triangles per element, it is hard torender totally 10G triangles in the Video Memory
 * Write a algorithm to filter the triangles
 */

import * as THREE from 'three';
import { SimplifyModifier } from '../../js/three.js/examples/jsm/modifiers/SimplifyModifier.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//添加环境光
const ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );
// 添加定向光线
var directionalLight = new THREE.DirectionalLight( 0xffeedd );
directionalLight.position.set( 0, 0, 1 ).normalize();
scene.add( directionalLight );


const geometry = new THREE.SphereGeometry( 2, 100, 50 );
const material = new THREE.MeshBasicMaterial( { color: 0x049ef4, wireframe : true } );
const mesh = new THREE.Mesh( geometry, material );

console.log(SimplifyModifier);

//方法一：简化模型，减少三角形个数，可以采用如下SimplifyModifier方法，移除模型点数的百分比
const modifier = new SimplifyModifier();
const simplified = mesh.clone(); // mesh为需要简化的网格（模型）
simplified.material = simplified.material.clone();
simplified.material.flatShading = true;
const count = Math.floor( simplified.geometry.attributes.position.count * 0.875 ); // 需要移除模型点数的百分比
simplified.geometry = modifier.modify( simplified.geometry, count );

//以下是我其他的一些简化模型的想法，并没有实现
//方法二：根据camera和elemet的距离动态改变模型点数，距离远的elemet的模型三角形更少
//方法三：对于固定场景或固定视角，根据场景或camera的方向，加载时不加载用户看不到位置elemet的三角形




scene.add( simplified );
scene.add( mesh );

mesh.translateX(-3);
simplified.translateX(3);


camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;

    simplified.rotation.x += 0.005;
    simplified.rotation.y += 0.005;

    renderer.render( scene, camera );
};

animate();