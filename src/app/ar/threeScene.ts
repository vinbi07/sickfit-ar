import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface SceneTransform {
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: { x: number; y: number; z: number };
}

export class ThreeARScene {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private modelRoot: THREE.Group;
  private loadedModel: THREE.Object3D | null = null;
  private rafId: number | null = null;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.01, 100);
    this.camera.position.set(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.modelRoot = new THREE.Group();
    this.scene.add(this.modelRoot);

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2, 3, 4);
    this.scene.add(ambient, key);
  }

  init() {
    this.container.appendChild(this.renderer.domElement);
    this.resize();
    this.start();
  }

  async loadModel(modelUrl: string) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(modelUrl);

    if (this.loadedModel) {
      this.modelRoot.remove(this.loadedModel);
    }

    this.loadedModel = gltf.scene;
    this.loadedModel.position.set(0, 0, 0);
    this.modelRoot.add(this.loadedModel);
  }

  applyTransform(transform: SceneTransform) {
    this.modelRoot.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z
    );
    this.modelRoot.scale.setScalar(transform.scale);
    this.modelRoot.rotation.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z
    );
  }

  captureFrame(): string {
    return this.renderer.domElement.toDataURL('image/png');
  }

  resize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / Math.max(clientHeight, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  start() {
    const renderLoop = () => {
      this.renderer.render(this.scene, this.camera);
      this.rafId = window.requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }

  dispose() {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
    }

    this.renderer.dispose();

    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
