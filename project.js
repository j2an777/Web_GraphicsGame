var gl;
var points = [];
var normals = [];
var texCoords = [];

var program0, program1, program2; // 0 : color, 1 : phong , 2 : texture mapping
var modelMatrixLoc0, viewMatrixLoc0, modelMatrixLoc1, viewMatrixLoc1, modelMatrixLoc2, viewMatrixLoc2;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertCubeStart, numVertObjectTri, numVertCubeTri, vertPyraStart, numVertPyraTri, vertGroundStart, numVertGroundTri, numVertGroundTri;
var vertObjectStart = vec3(0.0, 3.0, 7.0);

var eyePos = vec3(-0.2, 2.0, 8.5);
var atPos = vec3(0.0, 0.0, 0.0);
var upVec = vec3(0.0, 1.0, 0.0);
var cameraVec = vec3(0.0, -0.7071, -0.7071); // 1.0/Math.sqrt(2.0)

const moveLeft = 0;
const moveRight = 1;
const moveUp = 2;
const moveDown = 3;

var theta = 0;
var prevTime = new Date();

var image0 = new Image();
image0.src = "../images/brick_color.bmp"

var image1 = new Image();
image1.src = "../images/brick_color.bmp"

var image2 = new Image();
image2.src = "../images/horror.bmp"

var image3 = new Image();
image3.src = "../images/horror2.bmp"

var objectPos2 = [];
var objectPos3 = [];
var objectPos4 = [];
var prevXPos = 3;
var objectDirection = true;

const objectPos = [
     //x축
     //x, 1.3, -10
     vec3(-10, 3, -10), vec3(-8, 3, -10), vec3(-6, 3, -10),
     vec3(-4, 3, -10), vec3(-2, 3, -10), vec3(0, 3, -10),
     vec3(2, 3, -10), vec3(4, 3, -10), vec3(6, 3, -10),
     vec3(8, 3, -10), vec3(10, 3, 10), vec3(-10, 3, 10),
     vec3(-8, 3, 10), vec3(-6, 3, 10), vec3(-4, 3, 10),
     vec3(-2, 3, 10), vec3(0, 3, 10), vec3(2, 3, 10),
     vec3(4, 3, 10), vec3(6, 3, 10), vec3(8, 3, 10),
     vec3(10, 3, 10), vec3(-6, 3, -4), vec3(-4, 3, -4),
     vec3(-2, 3, -4), vec3(-0 ,3, -4), vec3(2, 3, -4),
     vec3(4, 3, -4), vec3(6, 3, -4),
    //z축
    //  var z=0; z<10; z+=2
    // 2, 1.3, z
    vec3(2, 3, 0), vec3(2, 3, 2), vec3(2, 3, 4),
    vec3(2, 3, 6), vec3(2, 3, 8), vec3(2, 3, 10),
    vec3(-2, 3, 0), vec3(-2, 3, 2), vec3(-2, 3, 4),
    vec3(-2, 3, 6), vec3(-2, 3, 8), vec3(-2, 3, 10),
    vec3(-10, 3, -10), vec3(-10, 3, -8), vec3(-10, 3, -6),
    vec3(-10, 3, -4), vec3(-10, 3, -2), vec3(-10, 3, -0),
    vec3(-10, 3, 2), vec3(-10, 3, 4), vec3(-10, 3, 6),
    vec3(-10, 3, 8), vec3(-10, 3, 10), vec3(10, 3, 10),
    vec3(10, 3, 8), vec3(10, 3, 6), vec3(10, 3, 4),
    vec3(10, 3, 2), vec3(10, 3, 0), vec3(10, 3, -2),
    vec3(10, 3, -4), vec3(-6, 3, -3), vec3(-6, 3, -2),
    vec3(-6, 3, -1), vec3(-6, 3, -0), vec3(-6, 3, 1),
    vec3(-6, 3, 2), vec3(-6, 3, 3), vec3(-6, 3, 4),
    vec3(-6, 3, 5)
];

const groundScale = 10;

