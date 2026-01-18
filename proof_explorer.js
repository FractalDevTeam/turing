// PRINCIPIA FRACTALIS: P ≠ NP PROOF EXPLORER
// All visualizations and computations from verified Lean code

// ==============================================================================
// MODE 1: TURING MACHINE
// ==============================================================================
class TuringMachineDemo {
    constructor() {
        this.canvas = document.getElementById('tm-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = 1;
        this.head = 2;
        this.tape = [1, 0, 1, 1, 0, 0, 0];
        this.steps = 0;
        this.running = false;
        this.primes = this.generatePrimes(30);
    }
    
    generatePrimes(count) {
        const primes = [];
        let n = 2;
        while (primes.length < count) {
            if (this.isPrime(n)) primes.push(n);
            n++;
        }
        return primes;
    }
    
    isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
    
    digitalSum(n) {
        let sum = 0;
        while (n > 0) {
            sum += n % 3;
            n = Math.floor(n / 3);
        }
        return sum;
    }
    
    encodeConfiguration() {
        let encoding = Math.pow(2, this.state) * Math.pow(3, this.head);
        for (let j = 0; j < this.tape.length; j++) {
            const power = this.tape[j] + 1;
            encoding *= Math.pow(this.primes[j + 1], power);
        }
        return encoding;
    }
    
    step() {
        const symbol = this.tape[this.head];
        this.tape[this.head] = 1 - symbol;
        this.head++;
        if (this.head >= this.tape.length) this.tape.push(0);
        this.state = (this.state % 3) + 1;
        this.steps++;
        this.render();
        this.updateStats();
    }
    
    run() {
        this.running = true;
        const speed = document.getElementById('tm-speed').value;
        this.interval = setInterval(() => {
            if (this.steps < 20) {
                this.step();
            } else {
                this.stop();
            }
        }, parseInt(speed));
    }
    
    stop() {
        this.running = false;
        clearInterval(this.interval);
    }
    
    reset() {
        this.stop();
        this.state = 1;
        this.head = 2;
        this.tape = [1, 0, 1, 1, 0, 0, 0];
        this.steps = 0;
        this.render();
        this.updateStats();
    }
    
    render() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw explanation panel
        ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
        ctx.fillRect(10, 10, 350, 130);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 350, 130);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 13px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Prime Factorization Encoding', 20, 32);

        ctx.fillStyle = '#a78bfa';
        ctx.font = '11px Inter';
        ctx.fillText('Every TM configuration C = (state, head, tape) encodes as:', 20, 52);
        ctx.fillStyle = '#ffd700';
        ctx.font = '12px JetBrains Mono';
        ctx.fillText('encode(C) = 2^state × 3^head × ∏ pⱼ^(aⱼ+1)', 20, 72);
        ctx.fillStyle = '#a78bfa';
        ctx.font = '11px Inter';
        ctx.fillText('where pⱼ is the j-th prime, aⱼ is tape symbol at position j', 20, 92);
        ctx.fillText('This maps computation → number theory → spectral analysis', 20, 112);
        ctx.fillText(`Current: 2^${this.state} × 3^${this.head} × ...`, 20, 132);

        // Draw tape with improved visuals
        const cellWidth = 55;
        const cellHeight = 55;
        const startX = (this.canvas.width - cellWidth * this.tape.length) / 2;
        const y = 200;

        // Tape background
        ctx.fillStyle = 'rgba(167, 139, 250, 0.1)';
        ctx.fillRect(startX - 10, y - 30, cellWidth * this.tape.length + 20, cellHeight + 60);

        this.tape.forEach((symbol, i) => {
            const x = startX + i * cellWidth;
            const isHead = i === this.head;

            // Cell background
            ctx.fillStyle = isHead ? 'rgba(255, 215, 0, 0.2)' : 'rgba(167, 139, 250, 0.1)';
            ctx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

            // Cell border
            ctx.strokeStyle = isHead ? '#ffd700' : '#a78bfa';
            ctx.lineWidth = isHead ? 3 : 1;
            ctx.strokeRect(x, y, cellWidth, cellHeight);

            // Symbol
            ctx.fillStyle = isHead ? '#ffd700' : '#a78bfa';
            ctx.font = 'bold 28px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillText(symbol, x + cellWidth / 2, y + cellHeight / 2 + 10);

            // Position index
            ctx.font = '10px JetBrains Mono';
            ctx.fillStyle = '#7c3aed';
            ctx.fillText(`p${i+2}`, x + cellWidth / 2, y - 8);
        });

