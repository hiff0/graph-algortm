
interface Props {
    antCount: number;
    iterations: number;
    rho: number;
    alpha: number;
    betta: number;
    Q: number;
}

function antSearch(matrix: number[][], start: number, end: number, props: Props): number[] {
    start = start - 1;
    end = end - 1;
    const n = matrix.length; // количество вершин в графе
    const pheromones = Array<number>(n).fill(0).map(() => Array(n).fill(1)); // феромоны на ребрах графа
    const ants = Array<number>(props.antCount).fill(start); // муравьи начинают из стартовой вершины
    let bestPath: number[] | null = null; // кратчайший путь на текущей итерации
    let bestDist = Infinity; // длина кратчайшего пути на текущей итерации

    // вычисляем вероятности перехода для муравьев
    function prob(from: number, to: number): number {
        if (matrix[from][to] === 0) {
            return 0;
        }
        const a = Math.pow(pheromones[from][to], props.alpha);
        const b = Math.pow(1 / matrix[from][to], props.betta);
        return a * b;
    }

    // каждый муравей делает свой путь
    for (let i = 0; i < props.iterations; i += 1) {
        if (i < 4) {
            console.log(`итерация ${i + 1}`);
            console.log(`количество феромонов: ${pheromones}`);
        }
        for (let ant = 0; ant < props.antCount; ant += 1) {
            let curr = ants[ant]; // текущая вершина муравья
            const visited = [curr]; // вершины, которые посетил муравей
            let dist = 0; // длина пути муравья

            // пока муравей не достигнет конечной вершины
            while (curr !== end) {
                // выбираем следующую вершину согласно вероятностям перехода
                const probs = matrix[curr].map((_, to) => visited.includes(to) ? 0 : prob(curr, to));
                const sum = probs.reduce((acc, item) => {
                    return acc += item;
                }, 0);
                const normProbs = probs.map(p => p / sum);
                const rnd = Math.random();
                let next = -1;
                let total = 0;
                for (let j = 0; j < n; j++) {
                    total += normProbs[j];
                    if (rnd <= total) {
                        next = j;
                        break;
                    }
                }

                // если не нашли следующую вершину, то значит мы зашли в тупик
                if (next === -1) break;

                // добавляем найденную вершину к списку посещенных вершин и обновляем длину пути и текущую вершину
                visited.push(next);
                dist += matrix[curr][next];
                curr = next;
            }

            // если муравей достиг конечной точки и длина его пути лучше текущего результата,
            // то сохраняем этот путь как новый лучший результат
            if (visited[visited.length - 1] === end && dist < bestDist) {
                bestPath = visited;
                bestDist = dist;
            }

            // обновляем феромоны на ребрах
            for (let j = 0; j < visited.length - 1; j++) {
                const from = visited[j];
                const to = visited[j + 1];
                pheromones[from][to] += props.Q / dist;
                pheromones[to][from] = pheromones[from][to];
            }
        }

        // уменьшаем количество феромонов на каждом ребре после завершения итерации
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                pheromones[j][k] *= (1 - props.rho);
            }
        }
    }

    return bestPath !== null ? bestPath.map((node) => node += 1) : [];
}
export default antSearch;