function detectCollision(newPosX, newPosZ) {
    if (newPosX < -groundScale || newPosX > groundScale || newPosZ < -groundScale || newPosZ > groundScale) {
        alert("진짜 원뿔을 찾았다!");
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        return true;
    }
    
    for(var index = 0; index < objectPos.length; index++) {
        if (Math.abs(newPosX - objectPos[index][0]) < 1.0 && Math.abs(newPosZ - objectPos[index][2]) < 1.0)
            return true;
    }
    
    for(var index2 = 0; index2 < objectPos2.length; index2++) {
        if (Math.abs(newPosX - objectPos2[0]) < 1.0 && Math.abs(newPosZ - objectPos2[2]) < 1.0) {
            alert("경고! 도망가세요!");
            return true;
        }
    }
    for(var index3 = 0; index3 < objectPos3.length; index3++) {
        if (Math.abs(newPosX - objectPos3[0]) < 1.0 && Math.abs(newPosZ - objectPos3[2]) < 1.0) {
            alert("경고! 도망가세요!");
            return true;
        }
    }
    for(var index4 = 0; index4 < objectPos4.length; index4++) {
        if (Math.abs(newPosX - objectPos4[0]) < 1.0 && Math.abs(newPosZ - objectPos4[2]) < 1.0) {
            alert("가짜 원뿔입니다. 진짜를 찾으세요.");
            return true;
        }
    }
    return false;
};

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateTexGround(10);
    generateTexCube();
    generateObjectCube();
    generateHexaPyramid();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable hidden-surface 
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.01, 1);

    // Load shaders and initialize attribute buffers
    program0 = initShaders(gl, "colorVS", "colorFS");
    gl.useProgram(program0);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program0, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //var modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrixLoc0 = gl.getUniformLocation(program0, "modelMatrix");
    
    viewMatrixLoc0 = gl.getUniformLocation(program0, "viewMatrix");
    
    var aspect = canvas.width / canvas.height;
    var projectionMatrix = perspective(90, aspect, 0.1, 1000); 

    var projectionMatrixLoc = gl.getUniformLocation(program0, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    ///////////////////////////////////////////////////////////////////////////
    // Event listeners for buttons

    program1 = initShaders(gl, "phongVS", "phongFS");
    gl.useProgram(program1);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //create a buffer objectm initalize it, and associate it with
    // the associated attribute variable in our vertex shader
    var nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals),gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program1, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    modelMatrixLoc1 = gl.getUniformLocation(program1, "modelMatrix");
    viewMatrixLoc1 = gl.getUniformLocation(program1, "viewMatrix");

    projectionMatrixLoc = gl.getUniformLocation(program1, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program1);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // program2 : Texture Mapping

    program2 = initShaders(gl, "texMapVS", "texMapFS");
    gl.useProgram(program2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    vNormal = gl.getAttribLocation(program2, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var tBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program2, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    modelMatrixLoc2 = gl.getUniformLocation(program2, "modelMatrix");
    viewMatrixLoc2 = gl.getUniformLocation(program2, "viewMatrix");

    projectionMatrixLoc = gl.getUniformLocation(program2, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program2);
    setTexture();
   
    render();
};

function cameraMove(direction) {
    var sinTheta = Math.sin(0.1);
    var cosTheta = Math.cos(0.1);
    switch(direction) {
        case moveLeft :
            var newVecX = cosTheta * cameraVec[0] + sinTheta * cameraVec[2];
            var newVecZ = -sinTheta * cameraVec[0] + cosTheta * cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case moveRight :
            var newVecX = cosTheta * cameraVec[0] - sinTheta * cameraVec[2];
            var newVecZ = sinTheta * cameraVec[0] + cosTheta * cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case moveUp :
            var newPosX = eyePos[0] + 0.5 * cameraVec[0];
            var newPosZ = eyePos[2] + 0.5 * cameraVec[2];
            if (!detectCollision(newPosX, newPosZ)) {
                eyePos[0] = newPosX;
                eyePos[2] = newPosZ;
            }
            break;
        case moveDown :
            var newPosX = eyePos[0] - 0.5 * cameraVec[0];
            var newPosZ = eyePos[2] - 0.5 * cameraVec[2];
            if (!detectCollision(newPosX, newPosZ)) {
                eyePos[0] = newPosX;
                eyePos[2] = newPosZ;
            }
            break;
    }
}
window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:    // left arrow
        case 65:    // 'A'
        case 97:    // 'a'
            cameraMove(moveLeft);
            break;
        case 39:    // right arrow
        case 68:    // 'D'
        case 100:   // 'd'
            cameraMove(moveRight);
            break;
        case 38:    // up arrow
        case 87:    // 'W'
        case 119:   // 'w'
            cameraMove(moveUp);
            break;
        case 40:    // down arrow
        case 83:    // 'S'
        case 115:   // 's'
            cameraMove(moveDown);
            break;
    }
    render();
};

