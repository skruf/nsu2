<style scoped>
.column:hover {
  background-color: rgba(21, 21, 22, 0.033);
}
button {
  outline: none;
}
button:hover {
  background-color: #e0e0e0;
}
button:hover::after {
  background-color: rgba(21, 21, 22, 0.033);
}
button::after {
  content: "";
  transform: translateX(-50%);
  width: 200vw;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  pointer-events: none
}
</style>

<template>
  <v-form
    ref="localForm"
    class="pb-5 pr-5"
  >
    <label class="block text-center font-bold">
      Skudd
    </label>

    <div class="flex items-center justify-center">
      <label
        class="block text-center font-bold"
        style="transform: rotate(-90deg);"
      >
        Treff
      </label>

      <div class="flex z-0 overflow-x-hidden">
        <div
          v-for="hit in _range(1, 14)"
          :key="hit"
          class="flex flex-col items-center column"
        >
          <label class="block py-4 w-full text-center border-b border-solid border-gray-900 font-semibold mb-2 th-label">
            {{ hit }}
          </label>

          <button
            v-for="sum in _range(11)"
            :key="sum"
            ref="button"
            v-ripple
            :class="{ 'bg-gray-300': isSet(hit, sum) }"
            type="button"
            class="rounded-none relative w-full h-full hit bg-transparent mx-0"
            :data-testid="`ResultsFormButtonsSumButton${hit}-${sum}`"
            @click="setHit(hit, sum)"
          >
            {{ sum }}
          </button>
        </div>
      </div>
    </div>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue"
import _cloneDeep from "lodash.clonedeep"
import _range from "lodash.range"

const generateHits = () => _range(1, 14)
  .map((i) => ({ hit: i, sum: 0 }))

export default Vue.extend({
  name: "ResultsFormButtons",

  props: {
    value: {
      type: Object, default: (): any => ({ hits: generateHits(), total: 0 })
    }
  },

  data: () => ({
    hits: generateHits(),
    currentHit: 1,
    currentSum: 0
  }),

  computed: {
    total(): number {
      return [ ...this.hits ]
        .sort((a, b) => {
          if(a.sum < b.sum) return -1
          if(a.sum > b.sum) return 1
          return 0
        })
        .slice(3)
        .reduce((acc, c) => acc + c.sum, 0)
    }
  },

  watch: {
    value: {
      immediate: true,
      handler({ hits }): void {
        if(!hits.length) {
          this.hits = generateHits()
          return
        }
        if(hits !== this.hits) {
          this.hits = _cloneDeep(hits)
        }
      }
    },
    hits: {
      deep: true,
      handler(hits): void {
        this.$emit("input", { hits, total: this.total })
      }
    }
  },

  mounted() {
    document.addEventListener("keyup", this.onKeyUp)
  },

  beforeDestroy() {
    document.removeEventListener("keyup", this.onKeyUp)
  },

  methods: {
    onKeyUp(e): void {
      if(![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
      ].includes(e.key)) return

      if(e.key === "ArrowLeft") {
        if(this.currentHit === 1) return
        this.currentHit--
      }

      if(e.key === "ArrowRight") {
        if(this.currentHit === 13) return
        this.currentHit++
      }

      if(e.key === "ArrowUp") {
        if(this.currentSum === 0) return
        this.currentSum--
      }

      if(e.key === "ArrowDown") {
        if(this.currentSum === 10) return
        this.currentSum++
      }

      this.setHit(this.currentHit, this.currentSum)
    },

    getHit(hit): object {
      const i = this.hits.findIndex((h) => h.hit === hit)
      return this.hits[i]
    },

    isSet(hit, sum): boolean {
      return this.getHit(hit).sum === sum
    },

    setHit(hit, sum): void {
      this.getHit(hit).sum = sum
    },

    _range,

    clear(): void {
      this.hits = generateHits()
    }
  }
})
</script>
