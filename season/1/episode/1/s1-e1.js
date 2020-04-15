var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var createScene = function () {
	var scene = new BABYLON.Scene(engine);
	var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -0.3), scene);
	var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 10, -20), scene);
	camera.speed = 0.4;

	camera.attachControl(canvas, true);
	camera.keysUp.push(87);    //W
	camera.keysDown.push(83)   //D
	camera.keysLeft.push(65);  //A
	camera.keysRight.push(68); //S
	//We start without being locked.
	var isLocked = false;

	// On click event, request pointer lock
	scene.onPointerDown = function (evt) {

		//true/false check if we're locked, faster than checking pointerlock on each single click.
		if (!isLocked) {
			canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
			if (canvas.requestPointerLock) {
				canvas.requestPointerLock();
			}
		}

		//continue with shooting requests or whatever :P
		//evt === 0 (left mouse click)
		//evt === 1 (mouse wheel click (not scrolling))
		//evt === 2 (right mouse click)
	};


	// Event listener when the pointerlock is updated (or removed by pressing ESC for example).
	var pointerlockchange = function () {
		var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;

		// If the user is already locked
		if (!controlEnabled) {
			camera.detachControl(canvas);
			isLocked = false;
		} else {
			camera.attachControl(canvas);
			isLocked = true;
		}
	};

	// Attach events to the document
	document.addEventListener("pointerlockchange", pointerlockchange, false);
	document.addEventListener("mspointerlockchange", pointerlockchange, false);
	document.addEventListener("mozpointerlockchange", pointerlockchange, false);
	document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
	light.position = new BABYLON.Vector3(20, 60, 30);

	scene.ambientColor = BABYLON.Color3.FromInts(10, 30, 10);
	scene.clearColor = BABYLON.Color3.FromInts(127, 165, 13);
	scene.gravity = new BABYLON.Vector3(0, -0.5, 0);


	// Skybox
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 150.0, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;
	skybox.infiniteDistance = true;

	// Invisible borders
	var border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
	border0.scaling = new BABYLON.Vector3(1, 100, 100);
	border0.position.x = -50.0;
	border0.checkCollisions = true;
	border0.isVisible = false;

	var border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
	border1.scaling = new BABYLON.Vector3(1, 100, 100);
	border1.position.x = 50.0;
	border1.checkCollisions = true;
	border1.isVisible = false;

	var border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
	border2.scaling = new BABYLON.Vector3(100, 100, 1);
	border2.position.z = 50.0;
	border2.checkCollisions = true;
	border2.isVisible = false;

	var border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
	border3.scaling = new BABYLON.Vector3(100, 100, 1);
	border3.position.z = -50.0;
	border3.checkCollisions = true;
	border3.isVisible = false;

	// Ground
	var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 5, scene, false);
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);

	groundMaterial.diffuseTexture.uScale = 6;
	groundMaterial.diffuseTexture.vScale = 6;
	groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	groundMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
	ground.material = groundMaterial;
	ground.receiveShadows = true;
	ground.checkCollisions = true;

	ground.onReady = function () {
		ground.optimize(100);

		// Shadows
		var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

		// Trees
		BABYLON.SceneLoader.ImportMesh("", "//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (newMeshes) {
			newMeshes[0].material.opacityTexture = null;
			newMeshes[0].material.backFaceCulling = false;
			newMeshes[0].isVisible = false;
			newMeshes[0].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object

			shadowGenerator.getShadowMap().renderList.push(newMeshes[0]);
			var range = 60;
			var count = 100;
			for (var index = 0; index < count; index++) {
				var newInstance = newMeshes[0].createInstance("i" + index);
				var x = range / 2 - Math.random() * range;
				var z = range / 2 - Math.random() * range;

				var y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object

				newInstance.position = new BABYLON.Vector3(x, y, z);

				newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);

				var scale = 0.5 + Math.random() * 2;
				newInstance.scaling.addInPlace(new BABYLON.Vector3(scale, scale, scale));

				shadowGenerator.getShadowMap().renderList.push(newInstance);
			}
			shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
			shadowGenerator.usePoissonSampling = true;

			// Collisions
			camera.checkCollisions = true;
			camera.applyGravity = true;
		});
	}

	return scene;
};

engine = createDefaultEngine();
if (!engine) throw 'engine should not be null.';
scene = createScene();;
sceneToRender = scene

engine.runRenderLoop(function () {
	if (sceneToRender) {
		sceneToRender.render();
	}
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});