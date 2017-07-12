/// <reference path="../libs/stats.d.ts"/>
/// <reference path="../libs/three.d.ts"/>
/// <reference path="../libs/threeTrackball.js.my.d.ts"/>

// 背景を追加してみる
module myLib
{
    export class Main002{
        private _stats:Stats;


        private _camera:THREE.PerspectiveCamera;
        private _scene:THREE.Scene;
        private _renderer:THREE.WebGLRenderer;

        private _controls:THREE.TrackballControls;

        constructor(){
            this._stats = new Stats();
            document.getElementById('stats').appendChild( this._stats.domElement);

            var scene:THREE.Scene = new THREE.Scene();

            var width:number = 960;
            var height:number = 640;
            var fov:number = 60;
            var aspect:number = width/height;
            var near:number = 1;
            var far:number = 1000000;
            var camera:THREE.PerspectiveCamera = new THREE.PerspectiveCamera(fov, aspect , near , far);
            camera.position.set(0,0,200);

            this._controls = new THREE.TrackballControls(camera);

            var renderer:THREE.WebGLRenderer = new THREE.WebGLRenderer();
            if (renderer == null) {
                alert('あなたの環境はWebGLは使えません');
            }

            renderer.setSize( width, height );
            document.body.appendChild( renderer.domElement );



            var directionalLight:THREE.DirectionalLight = new THREE.DirectionalLight( 0xffffff );
            directionalLight.position.set( 0, 0.7, 0.7 );
            scene.add( directionalLight );

            var materials = [
                new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/skybox/px.jpg' ) } ), // right
                new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/skybox/nx.jpg' ) } ), // left
                new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/skybox/py.jpg' ) } ), // top
                new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/skybox/ny.jpg' ) } ), // bottom
                new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/skybox/pz.jpg' ) } ), // back
                new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'assets/skybox/nz.jpg' ) } )  // front
            ];
            var mesh = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
            mesh.scale.x = - 1;
            scene.add(mesh);


            var loader:THREE.JSONLoader = new THREE.JSONLoader();
            loader.load('assets/f14_blender/f14.json' , (geometry, materials)=>this._onLoadBlenderJson(geometry, materials) ,'assets/f14_blender/' );


            this._camera = camera;
            this._scene = scene;

            this._renderer = renderer;

            this._tick();
        }
        private _onLoadBlenderJson(geometry, materials):void
        {
            var faceMaterial = new THREE.MeshFaceMaterial( materials );
            var mesh = new THREE.Mesh( geometry, faceMaterial );
            mesh.position.set( 0,0,0);
            mesh.scale.set( 10, 10, 10 );
            mesh.rotateX(-90 * Math.PI / 180);
            this._scene.add( mesh );
        }



        private _tick():void
        {

            requestAnimationFrame( () => this._tick() );

            this._controls.update();
            this._renderer.render( this._scene, this._camera );

            this._stats.update();

        }



    }

}


window.onload = function ()
{
    new myLib.Main002();
};