function setLighting(program) {
    var lightSrc = [0.0, 1.0, 0.0, 0.0];
    var lightAmbient = [0.0, 0.0, 0.0, 1.0];
    var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
    var lightSpecular = [1.0, 1.0, 1.0, 1.0];
    
    var matAmbient = [1.0, 1.0, 1.0, 1.0];
    var matDiffuse = [1.0, 1.0, 1.0, 1.0];
    var matSpecular = [1.0, 1.0, 1.0, 1.0];
    
    var ambientProduct = mult(lightAmbient, matAmbient);
    var diffuseProduct = mult(lightDiffuse, matDiffuse);
    var specularProduct = mult(lightSpecular, matSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "lightSrc"), lightSrc);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct);

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), 100.0);
    gl.uniform3fv(gl.getUniformLocation(program, "eyePos"), flatten(eyePos));
};

function setTexture() {
    var texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var texture3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let currTime = new Date();
    let elapsedTime = currTime.getTime() - prevTime.getTime();
    theta += (elapsedTime / 2);
    prevTime = currTime;

    atPos[0] = eyePos[0] + cameraVec[0];
    atPos[1] = eyePos[1] + cameraVec[1];
    atPos[2] = eyePos[2] + cameraVec[2];
    var viewMatrix = lookAt(eyePos, atPos, upVec);
    gl.useProgram(program0);
    gl.uniformMatrix4fv(viewMatrixLoc0, false, flatten(viewMatrix));
    gl.useProgram(program1);
    gl.uniformMatrix4fv(viewMatrixLoc1, false, flatten(viewMatrix));
    gl.uniform3fv(gl.getUniformLocation(program1, "eyePos"), flatten(eyePos));
    gl.useProgram(program2);
    gl.uniformMatrix4fv(viewMatrixLoc2, false, flatten(viewMatrix));
    gl.uniform3fv(gl.getUniformLocation(program2, "eyePos"), flatten(eyePos));
      
    var uColorLoc = gl.getUniformLocation(program0, "uColor");
    var diffuseProductLoc = gl.getUniformLocation(program1, "diffuseProduct");
    var textureLoc = gl.getUniformLocation(program2, "texture");
    
    // draw a fake hexa-pyramid
    gl.useProgram(program0);
    gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.5);    // translucent blue
    //gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 1.0, 1.0);

    modelMatrix = mult(translate(6, -0.5, 8), rotateZ(180));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

    objectPos4.push(6, -0.5, 8);

    // draw a real hexa-pyramid
    gl.useProgram(program0);
    gl.uniform4f(uColorLoc, 0.0, 1.0, 1.0, 0.5);    // translucent blue
    //gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 1.0, 1.0);
    
    modelMatrix = mult(translate(9.5, -0.5, -8.5), rotateZ(180));
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

    objectPos4.push(9.5, -0.5, -8.5);

    // draw the ground
    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 0);
        
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(trballMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);

    for (var z = -10; z < 10; z += 2) {
        // draw a cube
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 1);
        
        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(-10, 1.3, z), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(10, 1.3, z+4), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

     
        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(-10, 0.3, z), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(10, 0.3, z+4), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(-10, 2.3, z), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(10, 2.3, z+4), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