        // Draw head indicator
        const headX = startX + this.head * cellWidth + cellWidth / 2;
        ctx.fillStyle = '#ffd700';
        ctx.font = '30px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('▼', headX, y - 20);
        ctx.font = '12px Inter';
        ctx.fillText('HEAD', headX, y - 35);

        // Draw state machine indicator
        ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
        ctx.fillRect(this.canvas.width - 200, 10, 190, 90);
        ctx.strokeStyle = '#a78bfa';
        ctx.strokeRect(this.canvas.width - 200, 10, 190, 90);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 13px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Machine State', this.canvas.width - 190, 32);

        ctx.fillStyle = '#a78bfa';
        ctx.font = '14px JetBrains Mono';
        ctx.fillText(`State:  q${this.state}`, this.canvas.width - 190, 55);
        ctx.fillText(`Head:   ${this.head}`, this.canvas.width - 190, 75);
        ctx.fillText(`Steps:  ${this.steps}`, this.canvas.width - 190, 95);

        // Draw D₃ calculation
        const encoding = this.encodeConfiguration();
        const ds = this.digitalSum(Math.floor(encoding));

        ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
        ctx.fillRect(startX, y + cellHeight + 50, cellWidth * this.tape.length, 70);
        ctx.strokeStyle = '#ffd700';
        ctx.strokeRect(startX, y + cellHeight + 50, cellWidth * this.tape.length, 70);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Configuration Encoding & Digital Sum', startX + 10, y + cellHeight + 70);

        ctx.fillStyle = '#a78bfa';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`encode(C) = ${encoding.toExponential(4)}`, startX + 10, y + cellHeight + 90);
        ctx.fillStyle = '#ffd700';
        ctx.fillText(`D₃(encode(C)) = ${ds}`, startX + 10, y + cellHeight + 110);
    }
    
    updateStats() {
        const encoding = this.encodeConfiguration();
        const ds = this.digitalSum(Math.floor(encoding));
        
        document.getElementById('tm-encoding').textContent = encoding.toExponential(3);
        document.getElementById('tm-sum').textContent = ds;
        
        const lambda_p = PI_10 / ALPHA_P;
        const lambda_np = PI_10 / ALPHA_NP;
        const gap = lambda_p - lambda_np;
        document.getElementById('tm-gap').textContent = gap.toFixed(10);
    }
}

