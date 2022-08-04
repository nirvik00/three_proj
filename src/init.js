// import  * as THREE from 'three'

import {
    Scene,
    Color,
    Vector3,
    PerspectiveCamera,
    WebGLRenderer,
    AxesHelper,
    Raycaster,
    Mesh,
    MeshBasicMaterial,
    HemisphereLight,
    HemisphereLightHelper,
    PointLight,
    PlaneGeometry,
    MeshPhongMaterial,
    AnimationMixer,
    Clock,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { loadPlaneObj, loadPlaneObj2, loadModel } from "./loadPlane";

import plane2 from "./assets/plane2.glb";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

var scene, camera, renderer, controls, div3d, raycaster, mixer;
var mouse;
var MESH_ARR = [];
var mesh_arr = [];
const clock = new Clock();

const init3d = () => {
    div3d = document.createElement("div3d");

    raycaster = new Raycaster();

    scene = new Scene();
    scene.background = new Color(0xcccfff);

    camera = new PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.up = new Vector3(0, 0, 1);
    camera.lookAt(new Vector3(0, 0, 0));
    camera.position.set(50, 50, 50);

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    div3d.appendChild(renderer.domElement);
    document.body.appendChild(div3d);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);

    const light = new PointLight(0xffffff, 5, 100);
    light.position.set(10, 0, 30);
    scene.add(light);

    const light2 = new HemisphereLight(0xffffbb, 0x080820, 10);
    const helper2 = new HemisphereLightHelper(light2, 5);
    scene.add(helper2);

    let g = new PlaneGeometry(100, 100, 10);
    let m = new MeshPhongMaterial({ color: 0xffffff });
    let me = new Mesh(g, m);
    scene.add(me);

    loadPlaneObj(scene); //             loads the plane - 1
    initLoad(); //                      loads the plane - 2

    loadPlaneObj3();

    var ax = new AxesHelper(10);
    scene.add(ax);
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener('keydown', onKeyDown, false);
    render();
};

function initLoad() {
    loadPlaneObj2()
        .then((p) => MESH_ARR.push({ plane: p }))
        .catch((err) => console.error(err));
}

export async function loadPlaneObj3() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(plane2);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
        plane2,
        function (gltf) {
            const model = gltf.scene;
            model.position.set(10, 10, 5);
            model.scale.set(1, 1, 1);
            model.rotation.set(Math.PI / 2, 0, 0);
            scene.add(model);
            mixer = new AnimationMixer(model);
            mixer.clipAction(gltf.animations[0]).play();
        },
        undefined,
        function (e) {
            console.error(e);
        }
    );
}

function updateMeshArr() {
    if (MESH_ARR.length > 0) {
        MESH_ARR.forEach((me) => {
            me.plane.scene.rotation.x = Math.PI / 2;
            me.plane.scene.position.z = 10;
            me.plane.scene.position.y = -20;
            scene.add(me.plane.scene);
        });
    }
}


function onKeyDown(e){
    console.log(e.key, e.keyCode);
    intxArr.forEach(node=>{
        if(e.keyCode===85) node.position.z+=0.1;
        else if(e.keyCode===68) node.position.z-=0.1;
    });
    sphereArr.forEach(arr=>{
        arr.forEach(node=>{
            if(e.keyCode===72) scene.remove(node);
            else if(e.keyCode===83) scene.add(node);
        });
    });
    addMesh();
}

function clearIntxArr(){
    var m=new THREE.MeshPhongMaterial({color:0xffffff});
    sphereArr.forEach(arr=>{
        arr.forEach(node=>{
            node.scale.set(1,1,1);
            node.material=m;
        })
    })
    intxArr=[];
}

function onMouseDown(e){
    var m2=new MeshPhongMaterial({color:0xff0000});
    mouse.x=(e.clientX/window.innerWidth)*2-1;
    mouse.y=-(e.clientY/window.innerHeight)*2+1;
    raycaster.setFromCamera(mouse, camera);
    var intersects=raycaster.intersectObjects(scene.children);
    if(intersects.length>0){
        var obj=[];
        for(var i=0; i<intersects.length; i++){
            obj=intersects[i];
            var p=obj.object.position;
            sphereArr.forEach(arr=>{
                arr.forEach(node=>{
                    var q=node.position;
                    var d=Math.sqrt(Math.pow(q.x-p.x,2) + Math.pow(q.y-p.y,2) + Math.pow(q.z-p.z,2));
                    if(d<0.1){
                        node.scale.set(2,2,2);
                        node.material=m2;
                        intxArr.push(node);
                    }
                });
            });
        }
    }else{
        clearIntxArr();
    }
}


// function addSphere(){
//     sphereArr.forEach(arr=>{
//         arr.forEach(node=>{
//             node.geometry.dispose();
//             node.material.dispose();
//             scene.remove(node);
//             // delete node;
//         });
//     });
//     sphereArr=[];
//     var t=5, e=5;
//     for(var i=-t; i<t; i++){
//         var arr=[];
//         for(j=-t; j<t; j++){
//             var g=new THREE.SphereGeometry(1, 20,20);
//             var m=new THREE.MeshPhongMaterial({color:0xffffff});
//             var me=new THREE.Mesh(g,m);
//             var p=new THREE.Vector3(i*e, j*e, 0);
//             var d=Math.sqrt(p.x*p.x + p.y*p.y);
//             var z;
//             // z=d;
//             if(d!==0) z=100/d;
//             else z=100/Math.sqrt(e*e*0.5);
//             //Math.random()*2 -1
//             me.position.set(i*e, j*e, z);
//             arr.push(me);
//         }
//         sphereArr.push(arr);
//     }
//     sphereArr.forEach(arr=>{
//         arr.forEach(node=>{
//             scene.add(node);
//         });
//     });
// }

// function addMesh(){
//     meshArr.forEach(elem=>{
//         elem.geometry.dispose();
//         elem.material.dispose();
//         scene.remove(elem);
//         // delete elem;
//     });
//     meshArr=[];

//     for(i=0; i<sphereArr.length-1; i++){
//         var arr=sphereArr[i];
//         var arr2=sphereArr[i+1];
//         for(var j=0 ; j<arr.length-1; j++){
//             var a=arr[j].position;
//             var b=arr[j+1].position;
//             var c=arr2[j].position;
//             var d=arr2[j+1].position;
//             var g=new THREE.Geometry();
//             g.vertices.push(a,b,c,d);
//             g.faces.push(
//                 new THREE.Face3(0,1,2),
//                 new THREE.Face3(1,3,2),
//             )
//             g.computeVertexNormals();
//             var m=new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
//             var me=new THREE.Mesh(g,m);
//             meshArr.push(me);
//         }
//     }
    
//     meshArr.forEach(node=>{
//         scene.add(node);
//     });

// }

function onWindowResize(){
    camera.aspect=window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const render = () => {
    updateMeshArr();
    renderer.render(scene, camera);

    try {
        const delta = clock.getDelta();
        mixer.update(delta);
    } catch (err) {
        // console.error(err);
    }

    //controls.update();
    onWindowResize();
    requestAnimationFrame(render);
};

export default init3d;
