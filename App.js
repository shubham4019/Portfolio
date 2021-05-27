//import { Vector2, Raycaster } from "three";
import {OrbitControls} from "./OrbitControls.js";
const BLUE = 0x45edd1;

var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.z=5;

        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor("#e5e5e5");
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        window.addEventListener("resize", ()=>{
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect=window.innerWidth/window.innerHeight;

            camera.updateProjectionMatrix();
        });

        var mouse = new THREE.Vector2();
        var raycast = new THREE.Raycaster();
        var intersects;
        var clickedBox;

        var cubes=[];
        function createCubes(){
            for(var i=0; i<90; i++){
                var geometry = new THREE.BoxGeometry(1, 1, 1);
                var material = new THREE.MeshLambertMaterial({color: 0x0036bc});

                cubes[i]= (new THREE.Mesh(geometry, material));


                cubes[i].position.x=(Math.random()-0.5)*20;
                cubes[i].position.y=(Math.random()-0.5)*20;
                cubes[i].position.z=(Math.random()-0.5)*20;

                cubes[i].rotation.x=(Math.random()-0.5)*20;
                cubes[i].rotation.y=(Math.random()-0.5)*20;
                cubes[i].rotation.z=(Math.random()-0.5)*20;

                cubes[i].userData.value=`${i}`;

                scene.add(cubes[i]);
            }
        }

        createCubes();

        cubes[3].material.color.set(BLUE);

        var light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, 5);
        scene.add(light);

        light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, 25);
        scene.add(light);

        window.addEventListener("mousemove", onMouseMove, false);
        window.addEventListener("click", onClick);

        const control = new OrbitControls(camera, renderer.domElement);
        control.maxPolarAngle=Math.PI*0.5;
        control.maxdistance=100;
        control.mindistance=-100;


        function onMouseMove(event){
            mouse.x = (event.clientX / window.innerWidth)*2 -1;
            mouse.y = -(event.clientY / window.innerHeight)*2 +1;
        }

        function hover(){
            raycast.setFromCamera(mouse, camera);
            intersects = raycast.intersectObjects(scene.children);

            for(var i=0; i<intersects.length; i++){
                intersects[i].object.material.transparent = true;
                intersects[i].object.material.opacity = 0.5;
                intersects[i].object.material.color.set(BLUE);
            }
        }

        function reset(){
            for( var i=0; i<scene.children.length; i++){
                if(scene.children[i].material){
                    scene.children[i].material.opacity= (scene.children[i].userData.value==clickedBox? 0.8 : 1.0);
                    scene.children[i].material.color.set(scene.children[i].userData.value==clickedBox? 0xbc0404:0xf7f7f7);
                }
            }
        }

        function onClick(){
            raycast.setFromCamera(mouse, camera);
            intersects = raycast.intersectObjects(scene.children);
            if(intersects.length>0){
                clickedBox = intersects[0].object.userData.value;
            }
        }

        const loader = new THREE.TextureLoader();
            loader.load('X6PjOyY-black-gradient-wallpaper.png' , (texture)=>{
                scene.background = texture;  
            });

        createjs.Ticker.timingMode=createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", animate);


        // theta=0.1;
        function animate(){
            // theta +=0.1;
            // camera.position.x=radius*(Math.sin(THREE.MathUtils.degToRad(theta)));
            // camera.position.y=radius*(Math.sin(THREE.MathUtils.degToRad(theta)));
            // camera.position.z=radius*(Math.cos(THREE.MathUtils.degToRad(theta)));
            // camera.lookAt(scene.position);

            // camera.updateMatrixWorld();

            reset();
            hover();
            renderer.render(scene, camera);
        }