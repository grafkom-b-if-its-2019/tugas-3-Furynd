(function() {
  var canvas, gl, program;
  var shaders = [];
  var thetaLoc,theta=0;
  var scaleLoc, scale=0, scaler=-0.0124;
  var alphaLoc, alphaLoc2, alpha=0;
  var rot3d = [0.0, 0.0, 0.0];
  var vertices, vertices2;

  function generate_vertices(shape){
    var vertexarray;
    if(shape=="line"){
      vertexarray = new Float32Array([
        -0.5, +0.5, +0.5,   Math.random(), Math.random(), Math.random(), //1
        -0.5, +0.5, -0.5,   Math.random(), Math.random(), Math.random(), //
        -0.5, +0.5, +0.5,   Math.random(), Math.random(), Math.random(), //2
        -0.5, -0.5, +0.5,   Math.random(), Math.random(), Math.random(), //
        -0.5, +0.5, +0.5,   Math.random(), Math.random(), Math.random(), //3
        +0.5, +0.5, +0.5,   Math.random(), Math.random(), Math.random(), //   pojok kiri depan atas
        +0.5, -0.5, +0.5,   Math.random(), Math.random(), Math.random(), //4
        -0.5, -0.5, +0.5,   Math.random(), Math.random(), Math.random(), //
        +0.5, -0.5, +0.5,   Math.random(), Math.random(), Math.random(), //5
        +0.5, +0.5, +0.5,   Math.random(), Math.random(), Math.random(), //
        +0.5, -0.5, +0.5,   Math.random(), Math.random(), Math.random(), //6
        +0.5, -0.5, -0.5,   Math.random(), Math.random(), Math.random(), //   pojok kanan depan bawah
        +0.5, +0.5, -0.5,   Math.random(), Math.random(), Math.random(), //7
        +0.5, +0.5, +0.5,   Math.random(), Math.random(), Math.random(), //
        +0.5, +0.5, -0.5,   Math.random(), Math.random(), Math.random(), //8
        +0.5, -0.5, -0.5,   Math.random(), Math.random(), Math.random(), //
        +0.5, +0.5, -0.5,   Math.random(), Math.random(), Math.random(), //9
        -0.5, +0.5, -0.5,   Math.random(), Math.random(), Math.random(), //   pojok kanan atas belakang
        -0.5, -0.5, -0.5,   Math.random(), Math.random(), Math.random(), //10
        -0.5, -0.5, +0.5,   Math.random(), Math.random(), Math.random(), //
        -0.5, -0.5, -0.5,   Math.random(), Math.random(), Math.random(), //11
        -0.5, +0.5, -0.5,   Math.random(), Math.random(), Math.random(), //
        -0.5, -0.5, -0.5,   Math.random(), Math.random(), Math.random(), //12
        +0.5, -0.5, -0.5,   Math.random(), Math.random(), Math.random(), //   pojok kiri bawah belakang
      ]);
    } else{
      vertexarray = new Float32Array([
        +0.24, +0.16, 0.0,   Math.random(), Math.random(), Math.random(),//2
        +0.20, +0.20, 0.0,   Math.random(), Math.random(), Math.random(),//1
        +0.30, +0.16, 0.0,   Math.random(), Math.random(), Math.random(),//4
        +0.30, +0.20, 0.0,   Math.random(), Math.random(), Math.random(),//3
        +0.34, +0.20, 0.0,   Math.random(), Math.random(), Math.random(),//5
        +0.30, +0.30, 0.0,   Math.random(), Math.random(), Math.random(),//7
        +0.34, +0.26, 0.0,   Math.random(), Math.random(), Math.random(),//6
        +0.80, +0.30, 0.0,   Math.random(), Math.random(), Math.random(),//8 top right point
        +0.70, +0.26, 0.0,   Math.random(), Math.random(), Math.random(),//9
        +0.80, +0.30, 0.0,   Math.random(), Math.random(), Math.random(),//8 top right point
        +0.64, +0.20, 0.0,   Math.random(), Math.random(), Math.random(),//10
        +0.66, +0.16, 0.0,   Math.random(), Math.random(), Math.random(),//11
        +0.34, +0.20, 0.0,   Math.random(), Math.random(), Math.random(),//5
        +0.34, +0.16, 0.0,   Math.random(), Math.random(), Math.random(),//12
        +0.30, +0.16, 0.0,   Math.random(), Math.random(), Math.random(),//4
        +0.34, +0.10, 0.0,   Math.random(), Math.random(), Math.random(),//13
        +0.30, +0.06, 0.0,   Math.random(), Math.random(), Math.random(),//18
        +0.60, +0.10, 0.0,   Math.random(), Math.random(), Math.random(),//14
        +0.50, +0.06, 0.0,   Math.random(), Math.random(), Math.random(),//15
        +0.46, -0.04, 0.0,   Math.random(), Math.random(), Math.random(),//16
        +0.44, -0.00, 0.0,   Math.random(), Math.random(), Math.random(),//17
        +0.34, -0.04, 0.0,   Math.random(), Math.random(), Math.random(),//20
        +0.30, -0.00, 0.0,   Math.random(), Math.random(), Math.random(),//19
        +0.34, -0.16, 0.0,   Math.random(), Math.random(), Math.random(),//22
        +0.30, -0.14, 0.0,   Math.random(), Math.random(), Math.random(),//21
        +0.20, -0.30, 0.0,   Math.random(), Math.random(), Math.random(),//24 bottom left point
        +0.24, -0.20, 0.0,   Math.random(), Math.random(), Math.random(),//23
        +0.20, +0.20, 0.0,   Math.random(), Math.random(), Math.random(),//1
        +0.24, +0.16, 0.0,   Math.random(), Math.random(), Math.random()//2
      ]);
    }
    return vertexarray;
  }

  glUtils.SL.init({ callback: function() { main(); } });

  function main() {
    window.addEventListener('resize', resizer);

    canvas = document.getElementById('glcanvas');
    gl = glUtils.checkWebGL(canvas);

    var vertexShader = glUtils.getShader( gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader( gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var vertexShader2 = glUtils.getShader( gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
      fragmentShader2 = glUtils.getShader( gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

    shaders.push(glUtils.createProgram(gl, vertexShader, fragmentShader));
    shaders.push(glUtils.createProgram(gl, vertexShader2, fragmentShader2));

    gl.useProgram(shaders[0]);
    thetaLoc = gl.getUniformLocation(shaders[0], 'theta');
    alphaLoc = gl.getUniformLocation(shaders[0], 'alpha');

    gl.useProgram(shaders[1]);
    scaleLoc = gl.getUniformLocation(shaders[1], 'scale');
    alphaLoc2 = gl.getUniformLocation(shaders[1], 'alpha');

    resizer();

    function render(){
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      draw(shaders[0],"line");
      draw(shaders[1],"triangle");
      requestAnimationFrame(render);
    }
    render();
  }

  function draw(program, drawmode){
    vertices = generate_vertices("line");
    vertices2 = generate_vertices("triangle");
    gl.useProgram(program);
    if(drawmode == "line"){
      initBuffers(program, vertices);
      theta -= Math.PI * 0.0124;
      alpha += Math.PI * 0.005;
      gl.uniform1f(thetaLoc, theta);
      gl.uniform1f(alphaLoc, alpha);
      gl.drawArrays(gl.LINES, 0, 24);
    }
    else{
      initBuffers(program, vertices2);
      if(scale> 1 || scale<-1)scaler *= -1;
      scale += scaler;
      // scale = Math.sin(theta+Math.PI/2);
      gl.uniform1f(scaleLoc, scale);
      gl.uniform1f(alphaLoc2, alpha);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 29);
    }
  }

  function initBuffers(program, vertices) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    var vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vColor);
  }

  function resizer() {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw(shaders[0],"line");
    draw(shaders[1],"triangles");
  }
})(window || this);
