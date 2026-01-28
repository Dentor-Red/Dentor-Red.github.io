// === Variables ===
const canvasSize = { width: 1200, height: 700 }; // Set fixed canvas size

var carSize = {
    h: 15,
    w: 20,
    l: 40,
}

// Define the geometry for a single wheel (cylinder)
var radiusTop = 5;
var radiusBottom = 5;
var height = 2;
var radialSegments = 64; // how smooth/round the wheel is

var cameraParams = {
    near: 1,
    far: 2000,
    fov: 75,                // degrees
    aspectRatio: canvasSize.width / canvasSize.height, // adjusts based on window size
    atX: 0,
    atY: 0,
    atZ: 0,
    eyeX: 340, //30
    eyeY: 150, //50
    eyeZ: -175, //-75
    upX: 0,
    upY: 1,
    upZ: 0
};

// === Event Listeners ===
document.addEventListener("keypress", (event) => {
    const key = event.key;
    // console.log("key pressed was " + key);
    switch (key) {
        case "q": // toggle axis helper
            ah.visible = !ah.visible;
            break;
        default: // for car movement, see WedgeCar.js
            carMovement(key);
            break;
    }
});

// === Functions ===

function setCarFaceVertexUvs() {
    return [
        addFaceCoordinates(0, 0, 0.23, 0, 0.23, 1),          // face 0 (1,0,5) - bottom left from rear
        addFaceCoordinates(0, 0, 0.23, 1, 0, 1),       // face 1 (1,5,4) - bottom right from rear
        addFaceCoordinates(0.47, 0.41, 0.71, 0.41, 0.71, 0.71), // face 2 (0,1,2) - back right
        addFaceCoordinates(0.47, 0.41, 0.71, 0.71, 0.47, 0.71), // face 3 (0,2,3) - back left
        addFaceCoordinates(0.5, 0.85, 1, 0.71, 0.95, 1),    // face 4 (5,0,3) - side left
        addFaceCoordinates(0.5, 0.85, 0.95, 1, 1, 0.71),    // face 5 (4,2,1) - side right
        addFaceCoordinates(0.25, 0, 0.45, 0, 0.25, 1),    // face 6 (3,2,5) - top left
        addFaceCoordinates(0.45, 0, 0.45, 1, 0.25, 1)     // face 7 (2,4,5) - top right
    ];
}

function addFaceCoordinates(as, at, bs, bt, cs, ct) {
    // adds the texture coordinates for a single face to the UVs array
    /*
        recall you need 3 points for face coordinates
        point a, b, and c.
        each of these points has an (s, t) coordinate.
        the parameters for this function are the (s, t) pairs for these
        three coordinates which are then added to the (global) UVs array.
    */
    return [
        new THREE.Vector2(as, at),
        new THREE.Vector2(bs, bt),
        new THREE.Vector2(cs, ct)
    ];
}

function createCarBody() {
    //HINT: (x, z) is your plane, y is your height
    //1. Create your geometry object
    var carGeom = new THREE.Geometry();

    //vertices
    carGeom.vertices.push(new THREE.Vector3(+carSize.w / 2, 0, -carSize.l / 2)); //0
    carGeom.vertices.push(new THREE.Vector3(-carSize.w / 2, 0, -carSize.l / 2)); //1  
    carGeom.vertices.push(new THREE.Vector3(-carSize.w / 2, carSize.h, -carSize.l / 2)); //2
    carGeom.vertices.push(new THREE.Vector3(carSize.w / 2, carSize.h, -carSize.l / 2)); //3
    carGeom.vertices.push(new THREE.Vector3(-carSize.w / 2, 0, carSize.l / 2)); //4
    carGeom.vertices.push(new THREE.Vector3(+carSize.w / 2, 0, +carSize.l / 2)); //5           

    //faces - direction description as viewed from behind (view "1" orientation)
    carGeom.faces.push(new THREE.Face3(1, 0, 5)); //bottom 1 (left)
    carGeom.faces.push(new THREE.Face3(1, 5, 4)); //bottom 2 (right)
    carGeom.faces.push(new THREE.Face3(0, 1, 2)); //back 1 (right)
    carGeom.faces.push(new THREE.Face3(0, 2, 3)); //back 2 (left)
    carGeom.faces.push(new THREE.Face3(5, 0, 3)); //side 1 (left)
    carGeom.faces.push(new THREE.Face3(4, 2, 1)); //side 1 (right)
    carGeom.faces.push(new THREE.Face3(3, 2, 5)); //top 1 (left)
    carGeom.faces.push(new THREE.Face3(2, 4, 5)); //top 2 (right)

    //2.5 Calculate normal vectors as necessary
    carGeom.computeFaceNormals();

    return carGeom;
}

