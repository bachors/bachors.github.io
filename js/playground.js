const PRESETS = {
	flowchart: `graph TD
A[Client Request] --> B[API Gateway]
B --> C{Authentication}
C -->|Valid| D[Microservice]
C -->|Invalid| E[401 Unauthorized]
D --> F[(PostgreSQL)]
D --> G[(Redis Cache)]`,

	sequence: `sequenceDiagram
autonumber
actor Alice
actor Bob
Alice->>Bob: Hello Bob, can you review my PR?
Bob-->>Alice: Sure Alice, checking now.
Bob->>Bob: Reviewing changes...
Bob->>Alice: Looks great! LGTM 🚀`,

	class: `classDiagram
class Animal {
	+String name
	+int age
	+makeSound()
}
class Dog {
	+String breed
	+bark()
}
class Cat {
	+boolean isLazy
	+purr()
}
Animal <|-- Dog
Animal <|-- Cat`,

	state: `stateDiagram-v2
[*] --> Idle
Idle --> Processing : Task Received
Processing --> Success : Done
Processing --> Error : Failed
Error --> Idle : Retry
Success --> [*]`,

	gitGraph: `gitGraph
commit id: "Initial commit"
branch develop
checkout develop
commit id: "Add core features"
branch feature-mermaid
commit id: "Create <mermaid-element> element"
commit id: "Add version loader"
checkout develop
merge feature-mermaid
checkout main
merge develop tag: "v1.0.0"`,

	pie: `pie title Programming Languages Used
"JavaScript" : 55
"HTML/CSS" : 25
"Python" : 15
"Other" : 5`,

	mindmap: `mindmap
    root((mermaid-element))
      Features
        Zero configuration
        Dynamic versions
        Shadow DOM
        Accessible
      Versions
        Default (Mermaid 12)
        CDN jsDelivr
        Custom URL
      Diagrams
        Flowcharts
        Sequences
        State charts
        Git graphs`
};

export class MermaidApp {
	constructor() {
		this.presetKey = 'flowchart';
		this.codeTextarea = document.getElementById('diagram-code');
		this.presetSelect = document.getElementById('diagram-preset');
		this.themeSelect = document.getElementById('diagram-theme');
		this.targetElement = document.getElementById('diagram-target');
		this.statusBadge = document.getElementById('diagram-status');
		this.timingBadge = document.getElementById('diagram-timing');
		this.download = document.getElementById('diagram-download');

		this.init();
	}

	init() {
		this.initPlayground();
	}

	initPlayground() {
		if (!this.targetElement) return;

		let startTime = performance.now();

		this.targetElement.addEventListener('render', (e) => {
			const elapsed = Math.round(performance.now() - startTime);
			if (this.statusBadge) {
				this.statusBadge.style.display = 'none';
				this.download.style.display = '';
				this.timingBadge.style.display = '';
			}
			if (this.timingBadge) {
				this.timingBadge.textContent = `<mermaid-element> render time ${elapsed} ms`;
			}
		});

		this.targetElement.addEventListener('error', (e) => {
			if (this.statusBadge) {
				this.statusBadge.style.display = '';
				this.download.style.display = 'none';
				this.timingBadge.style.display = 'none';
			}
		});

		if (this.download) {
			this.download.addEventListener('click', () => {
				this.downloadSvg();
			});
		}

		// Preset selection
		if (this.presetSelect) {
			this.presetSelect.addEventListener('change', (e) => {
				this.presetKey = e.target.value;
				if (PRESETS[this.presetKey]) {
					this.codeTextarea.value = PRESETS[this.presetKey];
					startTime = performance.now();
					this.targetElement.diagram = PRESETS[this.presetKey];
				}
			});
		}

		// Code editing
		if (this.codeTextarea) {
			let debounceTimer = null;
			this.codeTextarea.addEventListener('input', () => {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					startTime = performance.now();
					this.targetElement.diagram = this.codeTextarea.value;
					PRESETS[this.presetKey] = this.codeTextarea.value;
				}, 250);
			});
		}

		// Theme selector
		if (this.themeSelect) {
			this.themeSelect.addEventListener('change', (e) => {
				const t = e.target.value;
				startTime = performance.now();
				if (t) {
					this.targetElement.setAttribute('theme', t);
				} else {
					this.targetElement.removeAttribute('theme');
				}
			});
		}

	}
	
	downloadSvg() {
		const svg = this.targetElement.shadowRoot?.querySelector('svg');
		if (!svg) return;

		// Clone supaya tampilan di halaman tidak berubah
		const clone = svg.cloneNode(true);
		clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

		// Beri ukuran eksplisit dari viewBox agar tidak 100% / max-width saat dibuka mandiri
		const vb = svg.viewBox?.baseVal;
		if (vb && vb.width && vb.height) {
			clone.setAttribute('width', vb.width);
			clone.setAttribute('height', vb.height);
			clone.style.maxWidth = 'none';
		}

		const source = '<?xml version="1.0" encoding="UTF-8"?>\n' +
			new XMLSerializer().serializeToString(clone);

		const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `${this.presetKey}.svg`;
		document.body.appendChild(a);
		a.click();
		a.remove();

		URL.revokeObjectURL(url);
	}
	
}

function initDiagram() {
	window.mermaidApp = new MermaidApp();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initDiagram);
} else {
	initDiagram();
}