import { App, el, div, View, h1, h2, h3, p, is, Base, icon } from "/module/App/App.js";

const app = window.app = await new App().ready;

Ammo().then(function(Ammo) {
    // Ammo.js is ready
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    const dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

    dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

    // Your physics logic goes here...

    const v3 = new Ammo.btVector3(1, 1, 1);
    debugger;
});