function setupCamera(cameraParameters) {
    // set up an abbreviation 
    var cp = cameraParameters;
    // create an initial camera with the desired shape
    var camera = new THREE.PerspectiveCamera(cp.fov, cp.aspectRatio, cp.near, cp.far);
    // set the camera location and orientation
    camera.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
    camera.up.set(cp.upX, cp.upY, cp.upZ);
    camera.lookAt(new THREE.Vector3(cp.atX, cp.atY, cp.atZ));
    return camera;
}

function carMovement(key) {
    switch (key) {
        case "w":
            moveCarFowardZ();
            break;
        case "s":
            moveCarBackwardZ();
            break;
        case "a":
            turnCarLeft();
            break;
        case "d":
            turnCarRight();
            break;

        default:
            break;
    }
}

function moveCarFowardZ() {
    let obj = scene.getObjectByName("carObject", true);
    obj.translateZ(3); //doesn't require +=, accumulates
    rotateWheel("f");
}

function moveCarBackwardZ() {
    let obj = scene.getObjectByName("carObject", true);
    obj.translateZ(-3); //doesn't require +=, accumulates
    rotateWheel("b");
}

function turnCarLeft() {
    let obj = scene.getObjectByName("carObject", true);
    // obj.rotation.y += (Math.PI/180 * 5); 
    obj.rotateY(Math.PI / 180 * 5); //doesn't require +=, accumulates   
}

function turnCarRight() {
    let obj = scene.getObjectByName("carObject", true);
    // obj.rotation.y += (-Math.PI/180 * 5); 
    obj.rotateY(-Math.PI / 180 * 5); //doesn't require +=, accumulates   
}

//rotates wheel        
function rotateWheel(dir) {

    let front = scene.getObjectByName("wheelsFrontObject", true);
    let rear = scene.getObjectByName("wheelsRearObject", true);

    switch (dir) {
        case "f":
            front.rotateX(Math.PI / 180 * 15); //doesn't require +=, accumulates
            rear.rotateX(Math.PI / 180 * 15); //doesn't require +=, accumulates
            break;
        case "b":
            front.rotateX(-Math.PI / 180 * 15); //doesn't require +=, accumulates
            rear.rotateX(-Math.PI / 180 * 15); //doesn't require +=, accumulates
            break;
        default:
            break;
    }
}

function createRearLights() {
    // Create a parent object for both rear lights and light sources
    var rearlights = new THREE.Object3D();
    rearlights.name = "rear"; // assign name for easy lookup later

    // Geometry for the rear light lens (small red cylinders)
    var lightGeom = new THREE.CylinderGeometry(
        carSize.w / 10, // radiusTop
        carSize.w / 10, // radiusBottom
        carSize.l / 40, // height
        8               // radialSegments
    );

    // Material with emissive glow and transparency for realistic red lens effect
    let material = new THREE.MeshPhongMaterial({
        color: new THREE.Color("red"),
        specular: new THREE.Color("white"),
        shininess: 1,
        flatShading: THREE.FlatShading,
        emissive: new THREE.Color("red"),
        emissiveIntensity: 0.6,
        opacity: 0.8,
        transparent: true,
    });

    // Create the first rear light mesh (right side)
    let lightMesh = new THREE.Mesh(lightGeom, material);
    lightMesh.rotateX(THREE.Math.degToRad(90)); // rotate to face backward

    // Clone for the left rear light
    let light2Mesh = lightMesh.clone();

    // Position both rear lights symmetrically
    lightMesh.position.set(carSize.w / 3, 5.75, -carSize.l / 2);   // right rear light
    light2Mesh.position.set(-carSize.w / 3, 5.75, -carSize.l / 2); // left rear light

    // Add both light meshes to the parent rearlights object
    rearlights.add(lightMesh);
    rearlights.add(light2Mesh);

    // ---- Spotlights for rear lights ----

    // Create the first red spotlight (right side)
    let light1 = new THREE.SpotLight(
        new THREE.Color("red"),  // red light
        0.3,                     // intensity
        50,                      // distance
        THREE.Math.degToRad(180),// wide beam angle (full spread)
        1,                       // penumbra (soft edges)
        0                        // no decay
    );

    light1.position.set(carSize.w / 3, 5.75, -carSize.l / 2);

    // Create a target point behind the car for the spotlight to aim at
    let target = new THREE.Object3D();
    target.position.set(carSize.w / 3, 5.75, -carSize.l / 2 - 50);
    light1.target = target;

    // Add first spotlight and target to the rearlights group
    rearlights.add(light1);
    rearlights.add(target);

    // Clone the spotlight setup for the left side
    let light2 = light1.clone();
    light2.position.set(-carSize.w / 3, 5.75, -carSize.l / 2);

    // Clone and adjust target for the left rear light
    let target2 = target.clone();
    target2.position.set(-carSize.w / 3, 5.75, -carSize.l / 2 - 50);
    light2.target = target2;

    // Add second spotlight and its target
    rearlights.add(light2);
    rearlights.add(target2);

    // Return the completed rear lights assembly
    return rearlights;
}

