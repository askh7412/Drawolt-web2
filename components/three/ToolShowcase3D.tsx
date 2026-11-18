'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export type ToolFinish = 'standard' | 'topline';
export type CameraPreset = 'hero' | 'chuck' | 'profile';

interface ToolShowcase3DProps {
  finish: ToolFinish;
  onFinishChange: (next: ToolFinish) => void;
  standardLabel: string;
  toplineLabel: string;
}

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  hero: { pos: [3.2, 1.45, 3.6], target: [0.05, 0.15, 0] },
  chuck: { pos: [2.2, 0.9, 1.4], target: [0.95, 0.45, 0] },
  profile: { pos: [0.0, 0.65, 4.4], target: [0.0, 0.1, 0] },
};

// Pre-allocated vectors at module scope to avoid GC inside animation loop
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    grad.addColorStop(0, 'rgba(16, 28, 53, 0.34)');
    grad.addColorStop(0.55, 'rgba(16, 28, 53, 0.12)');
    grad.addColorStop(1, 'rgba(16, 28, 53, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function ToolShowcase3D({
  finish,
  onFinishChange,
  standardLabel,
  toplineLabel,
}: ToolShowcase3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [explode, setExplode] = useState<number>(0);
  const [preset, setPreset] = useState<CameraPreset>('hero');
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);

  const stateRef = useRef({
    finish,
    explode: 0,
    preset: 'hero' as CameraPreset,
    transitionActive: false,
  });

  const apiRef = useRef<{
    applyFinish: (f: ToolFinish) => void;
    triggerTransition: () => void;
  } | null>(null);

  useEffect(() => {
    stateRef.current.finish = finish;
    apiRef.current?.applyFinish(finish);
  }, [finish]);

  useEffect(() => {
    stateRef.current.explode = explode;
    stateRef.current.transitionActive = true;
    apiRef.current?.triggerTransition();
  }, [explode]);

  useEffect(() => {
    stateRef.current.preset = preset;
    stateRef.current.transitionActive = true;
    apiRef.current?.triggerTransition();
  }, [preset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL probe
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      window.setTimeout(() => setWebglError(true), 0);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 440;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F6F8FA');
    scene.fog = new THREE.Fog('#F6F8FA', 9, 20);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(...CAMERA_PRESETS.hero.pos);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.target.set(...CAMERA_PRESETS.hero.target);

    // 3-point studio lighting + cool/warm contrast
    const hemiLight = new THREE.HemisphereLight('#EEF4FF', '#D5DCE4', 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFF8EE', 2.0);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#DCE8FF', 1.15);
    rimLight.position.set(-4, 3, -3.5);
    scene.add(rimLight);

    // Ground plane & soft contact shadow
    const floorGeo = new THREE.CircleGeometry(7, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#EEF1F3',
      roughness: 0.9,
      metalness: 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.16;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.1, 2.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.14;
    scene.add(shadowPlane);

    // Composite industrial brushless hammer drill (9 sub-assemblies)
    const toolGroup = new THREE.Group();
    scene.add(toolGroup);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#101C35',
      roughness: 0.42,
      metalness: 0.18,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });

    const gripMat = new THREE.MeshStandardMaterial({
      color: '#202226',
      roughness: 0.82,
      metalness: 0.08,
    });

    const brushedSteelMat = new THREE.MeshPhysicalMaterial({
      color: '#B8C0C8',
      roughness: 0.22,
      metalness: 0.92,
      anisotropy: 0.75,
    });

    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: '#2B3036',
      roughness: 0.35,
      metalness: 0.82,
    });

    const limeAccentMat = new THREE.MeshStandardMaterial({
      color: '#9DCB16',
      roughness: 0.32,
      metalness: 0.2,
    });

    // 1. Motor barrel housing
    const barrelGroup = new THREE.Group();
    const barrelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.34, 1.38, 32),
      bodyMat,
    );
    barrelMesh.rotation.z = Math.PI / 2;
    barrelMesh.position.set(-0.08, 0.45, 0);
    barrelMesh.castShadow = true;
    barrelGroup.add(barrelMesh);

    // Rear motor cap
    const rearCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.31, 0.26, 0.22, 32),
      gripMat,
    );
    rearCap.rotation.z = Math.PI / 2;
    rearCap.position.set(-0.85, 0.45, 0);
    rearCap.castShadow = true;
    barrelGroup.add(rearCap);

    // Cooling vents (Instanced-like or crisp bars)
    for (let i = 0; i < 4; i++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.67), darkSteelMat);
      vent.position.set(-0.46 + i * 0.09, 0.45, 0);
      barrelGroup.add(vent);
    }
    toolGroup.add(barrelGroup);

    // 2. Lime green signature precision collar
    const collarGroup = new THREE.Group();
    const limeRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.335, 0.335, 0.07, 32),
      limeAccentMat,
    );
    limeRing.rotation.z = Math.PI / 2;
    limeRing.position.set(0.64, 0.45, 0);
    collarGroup.add(limeRing);
    toolGroup.add(collarGroup);

    // 3. Gearbox & Torque clutch ring
    const clutchGroup = new THREE.Group();
    const clutchMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.325, 0.34, 24),
      darkSteelMat,
    );
    clutchMesh.rotation.z = Math.PI / 2;
    clutchMesh.position.set(0.85, 0.45, 0);
    clutchMesh.castShadow = true;
    clutchGroup.add(clutchMesh);
    toolGroup.add(clutchGroup);

    // 4. Keyless brushed steel chuck + hex drill bit
    const chuckGroup = new THREE.Group();
    const chuckBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.27, 0.42, 24),
      brushedSteelMat,
    );
    chuckBody.rotation.z = Math.PI / 2;
    chuckBody.position.set(1.22, 0.45, 0);
    chuckBody.castShadow = true;
    chuckGroup.add(chuckBody);

    const chuckTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.21, 0.16, 24),
      darkSteelMat,
    );
    chuckTip.rotation.z = Math.PI / 2;
    chuckTip.position.set(1.5, 0.45, 0);
    chuckGroup.add(chuckTip);

    const drillBit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.65, 16),
      brushedSteelMat,
    );
    drillBit.rotation.z = Math.PI / 2;
    drillBit.position.set(1.88, 0.45, 0);
    chuckGroup.add(drillBit);
    toolGroup.add(chuckGroup);

    // 5. Ergonomic handle + trigger
    const handleGroup = new THREE.Group();
    const handleCore = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 1.12, 0.28),
      bodyMat,
    );
    handleCore.position.set(-0.26, -0.22, 0);
    handleCore.rotation.z = -0.18;
    handleCore.castShadow = true;
    handleGroup.add(handleCore);

    const overmold = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.78, 0.3),
      gripMat,
    );
    overmold.position.set(-0.27, -0.24, 0);
    overmold.rotation.z = -0.18;
    handleGroup.add(overmold);

    const triggerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.22, 0.12),
      darkSteelMat,
    );
    triggerMesh.position.set(-0.02, 0.05, 0);
    handleGroup.add(triggerMesh);
    toolGroup.add(handleGroup);

    // 6. Detachable 18V Battery Pack
    const batteryGroup = new THREE.Group();
    const batteryBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.4, 0.56),
      gripMat,
    );
    batteryBase.position.set(-0.18, -0.94, 0);
    batteryBase.castShadow = true;
    batteryGroup.add(batteryBase);

    const batteryTopRail = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.09, 0.48),
      bodyMat,
    );
    batteryTopRail.position.set(-0.22, -0.71, 0);
    batteryGroup.add(batteryTopRail);

    const batteryStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.05, 0.57),
      limeAccentMat,
    );
    batteryStripe.position.set(-0.1, -1.03, 0);
    batteryGroup.add(batteryStripe);
    toolGroup.add(batteryGroup);

    // Apply Standard vs TOP LINE material theme
    const applyFinish = (nextFinish: ToolFinish) => {
      if (nextFinish === 'topline') {
        bodyMat.color.set('#777E87');
        bodyMat.metalness = 0.78;
        bodyMat.roughness = 0.28;
        gripMat.color.set('#15171A');
        limeAccentMat.color.set('#9DCB16');
      } else {
        bodyMat.color.set('#101C35');
        bodyMat.metalness = 0.18;
        bodyMat.roughness = 0.42;
        gripMat.color.set('#202226');
        limeAccentMat.color.set('#9DCB16');
      }
      requestRender();
    };

    // Coalesced on-demand renderer + software WebGL afterDraw pacing
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let currentExplode = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function stepTransitions(dt: number): boolean {
      let stillAnimating = false;
      const targetEx = stateRef.current.explode;
      if (Math.abs(currentExplode - targetEx) > 0.002) {
        currentExplode = THREE.MathUtils.damp(currentExplode, targetEx, 7, dt);
        stillAnimating = true;
      } else {
        currentExplode = targetEx;
      }

      // Apply exploded offsets along tool axes
      collarGroup.position.x = currentExplode * 0.22;
      clutchGroup.position.x = currentExplode * 0.52;
      chuckGroup.position.x = currentExplode * 0.92;
      batteryGroup.position.y = -currentExplode * 0.48;

      if (stateRef.current.transitionActive) {
        const cfg = CAMERA_PRESETS[stateRef.current.preset];
        _targetPos.set(...cfg.pos);
        _targetLook.set(...cfg.target);
        if (
          camera.position.distanceTo(_targetPos) > 0.015 ||
          controls.target.distanceTo(_targetLook) > 0.015
        ) {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 6, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 6, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, 6, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLook.x, 6, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLook.y, 6, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLook.z, 6, dt);
          stillAnimating = true;
        } else {
          stateRef.current.transitionActive = false;
        }
      }

      return stillAnimating;
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        renderDirty = false;
        const keepMoving = stepTransitions(dt);
        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || keepMoving)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    apiRef.current = {
      applyFinish,
      triggerTransition: requestRender,
    };

    const handleControlChange = () => requestRender();
    const handleControlStart = () => {
      stateRef.current.transitionActive = false;
    };
    controls.addEventListener('change', handleControlChange);
    controls.addEventListener('start', handleControlStart);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    applyFinish(stateRef.current.finish);
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', handleControlChange);
      controls.removeEventListener('start', handleControlStart);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();
      envTex.dispose();
      shadowTex.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  if (webglError) {
    return (
      <div className="flex h-[420px] w-full flex-col items-center justify-center rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] p-6 text-center">
        <p className="text-sm font-semibold text-[#101C35]">
          3D Viewport unavailable in current graphics context
        </p>
        <p className="mt-1 text-xs text-[#7D8792]">
          Switch to Studio View above to inspect high-resolution product photography.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-[#E5E9ED] bg-[#F6F8FA] sm:h-[500px]">
      {/* Isolated WebGL mount container */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Top-left unobtrusive engineering readout */}
      <div className="pointer-events-none absolute top-4 left-4 rounded-lg border border-[#E5E9ED] bg-white/95 px-3 py-1.5 text-xs font-medium text-[#101C35]">
        <span>3D Engineering Stage</span>
        <span className="mx-1.5 text-[#7D8792]">·</span>
        <span className="text-[#7D8792]">Drag to rotate</span>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-3 left-1/2 z-10 w-[94%] max-w-[660px] -translate-x-1/2">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setControlsCollapsed((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-[#E5E9ED] bg-white px-3 py-1 text-[11px] font-semibold text-[#101C35] transition-colors hover:bg-[#F6F8FA]"
          >
            {controlsCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {!controlsCollapsed && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E9ED] bg-white px-3.5 py-2.5 shadow-sm">
            {/* Series finish switcher */}
            <div className="flex items-center gap-1 rounded-lg bg-[#F6F8FA] p-1">
              <button
                type="button"
                onClick={() => onFinishChange('standard')}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  finish === 'standard'
                    ? 'bg-[#101C35] text-white'
                    : 'text-[#7D8792] hover:text-[#101C35]'
                }`}
              >
                {standardLabel}
              </button>
              <button
                type="button"
                onClick={() => onFinishChange('topline')}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  finish === 'topline'
                    ? 'bg-[#777E87] text-white'
                    : 'text-[#7D8792] hover:text-[#101C35]'
                }`}
              >
                {toplineLabel}
              </button>
            </div>

            {/* Exploded view slider */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#101C35]">
              <span className="whitespace-nowrap">Explode</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={explode}
                onChange={(e) => setExplode(parseFloat(e.target.value))}
                className="w-20 accent-[#9DCB16]"
              />
            </label>

            {/* Camera angle presets */}
            <div className="flex items-center gap-1">
              {(['hero', 'chuck', 'profile'] as CameraPreset[]).map((cam) => (
                <button
                  key={cam}
                  type="button"
                  onClick={() => setPreset(cam)}
                  className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors ${
                    preset === cam
                      ? 'bg-[#EEF1F3] font-semibold text-[#101C35]'
                      : 'text-[#7D8792] hover:text-[#101C35]'
                  }`}
                >
                  {cam}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setExplode(0);
                  setPreset('hero');
                }}
                title="Reset view"
                aria-label="Reset 3D view"
                className="rounded-md p-1.5 text-[#7D8792] hover:bg-[#F6F8FA] hover:text-[#101C35]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
