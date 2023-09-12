import { Core } from "cytoscape";
import { graphInit } from "./graphInit";
import astar from './astar';
import antSearch from './antSearch';

type GraphMatrix = number[][];

interface Props {
    antCount: number;
    iterations: number;
    rho: number;
    alpha: number;
    betta: number;
    Q: number;
}

export class Graph {
    private static graph: Graph;
    private _graphMatrix!: GraphMatrix;
    private _graphCy!: Core;
    private constructor() { }

    public static getInstance(graphMatrix: GraphMatrix) {
        if (!Graph.graph) {
            Graph.graph = new Graph();
            Graph.graph._graphMatrix = graphMatrix;
        }
        return Graph.graph;
    }

    set graphMatrix(matrix: GraphMatrix) {
        this._graphMatrix = matrix;
    }

    get graphMatrix(): GraphMatrix {
        return this._graphMatrix;
    }

    set graphCy(graph: Core) {
        this._graphCy = graph;
    }

    get graphCy(): Core {
        return this._graphCy;
    }

    draw(): void {
        this._graphCy = graphInit(this._graphMatrix);
    }

    arrayPathToStringPath(path: number[]): string {
        return path.reduce((acc: string, node: number, index: number) => {

            acc += index === path.length - 1 ? `${node}` : `${node} ->`;

            return acc;
        }, '')
    }

    drawPath(path: number[]): void {
        for (let i = 0; i < path.length - 1; i++) {
            const nodesAndEdges = this._graphCy.elements();
            const nodes = nodesAndEdges.filter(node => node.isNode() && (node.id() === `${path[i]}` || node.id() === `${path[i + 1]}`));
            nodes.style({
                'background-color': 'red',
                'label': 'data(id)'
            })
            const edge = nodesAndEdges.filter(edge => edge.isEdge() && edge.source().id() === `${path[i]}` && edge.target().id() === `${path[i + 1]}`);
            edge.style({
                'width': 3,
                'label': `data(nodeValue)`,
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'line-color': 'red',
                'target-arrow-color': 'red',
            });
        }
    }

    aStar(start: number, end: number, graph: Core): string {
        const elements = this._graphCy.elements()
        const nodes = elements.filter(node => node.isNode());
        nodes.style({
            'background-color': '#666',
            'label': 'data(id)'
        })
        const edge = elements.filter(edge => edge.isEdge());
        edge.style({
            'width': 3,
            'label': `data(nodeValue)`,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
        });
        const astarPath = astar(this._graphMatrix, start, end, graph);
        this.drawPath(astarPath);
        return this.arrayPathToStringPath(astarPath);
    }

    antSearch(start: number, end: number, props: Props): string {
        const elements = this._graphCy.elements()
        const nodes = elements.filter(node => node.isNode());
        nodes.style({
            'background-color': '#666',
            'label': 'data(id)'
        })
        const edge = elements.filter(edge => edge.isEdge());
        edge.style({
            'width': 3,
            'label': `data(nodeValue)`,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
        });
        const antPath = antSearch(this._graphMatrix, start, end, props);
        this.drawPath(antPath);
        return this.arrayPathToStringPath(antPath);
    }
}

