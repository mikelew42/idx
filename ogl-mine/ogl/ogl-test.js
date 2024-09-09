import { Renderer, Camera, Transform, Texture, Program, Geometry, Mesh, Box } from '/node_modules/ogl/src/index.js';

const vertex = /* glsl */ `
    attribute vec3 position;

    // Add instanced attributes just like any attribute
    attribute vec3 offset;
    attribute vec3 random;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    void rotate2d(inout vec2 v, float a){
        mat2 m = mat2(cos(a), -sin(a), sin(a),  cos(a));
        v = m * v;
    }

    void main() {

        // copy position so that we can modify the instances
        vec3 pos = position;

        // scale first
        pos *= 0.9 + random.y * 0.2;

        // rotate around y axis
        rotate2d(pos.xz, random.x * 6.28 + 4.0 * uTime * (random.y - 0.5));

        // rotate around x axis just to add some extra variation
        rotate2d(pos.zy, random.z * 0.5 * sin(uTime * random.x + random.z * 3.14));

        pos += offset;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragment = /* glsl */ `
    precision highp float;

    void main() {
        gl_FragColor = vec4(0, 0.2, 0.5, 0.4);
    }
`;

{
    const renderer = new Renderer({ dpr: 2 });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);
    gl.clearColor(1, 1, 1, 1);

    const camera = new Camera(gl, { fov: 95 });
    camera.position.z = 15;

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    // const texture = new Texture(gl);
    // const img = new Image();
    // img.onload = () => (texture.image = img);
    // img.src = 'assets/acorn.jpg';

    const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
            uTime: { value: 0 },
            // tMap: { value: texture },
        },
    });

    let mesh;
    loadModel();
    async function loadModel() {
        // const data = await (await fetch(`assets/acorn.json`)).json();

        const num = 50;

        let offset = new Float32Array(num * 3);
        let random = new Float32Array(num * 3);
        for (let i = 0; i < num; i++) {
            offset.set([Math.random() * 8 - 1, Math.random() * 8 - 1, Math.random() * 8 - 1], i * 3);

            // unique random values are always handy for instances.
            // Here they will be used for rotation, scale and movement.
            random.set([Math.random(), Math.random(), Math.random()], i * 3);
        }

        const geometry = new Geometry(gl, {
            position: { size: 3, data: new Float32Array([
                // Front face
                -0.5, -0.5,  0.5, // Bottom-left 0
                 0.5, -0.5,  0.5, // Bottom-right 1
                 0.5,  0.5,  0.5, // Top-right 2
                -0.5,  0.5,  0.5, // Top-left 3

                // Back face
                -0.5, -0.5, -0.5, // Bottom-left 4
                -0.5,  0.5, -0.5, // Top-left 5
                 0.5,  0.5, -0.5, // Top-right 6
                 0.5, -0.5, -0.5, // Bottom-right 7

                // // Top face
                // -0.5,  0.5, -0.5, // Back-left 8 
                // -0.5,  0.5,  0.5, // Front-left 9
                //  0.5,  0.5,  0.5, // Front-right 10
                //  0.5,  0.5, -0.5, // Back-right 11

                // // Bottom face
                // -0.5, -0.5, -0.5, // Back-left 12
                //  0.5, -0.5, -0.5, // Back-right 13
                //  0.5, -0.5,  0.5, // Front-right 14
                // -0.5, -0.5,  0.5, // Front-left 15

                // // Right face
                //  0.5, -0.5, -0.5, // Bottom-back 16
                //  0.5,  0.5, -0.5, // Top-back 17
                //  0.5,  0.5,  0.5, // Top-front 18
                //  0.5, -0.5,  0.5, // Bottom-front 19

                // // Left face
                // -0.5, -0.5, -0.5, // Bottom-back 20
                // -0.5, -0.5,  0.5, // Bottom-front 21
                // -0.5,  0.5,  0.5, // Top-front 22
                // -0.5,  0.5, -0.5  // Top-back 23
            ])},

            index: { data: new Uint16Array([
                0, 1, 2, 0, 2, 3, // front face
                7, 4, 5, 7, 5, 6, // back face
                3, 2, 6, 3, 6, 5, // top face
                4, 7, 1, 4, 1, 0, // bottom face
                1, 7, 6, 1, 6, 2, // right face
                4, 0, 3, 4, 3, 5  // left face

            ]) },

            // simply add the 'instanced' property to flag as an instanced attribute.
            // set the value as the divisor number
            offset: { instanced: 1, size: 3, data: offset },
            random: { instanced: 1, size: 3, data: random },
        });

// this works, but can only have one geometry (See above)
        // const geometry = new Box(gl, {
        //     height: 3, width: 3, depth: 3,

        //     // simply add the 'instanced' property to flag as an instanced attribute.
        //     // set the value as the divisor number
        //     attributes: {
        //         offset: { instanced: 1, size: 3, data: offset },
        //         random: { instanced: 1, size: 3, data: random }
        //     }
        // });

        mesh = new Mesh(gl, { geometry, program });
        mesh.setParent(scene);
    }

    requestAnimationFrame(update);
    function update(t) {
        requestAnimationFrame(update);

        if (mesh) mesh.rotation.y -= 0.005;
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene, camera });
    }
}