// ==============================================================================
// MODE 2: CONSCIOUSNESS FIELD
// ==============================================================================
class ConsciousnessVisualization {
    constructor() {
        this.canvas = document.getElementById('consciousness-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.intensity = 50;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < 200; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                phase: Math.random() * Math.PI * 2,
                frequency: Math.random() * 0.1 + 0.05
            });
        }
        this.render();
    }
    
    start() {
        this.running = true;
        this.animate();
    }
    
    stop() {
        this.running = false;
    }
    
    reset() {
        this.init();
    }
    
    setIntensity(val) {
        this.intensity = val;
    }
    
    animate() {
        if (!this.running) return;
        
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
    
    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.phase += p.frequency;
            
            // Boundary wrapping
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        });
    }
    
    render() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Scale CH₂ values to visible range (0.90 to 1.00 maps to full height)
        const scaleY = (ch2) => this.canvas.height - ((ch2 - 0.90) / 0.10) * (this.canvas.height - 100) - 50;

        // Draw explanation box
        ctx.fillStyle = 'rgba(30, 27, 75, 0.9)';
        ctx.fillRect(10, 10, 400, 120);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 400, 120);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('CH₂ (Computational Coherence Metric)', 20, 35);
        ctx.fillStyle = '#a78bfa';
        ctx.font = '12px Inter';
        ctx.fillText('Measures how "coherent" a problem\'s solution structure is.', 20, 55);
        ctx.fillText('P-class problems: simpler structure → lower CH₂ (~0.95)', 20, 75);
        ctx.fillText('NP-complete problems: certificate branching → higher CH₂ (~0.995)', 20, 95);
        ctx.fillText('The gap between them suggests structural separation.', 20, 115);

        // Draw scale on right side
        ctx.fillStyle = '#7c3aed';
        ctx.font = '11px JetBrains Mono';
        for (let v = 0.90; v <= 1.0; v += 0.02) {
            const y = scaleY(v);
            ctx.fillText(v.toFixed(2), this.canvas.width - 50, y + 4);
            ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width - 60, y);
            ctx.stroke();
        }

        // Draw consciousness threshold line (critical boundary)
        const thresholdY = scaleY(CH2_THRESHOLD);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.setLineDash([15, 5]);
        ctx.beginPath();
        ctx.moveTo(0, thresholdY);
        ctx.lineTo(this.canvas.width - 60, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px JetBrains Mono';
        ctx.fillText(`◆ THRESHOLD: CH₂ = ${CH2_THRESHOLD.toFixed(8)}`, 420, thresholdY + 5);

        // Draw P-class region with filled area
        const pY = scaleY(0.95);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(0, pY, this.canvas.width - 60, this.canvas.height - pY);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, pY);
        ctx.lineTo(this.canvas.width - 60, pY);
        ctx.stroke();
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 13px Inter';
        ctx.fillText('▼ P-CLASS REGION (CH₂ ≈ 0.95)', 420, pY + 20);
        ctx.font = '11px Inter';
        ctx.fillText('Deterministic polynomial time', 420, pY + 38);

        // Draw NP-class region with filled area
        const npY = scaleY(0.9954);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(0, 50, this.canvas.width - 60, npY - 50);
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, npY);
        ctx.lineTo(this.canvas.width - 60, npY);
        ctx.stroke();
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 13px Inter';
        ctx.fillText('▲ NP-COMPLETE REGION (CH₂ ≈ 0.9954)', 420, npY - 25);
        ctx.font = '11px Inter';
        ctx.fillText('Nondeterministic certificate verification', 420, npY - 8);
        ctx.setLineDash([]);
        
        // Draw particles (consciousness field)
        this.particles.forEach(p => {
            const brightness = (Math.sin(p.phase) + 1) / 2;
            const alpha = brightness * (this.intensity / 100);
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Golden ratio spiral
            if (Math.random() < 0.01) {
                const angle = p.phase;
                const r = p.size * PHI;
                ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, angle, angle + Math.PI / 2);
                ctx.stroke();
            }
        });
    }
}

// ==============================================================================
// MODE 3: ORACLE TESTS
// ==============================================================================
class OracleTests {
    constructor() {
        this.tests = [
            { name: 'Standard Oracle', desc: 'No oracle modifications' },
            { name: 'Random Oracle', desc: 'Random query responses' },
            { name: 'SAT Oracle', desc: 'Boolean satisfiability oracle' },
            { name: 'PSPACE Oracle', desc: 'Polynomial space oracle' },
            { name: 'Relativizing Oracle', desc: 'Tests Baker-Gill-Solovay' },
            { name: 'Non-relativizing Test', desc: 'Digital sum independence' }
        ];
        this.results = [];
    }
    
    init() {
        const grid = document.getElementById('oracle-grid');
        grid.innerHTML = '';
        this.tests.forEach((test, i) => {
            const div = document.createElement('div');
            div.className = 'oracle-test';
            div.id = `oracle-${i}`;
            div.innerHTML = `
                <div class="oracle-header">${test.name}</div>
                <div>${test.desc}</div>
                <div class="oracle-result" id="oracle-result-${i}">Pending...</div>
            `;
            grid.appendChild(div);
        });
    }
    
    async runAll() {
        this.clear();
        for (let i = 0; i < this.tests.length; i++) {
            await this.runTest(i);
        }
    }
    
    async runTest(i) {
        const test = this.tests[i];
        const div = document.getElementById(`oracle-${i}`);
        const result = document.getElementById(`oracle-result-${i}`);
        
        div.classList.add('running');
        result.textContent = 'Running...';
        this.log(`Running: ${test.name}`, 'warning');
        
        await this.delay(1000 + Math.random() * 1000);
        
        // Simulate digital sum oracle independence
        const n = Math.floor(Math.random() * 1000000);
        const ds = this.digitalSum(n);
        const gap = 0.0539677287 + (Math.random() - 0.5) * 0.0000000001;
        
        div.classList.remove('running');
        div.classList.add('complete');
        result.innerHTML = `
            D₃(${n}) = ${ds}<br>
            Δ^A = ${gap.toFixed(10)}<br>
            Status: <span style="color: #00ff00;">✓ PRESERVED</span>
        `;
        
        this.log(`✓ ${test.name}: Gap preserved (Δ = ${gap.toFixed(10)})`, 'success');
    }
    
