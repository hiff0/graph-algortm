import cytoscape from "cytoscape";

export function graphInit(graph: number[][]): cytoscape.Core {
    const cy = cytoscape({
        container: document.getElementById('cy'), // container to render in

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'label': `data(nodeValue)`,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],

        layout: {
            name: 'grid',
            rows: 1
        }
    });

    const graphLayout = document.getElementById('graph') as HTMLElement;

    for (let i = 0; i < graph.length; i += 1) {
        const randWidth = Math.random() * graphLayout.offsetWidth - 100;
        const randHeight = Math.random() * graphLayout.offsetHeight - 100;
        cy.add({
            group: 'nodes',
            data: { id: `${i + 1}` },
            position: {
                x: randWidth,
                y: randHeight
            },
            grabbable: false,
        });
    }

    for (let i = 0; i < graph.length; i += 1) {
        for (let j = 0; j < graph[i].length; j += 1) {
            if (graph[i][j] !== 0) {
                cy.add({
                    group: 'edges',
                    data: { id: `${i + 30}${j + 30}`, source: `${i + 1}`, target: `${j + 1}`, nodeValue: `${graph[i][j]}` }
                });
            }
        }
    }

    return cy;
}
