"use client"
import { useEffect, useRef } from 'react';

export function Words3D({ text }: { text: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let textIndex = 0;

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const layers = 4;
        let size = 0;
        let animFrame: number;
        let particles: { position: Vector3; target: Vector3; interpolant: number }[] = [];
        let targets: Vector3[] = [];
        const lerp = (t: number, v0: number, v1: number) => (1 - t) * v0 + t * v1;
        const fov = 2000;
        const viewDistance = 200;
        let targetRotationY = 0.5;
        let rotationY = 0.5;
        const speed = 100;
        const texts: string[] = [
            text,
        ];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Vector3 {
            x: number;
            y: number;
            z: number;

            constructor(x: number, y: number, z: number) {
                this.x = x;
                this.y = y;
                this.z = z;
            }

            static fromScreenCoords(_x: number, _y: number, _z?: number) {
                const factor = fov / viewDistance;
                const x = (_x - canvas.width / 2) / factor;
                const y = (_y - canvas.height / 2) / factor;
                const z = _z !== undefined ? _z : 0;

                return new Vector3(x, y, z);
            }

            rotateX(angle: number) {
                const z = this.z * Math.cos(angle) - this.x * Math.sin(angle);
                const x = this.z * Math.sin(angle) + this.x * Math.cos(angle);
                return new Vector3(x, this.y, z);
            }

            rotateY(angle: number) {
                const y = this.y * Math.cos(angle) - this.z * Math.sin(angle);
                const z = this.y * Math.sin(angle) + this.z * Math.cos(angle);
                return new Vector3(this.x, y, z);
            }

            pp() {
                const factor = fov / (viewDistance + this.z);
                const x = this.x * factor + canvas.width / 2;
                const y = this.y * factor + canvas.height / 2;
                return new Vector3(x, y, this.z);
            }
        }

        function init() {
            cancelAnimationFrame(animFrame);
            const text = texts[textIndex++ % texts.length];
            let fontSize = 170;
            let startX = window.innerWidth / 2;
            let startY = window.innerHeight / 2;
            particles = [];
            targets = [];
            const c = document.createElement('canvas');
            const cx = c.getContext('2d')!;
            cx.font = `900 ${fontSize}px Arial`;
            let w = cx.measureText(text).width;
            const h = fontSize * 1.5;
            let gap = 7;

            while (w > window.innerWidth * 0.8) {
                fontSize -= 1;
                cx.font = `900 ${fontSize}px Arial`;
                w = cx.measureText(text).width;
            }
            if (fontSize < 100) gap = 6;
            if (fontSize < 70) gap = 4;
            if (fontSize < 40) gap = 2;
            size = Math.max(gap / 2, 1);
            c.width = w;
            c.height = h;
            startX = Math.floor(startX - w / 2);
            startY = Math.floor(startY - h / 2);
            cx.fillStyle = '#000';
            cx.font = `900 ${fontSize}px Arial`;
            cx.fillText(text, 0, fontSize);
            const data = cx.getImageData(0, 0, w, h);

            for (let i = 0; i < data.data.length; i += 4) {
                const rw = data.width * 4;
                const x = startX + Math.floor((i % rw) / 4);
                const y = startY + Math.floor(i / rw);

                if (data.data[i + 3] > 0 && x % gap === 0 && y % gap === 0) {
                    for (let j = 0; j < layers; j++) {
                        targets.push(Vector3.fromScreenCoords(x, y, j * 1));
                    }
                }
            }

            targets = targets.sort((a, b) => a.x - b.x);
            loop();
        }

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < speed; i++) {
                if (targets.length > 0) {
                    const target = targets[0];
                    const x = (canvas.width / 2) + target.x * 10;
                    const y = canvas.height / 2;
                    const z = -10;

                    const position = Vector3.fromScreenCoords(x, y, z);
                    const interpolant = 0;

                    particles.push({ position, target, interpolant });
                    targets.splice(0, 1);
                }
            }

            particles
                .sort((pa, pb) => pb.target.z - pa.target.z)
                .forEach((p) => {
                    if (p.interpolant < 1) {
                        p.interpolant = Math.min(p.interpolant + 0.01, 1);

                        p.position.x = lerp(p.interpolant, p.position.x, p.target.x);
                        p.position.y = lerp(p.interpolant, p.position.y, p.target.y);
                        p.position.z = lerp(p.interpolant, p.position.z, p.target.z);
                    }
                    const rotationX = Math.sin(Date.now() / 2000) * 0.8;
                    rotationY = lerp(0.00001, rotationY, targetRotationY);
                    const particle = p.position
                        .rotateX(rotationX)
                        .rotateY(rotationY)
                        .pp();

                    const s = 1 - (p.position.z / layers);
                    ctx.fillStyle = p.target.z === 0
                        ? 'rgb(114, 204, 255)'
                        : `rgba(242, 101, 49, ${s})`;

                    ctx.fillRect(particle.x, particle.y, s * size, s * size);
                });

            animFrame = requestAnimationFrame(loop);
        }

        init();

        window.addEventListener('mousemove', (e: MouseEvent) => {
            const halfHeight = window.innerHeight / 2;
            targetRotationY = (e.clientY - halfHeight) / window.innerHeight;
        });

        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('mousemove', () => {});
        };
    }, [text, textIndex]);

    return (
        <canvas ref={canvasRef}></canvas>
    )
};

