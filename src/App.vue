<template>
  <div class="container-fluid p-0 h-100">
    <div class="row h-100">
      <div class="col-12 col-md-4 p-0">
        <Asidebar @astar="aStarAlg" @antalg="antAlg" :astarpath="astarpath" :antpath="antpath" :fullpath="fullpath" />
      </div>
      <div class="col-12 col-md-8 p-0" id="graph">
        <Graph :graphMatrix="graphMatrix" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Graph as GraphObject } from './utils';
import Graph from './components/Graph.vue'
import Asidebar from './components/Asidebar.vue';

// const graphMatrix = [
//   [0, 0, 1, 0, 1, 4, 0, 0, 0, 0, 0, 4, 10, 4, 0],
//   [20, 0, 0, 3, 1, 6, 7, 1, 0, 1, 8, 4, 9, 5, 1],
//   [0, 2, 0, 0, 3, 4, 7, 7, 7, 0, 0, 1, 1, 1, 1],
//   [1, 4, 7, 0, 11, 3, 2, 1, 1, 1, 0, 4, 5, 0, 0],
//   [17, 0, 7, 1, 0, 0, 0, 0, 0, 0, 0, 4, 9, 0, 15],
//   [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 4, 10, 4, 0],
//   [0, 0, 0, 3, 1, 0, 0, 0, 0, 1, 8, 4, 9, 5, 1],
//   [40, 2, 0, 0, 3, 4, 7, 0, 7, 0, 0, 99, 1, 1, 1],
//   [1, 4, 7, 0, 11, 3, 2, 1, 0, 1, 0, 4, 5, 0, 0],
//   [0, 5, 7, 1, 0, 0, 0, 0, 0, 0, 0, 4, 9, 11, 15],
//   [0, 0, 1, 0, 1, 4, 0, 0, 0, 0, 0, 4, 10, 4, 0],
//   [20, 0, 0, 3, 1, 6, 7, 1, 0, 1, 8, 0, 9, 5, 1],
//   [0, 2, 0, 0, 3, 4, 7, 7, 7, 0, 0, 1, 0, 13, 1],
//   [1, 0, 7, 0, 11, 3, 0, 15, 0, 1, 0, 0, 5, 0, 0],
//   [0, 5, 7, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 11, 0]
// ]

const graphMatrix = [
  [0, 5, 10, 0, 0, 17],
  [0, 0, 0, 0, 8, 0],
  [0, 0, 0, 7, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 7, 0, 0],
  [0, 0, 0, 11, 2, 0]
]

const graph = GraphObject.getInstance(graphMatrix);

onMounted(() => {
  graph.draw();
})

let astarpath = ref<string>('');
let antpath = ref<string>('');
let fullpath = ref<string>('');

function aStarAlg(points: {
  start: number,
  end: number,
  isUseHeuristic: boolean,
}): void {
  if (points.start > 0 && points.end > 0 && points.start <= graphMatrix.length && points.end <= graphMatrix.length) {
    const { fullPath, path } = graph.aStar(points.start, points.end, graph.graphCy, points.isUseHeuristic);
    fullpath.value = fullPath;
    astarpath.value = path;
  } else {
    console.log(points);
  }
}

function antAlg(payload: {
  start: number;
  end: number;
  antCount: number;
  iterations: number;
  rho: number;
  alpha: number;
  betta: number;
  Q: number;
}) {
  if (payload.start > 0 && payload.end > 0 && payload.start <= graphMatrix.length && payload.end <= graphMatrix.length && payload.antCount > 0) {
    antpath.value = graph.antSearch(payload.start, payload.end, {
      antCount: payload.antCount,
      iterations: payload.iterations,
      rho: payload.rho,
      alpha: payload.alpha,
      betta: payload.betta,
      Q: payload.Q
    });
  } else {
    console.log(payload);
  }
}
</script>

