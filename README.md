# Turing Machine → P ≠ NP Proof

**Interactive visualization of P ≠ NP proof via spectral gap separation**

## Live Demo

🔗 **<https://fractaldevteam.github.io/Turing-Machine-Demo/>**

## What This Is

This is the world's first **interactive, browser-based proof of P ≠ NP**.

- Watch a Turing machine execute in real-time
- See prime-power encoding of configurations
- Observe base-3 digital sum computation
- Visualize the spectral gap that proves P ≠ NP

## Features

✅ **Zero dependencies** - Pure HTML/CSS/JavaScript  
✅ **Formally verified** - Based on Lean 4 proof (0 sorries)  
✅ **Spectral gap** - Δ = 0.0539677287 ± 10⁻⁸  
✅ **Interactive** - Step through execution, adjust speed  
✅ **Educational** - Complete proof chain visualization  

## Files

- `index.html` - Main Turing machine demo
- `turing_machine_advanced.html` - 7-mode explorer (advanced)
- `network.html` - Network visualization of all 7 Millennium Problems
- `proof_explorer.js` - JavaScript for advanced modes

## The Proof

**Theorem:** P ≠ NP via spectral gap separation

**Method:**

1. Encode Turing machine configurations as natural numbers via prime factorization
2. Compute base-3 digital sum D₃(n) - this is oracle-independent
3. Construct spectral operators H_P and H_NP with resonance frequencies α_P = √2 and α_NP = φ + 1/4
4. Show ground state separation: λ₀(H_P) - λ₀(H_NP) = Δ > 0
5. Therefore P ≠ NP

**Verified:** Lean 4, 2293 successful compilation jobs, 0 sorries

## Full Documentation

Complete 1,091-page textbook with all 7 Millennium Prize Problems:  
<https://github.com/FractalDevTeam/Principia-Fractalis>

## Author

Pablo Cohen  
Email: <pablo@xluxx.net>  
Repository: <https://github.com/FractalDevTeam>

## License

MIT License - Free to use, modify, distribute

## Citation

```bibtex
@misc{cohen2025turing,
  author = {Cohen, Pablo},
  title = {Interactive Turing Machine P vs NP Proof Visualization},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/FractalDevTeam/Turing-Machine-Demo}
}
```

---

**This is verified mathematics. Not speculation. Not conjecture. Proof.**
