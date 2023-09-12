import { Core } from 'cytoscape';

function aStar(grid: number[][], start: number, goal: number, graph: Core): number[] {


    const grid2: number[][] = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 8, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];

    const nodesAndEdges = graph.elements();
    for (let i = 0; i < grid.length; i += 1) {
        for (let j = 0; j < grid[i].length; j += 1) {
            if (grid[i][j] !== 0) {
                const node1X = graph.nodes()[i].position().x;
                const node1Y = graph.nodes()[i].position().y;
                const node2X = graph.nodes()[j].position().x;
                const node2Y = graph.nodes()[j].position().y;
                const realLeangth = Math.abs(node1X - node2X) + Math.abs(node1Y - node2Y);
                grid2[i][j] = Math.floor(realLeangth);
                const edge = nodesAndEdges.filter(edge => edge.isEdge() && edge.source().id() === `${i + 1}` && edge.target().id() === `${j + 1}`);
                edge.style({
                    'width': 3,
                    'label': `${Math.floor(realLeangth)}`,
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                })
            }
        }
    }

    // Проверяем, что стартовая и конечная точки находятся в пределах сетки
    let step = 1;
    let fullPath = 0;
    start = Number(start) - 1;
    goal = Number(goal) - 1;
    // Создаем массив для хранения g-значений вершин
    const gValues = Array(grid2.length).fill(Infinity);
    gValues[start] = 0;

    // Создаем массивы для хранения родительских вершин и открытого списка
    const parents = Array(grid2.length).fill(null);
    const closedList: number[] = [];
    const openList = [start];
    const openListWhitPath: string[] = [`${start}`];


    // Функция для нахождения индекса вершины с наименьшим f-значением в открытом списке
    const getLowestFValueIndex = (list: number[]) => {
        let lowestIndex = 0;
        let gPlusH = '';
        for (let i = 1; i < list.length; i++) {
            if (calculateFValue(list[i]).fValue < calculateFValue(list[lowestIndex]).fValue) {
                lowestIndex = i;
                gPlusH = calculateFValue(list[i]).gPlusH;
            }
        }
        return {
            lowestIndex,
            gPlusH
        }
    };

    // Функция для вычисления f-значения вершины
    const calculateFValue = (index: number) => {
        const fValue = gValues[index] + heuristic(index, goal);
        return {
            fValue,
            gPlusH: `${index}: g-${gValues[index]} + h-${heuristic(index, goal)}`
        }
    };

    // Функция для получения списка соседей вершины
    const getNeighbors = (index: number) => {
        const neighbors = [];
        for (let i = 0; i < grid2[index].length; i++) {
            if (grid2[index][i] !== 0) {
                neighbors.push(i);
            }
        }
        return neighbors;
    };

    // Функция для вычисления эвристического расстояния между двумя вершинами
    const heuristic = (index1: number, index2: number) => {
        const x1 = graph.nodes()[index1].position().x;
        const y1 = graph.nodes()[index1].position().y;
        const x2 = graph.nodes()[index2].position().x;
        const y2 = graph.nodes()[index2].position().y;
        // return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        return 0;
    };

    // Запускаем цикл поиска пути
    while (openList.length > 0) {
        // Находим вершину с наименьшим f-значением в открытом списке
        const currentNodeIndex = openList[getLowestFValueIndex(openList).lowestIndex];

        // Если мы достигли конечной точки, возвращаем путь
        if (currentNodeIndex == goal) {
            const path = [currentNodeIndex + 1];
            let currentParent = parents[currentNodeIndex];
            while (currentParent !== null) {
                path.unshift(currentParent + 1);
                currentParent = parents[currentParent];
            }
            for (let i = 0; i < path.length - 1; i += 1) {
                fullPath += grid2[path[i] - 1][path[i + 1] - 1];
            }
            console.log('Путь: ', fullPath);
            return path;
        }

        // Иначе переносим вершину из открытого списка в закрытый список
        const nodeIndexInOpenList = openList.indexOf(currentNodeIndex);
        openList.splice(nodeIndexInOpenList, 1);
        openListWhitPath.splice(nodeIndexInOpenList, 1);
        closedList.push(currentNodeIndex);

        // Получаем список соседей текущей вершины
        const neighbors = getNeighbors(currentNodeIndex);

        // Перебираем всех соседей и обновляем g-значения и список открытых вершин
        for (const neighborIndex of neighbors) {
            // const tentativeGValue = gValues[currentNodeIndex] + 1;
            // const tentativeGValue = neighborIndex;
            if (grid2[currentNodeIndex][neighborIndex] < gValues[neighborIndex]) {
                parents[neighborIndex] = currentNodeIndex;
                gValues[neighborIndex] = grid2[currentNodeIndex][neighborIndex];
                if (!openList.includes(neighborIndex)) {
                    openList.push(neighborIndex);
                    openListWhitPath.push(`${neighborIndex}: g-${gValues[neighborIndex]} + h-${heuristic(neighborIndex, goal)}`);
                }
            }
        }
        console.log('шаг: ', step);
        step += 1;
        console.log('открытые вершины', openListWhitPath);
        console.log('закрытые вершины', closedList);
    }
    // Если мы не нашли путь, возвращаем null
    return [];
}

export default aStar;