/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/three.d.ts"/>
/// <reference path="../libs/threeTrackball.js.my.d.ts"/>
// 背景を追加してみる
var myLib;
(function (myLib) {
    var Main002 = (function () {
        function Main002() {
            var _this = this;
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
            camera.position.set(0, 0, 200);
            this._controls = new THREE.TrackballControls(camera);
            var renderer = new THREE.WebGLRenderer();
            if (renderer == null) {
                alert('あなたの環境はWebGLは使えません');
            }
            renderer.setSize(width, height);
            document.body.appendChild(renderer.domElement);
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(0, 0.7, 0.7);
            scene.add(directionalLight);
            var materials = [
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/px.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/nx.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/py.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/ny.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/pz.jpg') }),
                new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('assets/skybox/nz.jpg') })
            ];
            var mesh = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000, 7, 7, 7), new THREE.MeshFaceMaterial(materials));
            mesh.scale.x = -1;
            scene.add(mesh);
            var loader = new THREE.JSONLoader();
            loader.load('assets/f14_blender/f14.json', function (geometry, materials) { return _this._onLoadBlenderJson(geometry, materials); }, 'assets/f14_blender/');
            this._camera = camera;
            this._scene = scene;
            this._renderer = renderer;
            this._tick();
        }
        Main002.prototype._onLoadBlenderJson = function (geometry, materials) {
            var faceMaterial = new THREE.MeshFaceMaterial(materials);
            var mesh = new THREE.Mesh(geometry, faceMaterial);
            mesh.position.set(0, 0, 0);
            mesh.scale.set(10, 10, 10);
            mesh.rotateX(-90 * Math.PI / 180);
            this._scene.add(mesh);
        };
        Main002.prototype._tick = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this._tick(); });
            this._controls.update();
            this._renderer.render(this._scene, this._camera);
            this._stats.update();
        };
        return Main002;
    })();
    myLib.Main002 = Main002;
})(myLib || (myLib = {}));
window.onload = function () {
    new myLib.Main002();
};
//# sourceMappingURL=main002.js.map