;
    }
    for (var z = 0; z < 10; z += 2) {
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 1);
        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(2, 1.3, z), rMatrix);
    
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(-2, 1.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(2, 0.3, z), rMatrix);
    
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(-2, 0.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
        var rMatrix = mult(rotateY(0), rotateZ(0));

        modelMatrix = mult(translate(2, 2.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(-2, 2.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    }
    for(var z = -3; z < 6; z += 2){
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 1);
        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(-6, 0.3, z), rMatrix);
    
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(-6, 1.3, z), rMatrix);
    
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(-6, 2.3, z), rMatrix);
    
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    }
    for (var x = -10; x < 10; x += 2) {
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 1);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(x, 1.3, -10), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(x, 1.3, 10), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(x, 0.3, -10), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(x, 0.3, 10), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(x, 2.3, -10), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = mult(translate(x, 2.3, 10), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    }
    for (var x = -6; x < 9; x += 2) {
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 1);

        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(x, 2.3, -4), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);


        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(x, 1.3, -4), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        
        var rMatrix = mult(rotateY(0), rotateZ(0));
        modelMatrix = mult(translate(x, 0.3, -4), rMatrix);
        
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    }
    objectPos2 = [];
    var zPos;
    if (objectDirection)
        zPos = prevXPos + elapsedTime / 500;
    else
        zPos = prevXPos - elapsedTime / 500;
    if (zPos > (groundScale - 4))
        objectDirection = false;
    else if(zPos < 1)
        objectDirection = true;
    prevXPos = zPos;  

    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 2);

    var rMatrix = mult(rotateY(90), rotateZ(0));
    modelMatrix = mult(translate(6, 0, zPos), rMatrix);
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    
    objectPos2.push(6, 0, zPos);

    if(eyePos[0] > 2 && eyePos[2] > -3) {
        window.requestAnimationFrame(render); //: 맵 크기의 x = 2, z = -3 기준으로 범위를 줘서 범위 안에 들어올시 object 움직이게하는 애니메이션 줘서 렉 최소화
    }

    objectPos3 = [];
    var xPos;
    if (objectDirection)
        xPos = prevXPos + elapsedTime / 300;  // 속도
    else
        xPos = prevXPos - elapsedTime / 300;
    if (xPos > (groundScale - 4))
        objectDirection = false;
    else if(xPos < 1)
        objectDirection = true;
    prevXPos = xPos;  

    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 3);

    var rMatrix = mult(rotateY(0), rotateZ(0));
    modelMatrix = mult(translate(9.5 - xPos, -0.5, -8.0), rMatrix);
    modelMatrix = mult(trballMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    
    objectPos3.push(9.5-xPos, -0.5, -8.0);
    
}

function generateTexCube() {
    vertCubeStart = points.length;
    numVertCubeTri = 0;
    texQuad(1, 0, 3, 2);
    texQuad(2, 3, 7, 6);
    texQuad(3, 0, 4, 7);
    texQuad(4, 5, 6, 7);
    texQuad(5, 4, 0, 1);
    texQuad(6, 5, 1, 2);
}

function generateObjectCube() {
    vertObjectStart = points.length;
    numVertObjectTri = 0;
    objectQuad(1, 0, 3, 2);
    objectQuad(2, 3, 7, 6);
    objectQuad(3, 0, 4, 7);
    objectQuad(4, 5, 6, 7);
    objectQuad(5, 4, 0, 1);
    objectQuad(6, 5, 1, 2);
}

