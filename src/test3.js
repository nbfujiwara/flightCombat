/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/three.d.ts"/>
/// <reference path="../libs/threeTrackball.js.my.d.ts"/>
//回転検証　、、、むずい！！
var myLib;
(function (myLib) {
    var Main = (function () {
        function Main() {
            this._keyLeft = false;
            this._keyTop = false;
            this._rotateOrder = 'XYZ';
            this._keyRight = false;
            this._keyBottom = false;
            //private _controls:THREE.TrackballControls;
            this._dummy = false;
            this._stats = new Stats();
            document.getElementById('stats').appendChild(this._stats.domElement);
            var scene = new THREE.Scene();
            var width = 960;
            var height = 640;
            var fov = 60;
            var aspect = width / height;
            var near = 1;
            var far = 1000000;
            var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.set(0, 0, 300);
            //this._controls = new THREE.TrackballControls(camera);
            var renderer = new THREE.WebGLRenderer();
            if (renderer == null) {
                alert('あなたの環境はWebGLは使えません');
            }
            renderer.setSize(width, height);
            document.body.appendChild(renderer.domElement);
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, 0.7, 0.7);
            scene.add(directionalLight);
            this._camera = camera;
            this._scene = scene;
            this._renderer = renderer;
            this._pVelocity = new THREE.Vector3(0, 0, 0.2);
            this._pRotationDegree = new THREE.Vector3(0, 0, 0);
            this._pDirection = new THREE.Vector3(0, 0, 1);
            this._pQuaternion = new THREE.Quaternion();
            this._initBackground();
            this._initPlayerAirplane();
        }
        Main.prototype._initBackground = function () {
            var materials = [
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/px.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/nx.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/py.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/ny.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/pz.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/nz.jpg') })
            ];
            var mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000, 7, 7, 7), new THREE.MeshFaceMaterial(materials));
            mesh.scale.x = -1;
            this._scene.add(mesh);
        };
        Main.prototype._initPlayerAirplane = function () {
            var _this = this;
            var loader = new THREE.JSONLoader();
            loader.load('assets/f14_blender/f14.json', function (geometry, materials) { return _this._onLoadBlenderJson(geometry, materials); }, 'assets/f14_blender/');
        };
        Main.prototype._onLoadBlenderJson = function (geometry, materials) {
            var faceMaterial = new THREE.MeshFaceMaterial(materials);
            var mesh = new THREE.Mesh(geometry, faceMaterial);
            //mesh.position.set( 0,-30,0);
            mesh.scale.set(10, 10, 10);
            mesh.rotateX(-90 * Math.PI / 180);
            this._playerMesh = mesh;
            this._playerAirplane = new THREE.Object3D();
            //this._playerAirplane.add(mesh);
            this._playerAirplaneRotX = new THREE.Object3D();
            this._playerAirplaneRotX.add(mesh);
            this._playerAirplane.add(this._playerAirplaneRotX);
            this._playerAirplane.position.set(0, 0, 0);
            //this._scene.add( this._playerAirplane );
            this._testAirplanes = [];
            for (var i = 0; i < 9; i++) {
                var obj = new THREE.Object3D();
                var testMesh = mesh.clone();
                obj.add(testMesh);
                testMesh.scale.set(5, 5, 5);
                this._scene.add(obj);
                this._testAirplanes.push(obj);
            }
            this._testAirplanes[0].position.set(-100, -100, 0);
            this._testAirplanes[1].position.set(0, -100, 0);
            this._testAirplanes[2].position.set(100, -100, 0);
            this._testAirplanes[3].position.set(-100, 0, 0);
            this._testAirplanes[4].position.set(0, 0, 0);
            this._testAirplanes[5].position.set(100, 0, 0);
            this._testAirplanes[6].position.set(-100, 100, 0);
            this._testAirplanes[7].position.set(0, 100, 0);
            this._testAirplanes[8].position.set(100, 100, 0);
            this._onReady();
        };
        Main.prototype._onReady = function () {
            var _this = this;
            document.addEventListener('keydown', function (e) { return _this.onDocumentKeyDown(e); }, false);
            document.addEventListener('keyup', function (e) { return _this.onDocumentKeyUp(e); }, false);
            this._tick();
        };
        Main.prototype._tick = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this._tick(); });
            //this._playerAirplane.position.x -= this._pVelocity.x;
            //this._playerAirplane.position.y -= this._pVelocity.y;
            //this._playerAirplane.position.z -= this._pVelocity.z;
            var deltaRotZ = 0;
            var deltaRotX = 0;
            if (this._keyLeft && !this._keyRight) {
                this._pRotationDegree.z += 2;
                deltaRotZ = 2 * Math.PI / 180;
            }
            else if (this._keyRight && !this._keyLeft) {
                this._pRotationDegree.z -= 2;
                deltaRotZ = -2 * Math.PI / 180;
            }
            else {
            }
            if (this._keyTop && !this._keyBottom) {
                this._pRotationDegree.x -= 2;
                deltaRotX = -2 * Math.PI / 180;
            }
            else if (this._keyBottom && !this._keyTop) {
                this._pRotationDegree.x += 2;
                deltaRotX = 2 * Math.PI / 180;
            }
            else {
            }
            var radX = this._pRotationDegree.x * Math.PI / 180;
            var radY = this._pRotationDegree.y * Math.PI / 180;
            var radZ = this._pRotationDegree.z * Math.PI / 180;
            var dxz = Math.cos(radZ) + Math.sin(radZ);
            var dyz = -Math.sin(radZ) + Math.cos(radZ);
            var dzz = 1;
            var dxy = dxz * Math.cos(radY) - dzz * Math.sin(radY);
            var dyy = dyz;
            var dzy = dxz * Math.sin(radY) + dzz * Math.cos(radY);
            var dxx = dxy;
            var dyx = dyy * Math.cos(radX) + dzy * Math.sin(radX);
            var dzx = -dyy * Math.sin(radX) + dzy * Math.cos(radX);
            //this._playerAirplane.rotateX();
            //this._playerAirplane.rotation.z = this._pRotationDegree.z * Math.PI / 180;
            //this._playerAirplaneRotX.rotation.x = this._pRotationDegree.x * Math.PI / 180;
            //this._playerAirplane.useQuaternion = true;
            if (!this._dummy) {
                console.log('d1=' + dxz + ',' + dyz + ',' + dzz);
                console.log('d2=' + dxy + ',' + dyy + ',' + dzy);
                console.log('d3=' + dxx + ',' + dyx + ',' + dzx);
                this._dummy = true;
            }
            if (this._keyLeft || this._keyRight) {
                this._rotateOrder = 'XZY';
            }
            if (this._keyTop || this._keyBottom) {
                this._rotateOrder = 'ZXY';
            }
            //            this._rotateOrder = 'XZY';
            this._rotateOrder = 'ZXY';
            //    var euler:THREE.Euler = new THREE.Euler((dxx-dxz) ,(dyx-dyz) , (dzx-dzz) , order);
            var euler = new THREE.Euler(radX, radY, radZ, this._rotateOrder);
            //this._playerAirplane.quaternion.setFromEuler(euler);
            this._playerAirplane.setRotationFromEuler(euler);
            this._testAirplanes[0].rotation.x = radX;
            this._testAirplanes[0].rotation.y = radY;
            this._testAirplanes[0].rotation.z = radZ;
            this._testAirplanes[1].setRotationFromEuler(new THREE.Euler(radX, radY, radZ, 'ZXY'));
            this._testAirplanes[2].quaternion.setFromEuler(new THREE.Euler(radX, radY, radZ, 'ZXY'));
            this._testAirplanes[3].quaternion.setFromEuler(new THREE.Euler(radX, radY, radZ, 'XYZ'));
            //this._testAirplanes[4].quaternion.setFromEuler(new THREE.Euler(radX,radY,radZ , 'XZY'));
            //            this._testAirplanes[5].quaternion.setFromEuler(new THREE.Euler(radX,radY,radZ , 'YXZ'));
            //this._testAirplanes[6].quaternion.setFromEuler(new THREE.Euler(radX,radY,radZ , 'YZX'));
            //this._testAirplanes[7].quaternion.setFromEuler(new THREE.Euler(radX,radY,radZ , 'ZXY'));
            //this._testAirplanes[8].quaternion.setFromEuler(new THREE.Euler(radX,radY,radZ , 'ZYX'));
            var quotZ = new THREE.Quaternion();
            var quotX = new THREE.Quaternion();
            quotZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), radZ);
            quotX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), radX);
            //            this._testAirplanes[4].quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1) , radZ).multiply(quotX);
            this._testAirplanes[4].quaternion.multiplyQuaternions(quotX, quotZ);
            this._testAirplanes[5].quaternion.multiplyQuaternions(quotZ, quotX);
            //this._testAirplanes[4].quaternion = quotZ;
            var quotDeltaZ = new THREE.Quaternion();
            var quotDeltaX = new THREE.Quaternion();
            quotDeltaZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), deltaRotZ);
            quotDeltaX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaRotX);
            this._testAirplanes[6].quaternion.multiply(quotDeltaZ);
            this._testAirplanes[7].quaternion.multiply(quotDeltaZ).multiply(quotDeltaX);
            this._pQuaternion.multiply(quotDeltaZ).multiply(quotDeltaX);
            this._testAirplanes[8].quaternion.set(this._pQuaternion.x, this._pQuaternion.y, this._pQuaternion.z, this._pQuaternion.w);
            //this._controls.update();
            this._renderer.render(this._scene, this._camera);
            this._stats.update();
        };
        Main.prototype.onDocumentKeyDown = function (e) {
            switch (e.keyCode) {
                case 37:
                    this._keyLeft = true;
                    break;
                case 38:
                    this._keyTop = true;
                    break;
                case 39:
                    this._keyRight = true;
                    break;
                case 40:
                    this._keyBottom = true;
                    break;
            }
        };
        Main.prototype.onDocumentKeyUp = function (e) {
            switch (e.keyCode) {
                case 37:
                    this._keyLeft = false;
                    break;
                case 38:
                    this._keyTop = false;
                    break;
                case 39:
                    this._keyRight = false;
                    break;
                case 40:
                    this._keyBottom = false;
                    break;
            }
        };
        return Main;
    })();
    myLib.Main = Main;
})(myLib || (myLib = {}));
window.onload = function () {
    new myLib.Main();
};
//# sourceMappingURL=main003.js.map