// Function to create a single headlight (takes targetX to offset the light target)
function createHeadlight(targetX) {
    // Create a parent Object3D for this headlight assembly
    let headlight = new THREE.Object3D();

    // Basic parameters for the headlight shape
    let radius = carSize.w / 7;
    let height = 8.5;
    let radialSegments = 4;   // low segments for a more stylized shape
    let heightSegments = 1;
    let openEnded = true;     // open the back of the cone

    // Create the cone geometry for the headlight housing
    let headlightPart = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded);
    const headlightPartMesh = new THREE.Mesh(headlightPart, carMeshMaterials.headlight);

    // Rotate to aim the headlight outward and slightly tilted
    headlightPartMesh.rotation.set(THREE.Math.degToRad(-90), THREE.Math.degToRad(45), 0);

    // Create the bulb inside the headlight (a smaller closed cone)
    let bulbGeom = new THREE.ConeGeometry(radius * 0.6, height, radialSegments * 3, heightSegments, !openEnded);
    let bulbMesh = new THREE.Mesh(bulbGeom, carMeshMaterials.bulb);
    bulbMesh.translateZ(-0.5); // slightly offset bulb position inside housing
    bulbMesh.translateY(-0.1);
    bulbMesh.rotateX(THREE.Math.degToRad(-90));

    // Add bulb and housing to headlight group
    headlight.add(bulbMesh);
    headlight.add(headlightPartMesh);

    // Create a spotlight representing the light beam of the bulb
    let bulbLight = createLight({ x: 0, y: 2, z: 0 });
    bulbLight.name = "bulbLight" + targetX; // name it uniquely by side
    headlight.add(bulbLight);

    // Create a target object for the spotlight to focus on
    let bulbTarget = createLightTarget({ x: targetX, y: 0, z: 60 });
    bulbLight.target = bulbTarget;
    headlight.add(bulbTarget);

    return headlight; // return the assembled headlight
}

// Function to create a spotlight with default settings
function createLight(pos) {
    let light = new THREE.SpotLight(
        new THREE.Color(0xeedd82), // warm yellow color
        0.3, // moderate intensity
        0, // infinite distance
        THREE.Math.degToRad(60), // wide beam angle
        0.2, // soft edges
        1 // realistic decay
    );
    light.position.set(pos.x, pos.y, pos.z);
    return light;
}

// Function to create a target object for spotlights
function createLightTarget(pos) {
    let target = new THREE.Object3D();
    target.translateX(pos.x);
    target.translateY(pos.y);
    target.translateZ(pos.z);
    return target;
}

// Function to create both left and right headlights and group them together
function createHeadlights() {
    var headlights = new THREE.Object3D();

    let headlight1 = createHeadlight(-10); // right headlight target slightly left
    let headlight2 = createHeadlight(10);  // left headlight target slightly right

    // Position headlights symmetrically on the car front
    headlight1.position.set(-carSize.w / 3.5, 2, carSize.l / 2.5);
    headlight2.position.set(carSize.w / 3.5, 2, carSize.l / 2.5);

    headlights.add(headlight1);
    headlights.add(headlight2);

    return headlights;
}