function objectQuad(a, b, c, d) {
    vertexPos = [
        vec4(-0.5, -0.5, -0.5, 0.5),
        vec4( 0.5, -0.5, -0.5, 0.5),
        vec4( 0.5,  0.5, -0.5, 0.5),
        vec4(-0.5,  0.5, -0.5, 0.5),
        vec4(-0.5, -0.5,  0.5, 0.5),
        vec4( 0.5, -0.5,  0.5, 0.5),
        vec4( 0.5,  0.5,  0.5, 0.5),
        vec4(-0.5,  0.5,  0.5, 0.5)
    ];

    vertexNormals = [
        vec4(-0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735,  0.57735,  0.57735, 0.0),
        vec4(-0.57735,  0.57735,  0.57735, 0.0)
    ];

    var texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    
    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[b]);
    normals.push(vertexNormals[b]);
    texCoords.push(texCoord[1]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[d]);
    normals.push(vertexNormals[d]);
    texCoords.push(texCoord[3]);
    numVertCubeTri++;
}
function texQuad(a, b, c, d) {
    vertexPos = [
        vec4(-0.5, -0.5, -0.5, 0.5),
        vec4( 0.5, -0.5, -0.5, 0.5),
        vec4( 0.5,  0.5, -0.5, 0.5),
        vec4(-0.5,  0.5, -0.5, 0.5),
        vec4(-0.5, -0.5,  0.5, 0.5),
        vec4( 0.5, -0.5,  0.5, 0.5),
        vec4( 0.5,  0.5,  0.5, 0.5),
        vec4(-0.5,  0.5,  0.5, 0.5)
    ];

    vertexNormals = [
        vec4(-0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735,  0.57735,  0.57735, 0.0),
        vec4(-0.57735,  0.57735,  0.57735, 0.0)
    ];

    var texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];
    
    points.push(vertexPos[a]);
    normals.push(vertexNormals[6]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[b]);
    normals.push(vertexNormals[6]);
    texCoords.push(texCoord[1]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[6]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    normals.push(vertexNormals[6]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[6]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[d]);
    normals.push(vertexNormals[d]);
    texCoords.push(texCoord[3]);
    numVertCubeTri++;
}

function generateTexGround(scale) {
    vertGroundStart = points.length;
    numVertGroundTri = 0;
    for(var x=-scale; x<scale; x++) {
        for(var z=-scale; z<scale; z++) {
            
            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0, 0));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0, 1));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1, 1));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0, 0));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1, 1));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1, 0));
            numVertGroundTri++;
        }
    }
}
function generateHexaPyramid() {
    vertPyraStart = points.length;
    numVertPyraTri = 0;
    const vertexPos = [
        vec4(0.0, 0.5, 0.0, 1.0),
        vec4(1.0, 0.5, 0.0, 1.0),
        vec4(0.5, 0.5, -0.866, 1.0),
        vec4(-0.5, 0.5, -0.866, 1.0),
        vec4(-1.0, 0.5, 0.0, 1.0),
        vec4(-0.5, 0.5, 0.866, 1.0),
        vec4(0.5, 0.5, 0.866, 1.0),
        vec4(0.0, -1.0, 0.0, 1.0)
    ];

    const vertexNormal = [
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.5, 0.0, -0.866, 0.0),
        vec4(-0.5, 0.0, -0.866, 0.0),
        vec4(-1.0, 0.0, 0.0, 0.0),
        vec4(-0.5, 0.0, 0.866, 0.0),
        vec4(0.5, 0.0, 0.866, 0.0),
        vec4(0.0, -1.0, 0.0, 0.0)
    ];

    numVertPyraTri = 0;
    for (var i=1; i<6; i++) {
        points.push(vertexPos[0]);
        normals.push(vertexNormal[0]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        normals.push(vertexNormal[0]);
        numVertPyraTri++;
        points.push(vertexPos[i+1]);
        normals.push(vertexNormal[0]);
        numVertPyraTri++;

        points.push(vertexPos[7]);
        normals.push(vertexNormal[7]);
        numVertPyraTri++;
        points.push(vertexPos[i+1]);
        normals.push(vertexNormal[i+1]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        normals.push(vertexNormal[i]);
        numVertPyraTri++;
    }
    points.push(vertexPos[0]);
    normals.push(vertexNormal[0]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    normals.push(vertexNormal[0]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    normals.push(vertexNormal[0]);
    numVertPyraTri++;

    points.push(vertexPos[7]);
    normals.push(vertexNormal[7]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    normals.push(vertexNormal[1]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    normals.push(vertexNormal[6]);
    numVertPyraTri++;
}