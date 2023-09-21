<template>
    <div class="container-fluid text-bg-light pt-5 h-100">
        <div class="d-flex flex-column p-3">
            <label for="start">Start</label>
            <input type="text" id="start" class="w-25" v-model="start">
            <label for="end" class="mt-3">End</label>
            <input type="text" id="end" class="w-25" v-model="end">
            <button class="mt-5 w-25 button" @click="aStat(start, end)">A*</button>
            <button class="mt-3 w-50 button" @click="ant(start, end)">Муравьиный алгоритм</button>
            
            <!-- <label for="useHeuristic">Использовать эвристику</label><input type="checkbox" id="useHeuristic" v-model="isUseHeuristics">
            {{isUseHeuristics}} -->
            <label for="ant" class="mt-3">Количество муравьев</label>
            <input type="text" id="ant" class="w-25" v-model="antCount">
            <label for="iteration" class="mt-3">Количество итераций</label>
            <input type="text" id="iteration" class="w-25" v-model="iterations">
            <label for="rho" class="mt-3">Коэффициент испрарения феромонов</label>
            <input type="text" id="rho" class="w-25" v-model="rho">
            <label for="alpha" class="mt-3">Влияние концентрации феромонов на выбор следующей вершины</label>
            <input type="text" id="alpha" class="w-25" v-model="alpha">
            <label for="betta" class="mt-3">Влияние эвристической информации на выбор следующей вершины</label>
            <input type="text" id="betta" class="w-25" v-model="betta">
            <label for="q" class="mt-3">Количество феромомнов</label>
            <input type="text" id="q" class="w-25" v-model="Q">
            <p class="mt-5">Ответ по A*: {{ astarpath }}</p>
            <p class="mt-3">Ответ по Муравьиному: {{ antpath }}</p>
            <p class="mt-3">Полный путь: {{ fullpath }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Data {
    start: number;
    end: number;
    antCount: number;
    iterations: number;
    rho: number;
    alpha: number;
    betta: number;
    Q: number;
    isUseHeuristics: boolean;
}

export default defineComponent({
    data(): Data {
        return {
            start: 0,
            end: 0,
            antCount: 0,
            iterations: 100,
            rho: 0.3,
            alpha: 0.8,
            betta: 0.2,
            Q: 20,
            isUseHeuristics: true,
        }
    },
    props: {
        astarpath: {
            type: String,
            required: true,
        },
        fullpath: {
            type: String,
            required: true,
        },
        antpath: {
            type: String,
            required: true,
        }
    },
    methods: {
        aStat(start: number, end: number) {
            this.$emit('astar', {
                start: Number(start),
                end: Number(end),
                isUseHeuristics: this.isUseHeuristics,
            })
        },
        ant(start: number, end: number) {
            this.$emit('antalg', {
                start: Number(start),
                end: Number(end),
                antCount: Number(this.antCount),
                iterations: Number(this.iterations),
                rho: Number(this.rho),
                alpha: Number(this.alpha),
                betta: Number(this.betta),
                Q: Number(this.Q),
            })
        },
    }
})
</script>

<style>
.button {
    border-radius: 5px;
}
</style>