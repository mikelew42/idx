/*

LESSON:

Look at ogl/src/core/Program.js and break at line 94ish to see
how structs affect uniforms 

*/

import { Renderer, Camera, Transform, Program, Mesh, Plane, Sphere, Box, Cylinder, Orbit } from '/node_modules/ogl/src/index.js';

const vertex = /* glsl */ `#version 300 es
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `#version 300 es
precision highp float;

struct Sub {
    float value;
};

struct Test {
    vec3 position;
    vec3 position2;
    float field;
    float field2;
    Sub sub;
};

uniform Test test;

in vec3 vNormal;
out vec4 color;

void main() {
    vec3 normal = normalize(vNormal);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
    // gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1;
    color.rgb = test.position + lighting * test.field * test.field2 * test.sub.value;
    color.a = 1.0;
}
`;

{
    const renderer = new Renderer({ dpr: 2, alpha: true });
    const gl = renderer.gl;
    gl.canvas.style.display = "block";
    document.body.appendChild(gl.canvas);
    gl.clearColor(1, 1, 1, 0);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 1, 7);
    camera.lookAt([0, 0, 0]);
    const controls = new Orbit(camera, {
        ease: 0,
        rotateSpeed: 0.2
    });

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    const planeGeometry = new Plane(gl);
    const sphereGeometry = new Sphere(gl);
    const cubeGeometry = new Box(gl);
    const cylinderGeometry = new Cylinder(gl);

    const program = new Program(gl, {
        // transparent: true, // doesn't seem to make a difference
        vertex,
        fragment,

        // Don't cull faces so that plane is double sided - default is gl.BACK
        cullFace: false,
    });

    const plane = new Mesh(gl, { geometry: planeGeometry, program });
    plane.position.set(0, 1.3, 0);
    plane.setParent(scene);

    const sphere = new Mesh(gl, { geometry: sphereGeometry, program });
    sphere.position.set(1.3, 0, 0);
    sphere.setParent(scene);

    const cube = new Mesh(gl, { geometry: cubeGeometry, program });
    cube.position.set(0, -1.3, 0);
    cube.setParent(scene);
console.log(window.cube = cube);
    const cylinder = new Mesh(gl, { geometry: cylinderGeometry, program });
    cylinder.position.set(-1.3, 0, 0);
    cylinder.setParent(scene);

    requestAnimationFrame(update);
    function update() {
        // requestAnimationFrame(update);

        // plane.rotation.y -= 0.02;
        // sphere.rotation.y -= 0.03;
        // cube.rotation.y -= 0.04;
        // cylinder.rotation.y -= 0.02;

        controls.update();
        renderer.render({ scene, camera });
    }
    window.update = update;
    window.scene = scene;
}