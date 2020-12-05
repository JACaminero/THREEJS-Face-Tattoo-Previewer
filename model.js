let head, headMesh, headTexture
let currentSvg, currentColor, currentSize = 100
let price
let currentTranslation = {
    u: 350,
    v: 250,
    size: 0.006 
}

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xF0F0F0)
var camera = new THREE.PerspectiveCamera(
    100, window.innerWidth / window.innerHeight, 1, 1000 
);
camera.position.set( -1, 1, 2 )

let canvasContainer = document.getElementsByClassName("canvas-container")[0]

var renderer = new THREE.WebGLRenderer();
renderer.setSize( canvasContainer.offsetWidth, window.innerHeight );
canvasContainer.appendChild( renderer.domElement );
renderer.setClearColor(0x010101, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var controls = new THREE.OrbitControls(camera, renderer.domElement);

const ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

const spotLight = new THREE.SpotLight( {color: 0xf0f0f0} );
spotLight.position.set( 20, 0, 40 )
spotLight.intensity = 0.5;
scene.add( spotLight ); 

var groundGeometry = new THREE.BoxGeometry( 0.5, 0.000001, 0.5 );
var groundMaterial = new THREE.MeshPhongMaterial( {
    color: 0xF0F0F0,
    shininess: 150,
    specular: 0xF0F0F0,
} );

var ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.scale.multiplyScalar( 3 );
ground.castShadow = false;
ground.receiveShadow = true;
ground.position.y = -1.2;
scene.add( ground );

var loadModel = (canvas) => {
    const loader = new THREE.GLTFLoader();
    loader.load( 'head/scene.gltf', ( obj ) => {
        head = obj.scene.children[0].children[0].children[0].children[0].children[0]
        headMesh = head.children[0]
        head.scale.set( 1,1,1 )
        headMesh.receiveShadow = true
        headMesh.material.color = new THREE.Color( 0xA3A3A3 )
        headMesh.material.map = canvas

        scene.add( head )
    })
}

var createCanvasTexture = (contentDocument) => {
    var c = document.getElementById("myCanvas");
    c.setAttribute("width", 1065)
    c.setAttribute("height", 800)
    var ctx = c.getContext("2d")

    const xml = new XMLSerializer().serializeToString(contentDocument),
    uri = `data:image/svg+xml;base64,${btoa(xml)}`
    
    var img = new Image()
    img.onload = () => {       
        ctx.drawImage(img,0,0)
    }
    img.src = uri

    return new THREE.CanvasTexture(c)
}

var loadHead = () => {
    var svgDoc = document.getElementById(currentSvg).contentDocument

    var gTag = svgDoc.getElementById('ga')
    gTag.setAttribute( 'fill', currentColor )
    gTag.setAttribute(
        'transform', `translate(${currentTranslation.u}, ${currentTranslation.v}) scale(${currentTranslation.size},-${currentTranslation.size})`)
    var canvas = createCanvasTexture(svgDoc)

    loadModel(canvas) 
    price = currentSize * 100 
    price += currentColor == "#000000" ? 0 : 300
    document.getElementById('cost').textContent = `PRICE: ${price}.00`
}

var range = document.getElementById("rangeSize")
range.onchange = () => {
    var trueRange = range.value * (1/1000)
    currentSize = range.value
    currentTranslation.size = trueRange 
    loadHead()
}

var btnUp = document.getElementById('btn-up').onclick = () => {
    currentTranslation.v -= 10 
    loadHead()
}

var btnDown = document.getElementById('btn-down').onclick = () => {
    currentTranslation.v += 10 
    loadHead()
}
var btnRight = document.getElementById('btn-right').onclick = () => {
    currentTranslation.u += 10 
    loadHead()
}
var btnLeft = document.getElementById('btn-left').onclick = () => {
    currentTranslation.u -= 10 
    loadHead()
}
var btnReset = document.getElementById('btn-reset').onclick = () => {
    currentTranslation.u = 350
    currentTranslation.v = 250
    currentTranslation.size = 0.006
    loadHead()
}

var selectOnChange = (obj) => {
    currentSvg = obj.value 
    loadHead()
}

var colorButton = document.getElementById("primary_color");
var colorDiv = document.getElementById("color_val");
colorButton.value = '#000000'
colorDiv.innerHTML = '#000000'
colorButton.onchange = () => {
    colorDiv.innerHTML = colorButton.value;
    colorDiv.style.color = colorButton.value;
    currentColor = colorDiv.textContent
    loadHead()
}

const loader = new THREE.GLTFLoader();
loader.load( 'head/scene.gltf', ( gltf ) => {
    head = gltf.scene.children[0].children[0].children[0].children[0].children[0]
    headMesh = head.children[0]
    head.scale.set( 1,1,1 )
    headMesh.receiveShadow = true
    headMesh.material.color = new THREE.Color(0xA3A3A3)
    scene.add( head )
})

controls.enableZoom = false
controls.enablePan = false
controls.update();

var animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