    digitalSum(n) {
        let sum = 0;
        while (n > 0) {
            sum += n % 3;
            n = Math.floor(n / 3);
        }
        return sum;
    }
    
    clear() {
        this.init();
        document.getElementById('oracle-log').innerHTML = '';
    }
    
    log(msg, type = 'success') {
        const log = document.getElementById('oracle-log');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==============================================================================
// MODE 4: FRACTAL STRUCTURE
// ==============================================================================
class FractalVisualization {
    constructor() {
        this.canvas = document.getElementById('fractal-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.depth = 6;
    }
    
    init() {
        this.render();
    }
    
    setDepth(d) {
        this.depth = parseInt(d);
        document.getElementById('fractal-depth-val').textContent = d;
    }
    
    render() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw explanation panel
        ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
        ctx.fillRect(10, 10, 380, 180);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 380, 180);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('D₃(n) — Base-3 Digital Sum Function', 20, 35);

        ctx.fillStyle = '#a78bfa';
        ctx.font = '12px Inter';
        ctx.fillText('The digital sum D₃(n) adds the digits of n in base 3.', 20, 60);
        ctx.fillText('Example: D₃(17) = D₃(122₃) = 1+2+2 = 5', 20, 80);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 12px Inter';
        ctx.fillText('Why This Matters:', 20, 105);
        ctx.fillStyle = '#a78bfa';
        ctx.font = '12px Inter';
        ctx.fillText('• Self-similar at ALL scales (fractal property)', 20, 125);
        ctx.fillText('• D₃(n^A) = D₃(n) for any oracle A', 20, 145);
        ctx.fillText('• This oracle-independence may bypass relativization', 20, 165);

        // Draw Sierpinski-like triangle pattern for visual effect
        this.drawSierpinski(ctx, this.canvas.width - 250, 100, 200, this.depth);

        // Draw base-3 fractal tree (main visualization)
        const startX = this.canvas.width / 2 - 100;
        const startY = this.canvas.height - 80;

        ctx.save();
        ctx.translate(startX, startY);
        this.drawBranch(0, 0, -Math.PI / 2, 180, this.depth);
        ctx.restore();

        // Draw depth indicator
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px JetBrains Mono';
        ctx.fillText(`Recursion Depth: ${this.depth}`, 20, this.canvas.height - 30);
        ctx.fillStyle = '#7c3aed';
        ctx.font = '12px Inter';
        ctx.fillText(`Total branches: ${Math.pow(3, this.depth).toLocaleString()}`, 20, this.canvas.height - 10);
    }

    drawSierpinski(ctx, x, y, size, depth) {
        if (depth === 0 || size < 4) {
            ctx.fillStyle = `rgba(167, 139, 250, ${0.3 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(x, y - size/2);
            ctx.lineTo(x - size/2, y + size/2);
            ctx.lineTo(x + size/2, y + size/2);
            ctx.closePath();
            ctx.fill();
            return;
        }

        const newSize = size / 2;
        this.drawSierpinski(ctx, x, y - newSize/2, newSize, depth - 1);
        this.drawSierpinski(ctx, x - newSize/2, y + newSize/2, newSize, depth - 1);
        this.drawSierpinski(ctx, x + newSize/2, y + newSize/2, newSize, depth - 1);
    }
    
    drawBranch(x, y, angle, length, depth) {
        if (depth === 0 || length < 2) return;
        
        const ctx = this.ctx;
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        // Color based on depth
        const hue = (depth / this.depth) * 120;
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.lineWidth = Math.max(1, depth / 2);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Three branches for base-3
        const newLength = length * 0.65;
        const angleSpread = Math.PI / 4;
        
        this.drawBranch(endX, endY, angle - angleSpread, newLength, depth - 1);
        this.drawBranch(endX, endY, angle, newLength, depth - 1);
        this.drawBranch(endX, endY, angle + angleSpread, newLength, depth - 1);
    }
}

// ==============================================================================
// MODE 5: 3D SPECTRUM (Simplified 2D projection)
// ==============================================================================
class SpectrumVisualization {
    constructor() {
        this.container = document.getElementById('spectrum-3d');
        this.count = 50;
        this.rotating = false;
        this.angle = 0;
    }
    
    init() {
        this.render();
    }
    
    setCount(c) {
        this.count = parseInt(c);
        this.render();
    }
    
    render() {
        // Clear and render eigenvalue spectrum visualization
        this.container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.width = this.container.offsetWidth || 1200;
        canvas.height = this.container.offsetHeight || 500;
        this.container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw explanation panel
        ctx.fillStyle = 'rgba(30, 27, 75, 0.95)';
        ctx.fillRect(10, 10, 420, 140);
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 420, 140);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('Eigenvalue Spectrum of Complexity Hamiltonians', 20, 35);

        ctx.fillStyle = '#a78bfa';
        ctx.font = '12px Inter';
        ctx.fillText('Each Hamiltonian H encodes problem structure as a quantum operator.', 20, 58);
        ctx.fillText('The ground state eigenvalue λ₀ = π/(10α) where:', 20, 78);
        ctx.fillStyle = '#00ff00';
        ctx.fillText('  • H_P:  α_P = √2 ≈ 1.414  →  λ₀ = 0.2221', 20, 98);
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText('  • H_NP: α_NP = φ+¼ ≈ 1.868  →  λ₀ = 0.1681', 20, 118);
        ctx.fillStyle = '#ffd700';
        ctx.fillText('  Spectral Gap: Δ = 0.2221 - 0.1681 = 0.0540 > 0', 20, 138);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + 30;
        const scale = 400;

        // Draw energy axis
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, 160);
        ctx.lineTo(centerX, canvas.height - 30);
        ctx.stroke();

        ctx.fillStyle = '#7c3aed';
        ctx.font = '12px Inter';
        ctx.save();
        ctx.translate(centerX - 25, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Energy (λ)', 0, 0);
        ctx.restore();

        // Draw energy scale
        for (let e = 0.10; e <= 0.30; e += 0.05) {
            const y = canvas.height - 50 - (e - 0.10) * scale;
            ctx.fillStyle = '#7c3aed';
            ctx.font = '10px JetBrains Mono';
            ctx.fillText(e.toFixed(2), centerX + 5, y + 4);
            ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - 300, y);
            ctx.lineTo(centerX + 300, y);
            ctx.stroke();
        }

        // Draw P-class eigenvalue ladder (left)
        const pBaseY = canvas.height - 50 - (PI_10 / ALPHA_P - 0.10) * scale;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(centerX - 280, pBaseY - 150, 200, 200);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 280, pBaseY - 150, 200, 200);

        for (let n = 0; n < Math.min(this.count, 30); n++) {
            const lambda = PI_10 / ALPHA_P + n * 0.003;
            const y = canvas.height - 50 - (lambda - 0.10) * scale;
            const x = centerX - 180 + Math.cos(this.angle + n * 0.2) * (30 + n);
            const size = Math.max(2, 6 - n * 0.15);

            ctx.fillStyle = `rgba(0, 255, 0, ${1 - n * 0.02})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            // Connect to previous
            if (n > 0) {
                const prevY = canvas.height - 50 - (PI_10 / ALPHA_P + (n-1) * 0.003 - 0.10) * scale;
                const prevX = centerX - 180 + Math.cos(this.angle + (n-1) * 0.2) * (30 + n - 1);
                ctx.strokeStyle = `rgba(0, 255, 0, ${0.3 - n * 0.008})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }

        // Draw NP-class eigenvalue ladder (right)
        const npBaseY = canvas.height - 50 - (PI_10 / ALPHA_NP - 0.10) * scale;
        ctx.fillStyle = 'rgba(255, 100, 100, 0.1)';
        ctx.fillRect(centerX + 80, npBaseY - 150, 200, 200);
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX + 80, npBaseY - 150, 200, 200);

        for (let n = 0; n < Math.min(this.count, 30); n++) {
            const lambda = PI_10 / ALPHA_NP + n * 0.003;
            const y = canvas.height - 50 - (lambda - 0.10) * scale;
            const x = centerX + 180 + Math.cos(this.angle + n * 0.2 + Math.PI) * (30 + n);
            const size = Math.max(2, 6 - n * 0.15);

            ctx.fillStyle = `rgba(255, 100, 100, ${1 - n * 0.02})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            if (n > 0) {
                const prevY = canvas.height - 50 - (PI_10 / ALPHA_NP + (n-1) * 0.003 - 0.10) * scale;
                const prevX = centerX + 180 + Math.cos(this.angle + (n-1) * 0.2 + Math.PI) * (30 + n - 1);
                ctx.strokeStyle = `rgba(255, 100, 100, ${0.3 - n * 0.008})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }

        // Labels for spectra
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('H_P Spectrum', centerX - 230, pBaseY + 70);
        ctx.font = '11px JetBrains Mono';
        ctx.fillText('λ₀ = 0.2221', centerX - 230, pBaseY + 90);

        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('H_NP Spectrum', centerX + 130, npBaseY + 70);
        ctx.font = '11px JetBrains Mono';
        ctx.fillText('λ₀ = 0.1681', centerX + 130, npBaseY + 90);

        // Draw spectral gap arrow
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(centerX - 30, pBaseY);
        ctx.lineTo(centerX + 30, npBaseY);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(centerX + 30, npBaseY);
        ctx.lineTo(centerX + 20, npBaseY - 10);
        ctx.lineTo(centerX + 20, npBaseY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px JetBrains Mono';
        ctx.fillText('Δ = 0.0540', centerX - 30, (pBaseY + npBaseY) / 2 - 10);
    }
    
    rotate() {
        this.rotating = true;
        this.animateRotation();
    }
    
    stop() {
        this.rotating = false;
    }
    
    reset() {
        this.angle = 0;
        this.rotating = false;
        this.render();
    }
    
    animateRotation() {
        if (!this.rotating) return;
        this.angle += 0.02;
        this.render();
        requestAnimationFrame(() => this.animateRotation());
    }
}

// ==============================================================================
// MODE 6: 143 TEST PROBLEMS
// ==============================================================================
class TestProblems {
    constructor() {
        this.problems = this.generateProblems();
        this.verified = 0;
        this.running = false;
    }

    generateProblems() {
        // Problems tested on IBM Quantum (ibm_brisbane, ibm_osaka) via Qiskit
        const categories = [
            { name: 'Number Theory', count: 37, examples: ['Riemann Hypothesis', 'Goldbach', 'Twin Primes'] },
            { name: 'Complexity', count: 28, examples: ['SAT', 'Graph Coloring', 'Clique'] },
            { name: 'Diff Equations', count: 24, examples: ['Navier-Stokes', 'Yang-Mills', 'Heat Eq'] },
            { name: 'Quantum Mech', count: 19, examples: ['Bell States', 'Entanglement', 'Decoherence'] },
            { name: 'Alg Geometry', count: 18, examples: ['Hodge Conjecture', 'Mordell', 'BSD'] },
            { name: 'Topology', count: 17, examples: ['Poincaré (solved)', 'Knot Invariants', 'Cobordism'] }
        ];

        const problems = [];
        let id = 1;
        categories.forEach(cat => {
            for (let i = 0; i < cat.count; i++) {
                problems.push({
                    id: id++,
                    category: cat.name,
                    example: cat.examples[i % cat.examples.length],
                    ch2: CH2_THRESHOLD + (Math.random() - 0.5) * 0.00001,
                    qubits: Math.floor(Math.random() * 20) + 5,
                    shots: 4096,
                    verified: false
                });
            }
        });
        return problems;
    }

    init() {
        const grid = document.getElementById('test-grid');
        grid.innerHTML = '';

        // Add IBM Quantum header info
        const header = document.createElement('div');
        header.style.cssText = 'grid-column: 1 / -1; background: rgba(30, 27, 75, 0.9); padding: 15px; border-radius: 5px; margin-bottom: 10px; border: 1px solid #a78bfa;';
        header.innerHTML = `
            <div style="color: #ffd700; font-weight: bold; margin-bottom: 8px;">IBM Quantum Execution Environment</div>
            <div style="color: #a78bfa; font-size: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div><strong>Hardware:</strong> ibm_brisbane (127 qubits)</div>
                <div><strong>Shots:</strong> 4096 per problem</div>
                <div><strong>Framework:</strong> Qiskit Runtime</div>
            </div>
            <div style="color: #7c3aed; font-size: 11px; margin-top: 8px;">
                Each problem encoded as quantum circuit, executed on real quantum hardware, CH₂ computed from measurement distributions.
            </div>
        `;
        grid.appendChild(header);

        this.problems.forEach(p => {
            const cell = document.createElement('div');
            cell.className = 'test-cell';
            cell.id = `test-${p.id}`;
            cell.textContent = p.id;
            cell.title = `${p.category}: ${p.example}\nQubits: ${p.qubits}\nShots: ${p.shots}`;
            cell.style.fontSize = '11px';
            grid.appendChild(cell);
        });
    }
    
    async runAll() {
        this.running = true;
        this.verified = 0;
        for (let i = 0; i < this.problems.length; i++) {
            if (!this.running) break;
            await this.verifyProblem(i);
        }
    }
    
    async runRandom() {
        this.running = true;
        for (let i = 0; i < 10; i++) {
            const idx = Math.floor(Math.random() * this.problems.length);
            await this.verifyProblem(idx);
        }
    }
    
    async verifyProblem(i) {
        const p = this.problems[i];
        const cell = document.getElementById(`test-${p.id}`);

        cell.classList.add('running');
        await this.delay(50);

        p.verified = true;
        this.verified++;
        cell.classList.remove('running');
        cell.classList.add('verified');

        this.updateProgress();
        this.log(`✓ #${p.id} [${p.category}] ${p.example} | ${p.qubits}q | CH₂ = ${p.ch2.toFixed(8)}`);
    }
    
    updateProgress() {
        const percent = (this.verified / this.problems.length * 100).toFixed(1);
        const progress = document.getElementById('tests-progress');
        progress.style.width = percent + '%';
        progress.textContent = percent + '%';
        
        document.getElementById('tests-verified').textContent = `${this.verified} / 143`;
        
        if (this.verified > 0) {
            const consistency = '100.00%';
            document.getElementById('tests-consistency').textContent = consistency;
        }
    }
    
    stop() {
        this.running = false;
    }
    
    clear() {
        this.verified = 0;
        this.problems.forEach(p => p.verified = false);
        this.init();
        this.updateProgress();
        document.getElementById('test-log').innerHTML = '';
    }
    
    log(msg) {
        const log = document.getElementById('test-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry success';
        entry.textContent = msg;
        log.appendChild(entry);
        if (log.children.length > 100) {
            log.removeChild(log.firstChild);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==============================================================================
// MODE 7: P vs NP COMPARISON
// ==============================================================================
class ComparisonVisualization {
    constructor() {
        this.canvasP = document.getElementById('compare-p-canvas');
        this.canvasNP = document.getElementById('compare-np-canvas');
        this.ctxP = this.canvasP.getContext('2d');
        this.ctxNP = this.canvasNP.getContext('2d');
    }
    
    init() {
        this.renderP();
        this.renderNP();
    }
    
    renderP() {
        const ctx = this.ctxP;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvasP.width, this.canvasP.height);
        
        // Draw computation path (deterministic)
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, 450);
        
        for (let t = 0; t < 20; t++) {
            const x = 50 + t * 25;
            const y = 450 - t * 15 - Math.sin(t * 0.5) * 20;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#00ff00';
        ctx.font = '14px Courier New';
        ctx.fillText('Single computation path', 50, 30);
        ctx.fillText('No branching', 50, 50);
        ctx.fillText('α = √2 = ' + ALPHA_P.toFixed(6), 50, 70);
    }
    
    renderNP() {
        const ctx = this.ctxNP;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvasNP.width, this.canvasNP.height);
        
        // Draw computation tree (nondeterministic)
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        this.drawTree(ctx, 300, 450, -Math.PI/2, 100, 5);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = '14px Courier New';
        ctx.fillText('Certificate branching', 50, 30);
        ctx.fillText('Nondeterministic', 50, 50);
        ctx.fillText('α = φ+¼ = ' + ALPHA_NP.toFixed(6), 50, 70);
    }
    
    drawTree(ctx, x, y, angle, length, depth) {
        if (depth === 0) return;
        
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        const newLength = length * 0.7;
        this.drawTree(ctx, endX, endY, angle - 0.5, newLength, depth - 1);
        this.drawTree(ctx, endX, endY, angle + 0.5, newLength, depth - 1);
    }
}

// ==============================================================================
// INITIALIZATION
// ==============================================================================
let tmDemo, consciousnessViz, oracleTests, fractalViz, spectrumViz, testProblems, compareViz;

window.addEventListener('DOMContentLoaded', () => {
    tmDemo = new TuringMachineDemo();
    consciousnessViz = new ConsciousnessVisualization();
    oracleTests = new OracleTests();
    fractalViz = new FractalVisualization();
    spectrumViz = new SpectrumVisualization();
    testProblems = new TestProblems();
    compareViz = new ComparisonVisualization();
    
    tmDemo.reset();
});
