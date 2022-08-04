import { MeshBasicMaterial, Vector3, AnimationMixer } from "three";
import plane from "./assets/plane.glb";
import plane2 from "./assets/plane2.glb";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function setUpModel(data ) {
    return data.scene.children[0];
}
 
export async function loadPlaneObj2() {
   return await new GLTFLoader().loadAsync(plane2);
}

export function loadPlaneObj(scene) {
    try {
        new GLTFLoader().load(plane, (gltf) => {
            gltf.scene.rotation.x = Math.PI / 2;
            gltf.scene.position.z = 10;
            gltf.scene.position.y = 20;
            scene.add(gltf.scene);
            console.log(dumpObject(gltf.scene).join("\n"));
        });
    } catch (err) {
        console.error(err);
    }
}

function dumpObject(obj, lines = [], isLast = true, prefix = "") {
    const localPrefix = isLast ? "└─" : "├─";
    lines.push(
        `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
            obj.type
        }]`
    );
    const newPrefix = prefix + (isLast ? "  " : "│ ");
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

// export default loadPlaneObj;
