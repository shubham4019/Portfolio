const BLUE = 0x45edd1;
var radius = -5;
if(window.innerWidth<600){
    radius=-30;
}

var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
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

        var cubeNum=150;
        var cubes=[];
        function createCubes(){
            for(var i=0; i<cubeNum; i++){
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

        var light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, 0);
        scene.add(light);

        var light1 = new THREE.PointLight(0xffffff, 1, 1000);
        // var help1 = new THREE.PointLightHelper(light1);
        light1.position.set(0, 0, 25);
        scene.add(light1);

        light1 = new THREE.PointLight(0xffffff, 1, 1000);
        // help1 = new THREE.PointLightHelper(light1);
        light1.position.set(0, 25, 0);
        scene.add(light1);

        light1 = new THREE.PointLight(0xffffff, 1, 1000);
        // help1 = new THREE.PointLightHelper(light1);
        light1.position.set(25, 0, 0);
        scene.add(light1);

        light1 = new THREE.PointLight(0xffffff, 1, 1000);
        // help1 = new THREE.PointLightHelper(light1);
        light1.position.set(-25, 0, 0);
        scene.add(light1);


        light1 = new THREE.PointLight(0xffffff, 1, 1000);
        // help1 = new THREE.PointLightHelper(light1);
        light1.position.set(0, -25, 0);
        scene.add(light1);


        light1 = new THREE.PointLight(0xffffff, 1, 1000);
        // help1 = new THREE.PointLightHelper(light1);
        light1.position.set(0, 0, -25);
        scene.add(light1);
        // const help = new THREE.PointLightHelper(light);
        // const help1 = new THREE.PointLightHelper(light1);
        // scene.add(help);
        // scene.add(help1);

        // const gridhelp = new THREE.GridHelper(100, 100);
        // scene.add(gridhelp);

        window.addEventListener("mousemove", onMouseMove, false);
        window.addEventListener("touchstart", startTouch, false);
        window.addEventListener("touchmove", onTouchMove, false);
        window.addEventListener("click", onClick);
        window.addEventListener("wheel", onWheel);

        var startY, startX;
        function startTouch(event){
            var tObj = event.changedTouches[0];
            startX= parseInt(tObj.clientX);
            startY= parseInt(tObj.clientY);
        }


        function onTouchMove(event){
            var touchobj = event.changedTouches[0] // reference first touch point for this event
            var dist1 = parseInt(touchobj.clientX) - startX;
            var dist2 = parseInt(touchobj.clientY) - startY;
            
            var n1 = Math.sqrt(dist1**2 + dist2**2);

            if(dist2>=0){
                var dist = n1;
            }else{
                dist = -n1;
            }

            radius += dist*0.001;

            for (var i=0; i<cubeNum; i++){
                cubes[i].rotation.x +=dist*0.0005;
                cubes[i].rotation.y +=dist*0.0005;
            }
        }

        function onMouseMove(event){
            mouse.x = (event.clientX / window.innerWidth)*2 -1;
            mouse.y = -(event.clientY / window.innerHeight)*2 +1;
        }

        function hover(){
            raycast.setFromCamera(mouse, camera);
            intersects = raycast.intersectObjects(scene.children);

            for(var i=0; i<intersects.length; i++){
                intersects[i].object.material.transparent = true;
                intersects[i].object.material.opacity = 0.9;
                intersects[i].object.material.color.set(Math.random()*0xffffff);
            }
        }



        function onClick(){
            raycast.setFromCamera(mouse, camera);
            intersects = raycast.intersectObjects(scene.children);
            if(intersects.length>0){
                clickedBox = intersects[0].object.userData.value;
            }
            for( var i=0; i<scene.children.length; i++){
                if(scene.children[i].material){
                    scene.children[i].material.opacity= (scene.children[i].userData.value==clickedBox? 0.8 : 1.0);
                    scene.children[i].material.color.set(scene.children[i].userData.value==clickedBox? BLUE:0xf7f7f7);
                }
            }
        }
        var y=0;

        function onWheel(event){
            y=event.wheelDeltaY*0.001;
            radius-=y;

            for(var i=0; i<cubeNum; i++){
                cubes[i].rotation.x +=y*2;
                cubes[i].rotation.y +=y*2;
            }
        }

        const loader = new THREE.TextureLoader();
            loader.load('X6PjOyY-black-gradient-wallpaper.png' , (texture)=>{
                scene.background = texture;  
            });

        createjs.Ticker.timingMode=createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", animate);

        var theta = 0.1;

        function cameraRev(){
            theta +=0.1;
            camera.position.x=radius*(Math.sin(THREE.MathUtils.degToRad(theta)));
            camera.position.y=radius*(Math.sin(THREE.MathUtils.degToRad(theta)));
            camera.position.z=radius*(Math.cos(THREE.MathUtils.degToRad(theta)));
            

            camera.lookAt(scene.position);
            camera.updateMatrixWorld();
        }

        function animate(){
            cameraRev();
            hover();

            renderer.render(scene, camera);
        }