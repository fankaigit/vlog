<template lang="pug">
  .record(:class="editable ? 'active' : 'inactive'")
    i.fa.fa-check-square-o(@click="toggle()", v-if="isChecked()")
    i.fa.fa-square-o(@click="toggle()", v-else)
</template>

<script>
  import types from '../store/types'

  export default {
    name: 'CheckRecord',
    props: ['habit', 'records', 'editable', 'add'],
    methods: {
      firstKey: function () {
        let keys = Object.keys(this.records)
        if (keys.length === 0) {
          return null
        }
        return keys[0]
      },
      isChecked: function () {
        let rs = this.records
        let k = this.firstKey(this.habit.id)
        return rs && k && rs[k]
      },
      toggle: function () {
        if (!this.editable) {
          return
        }
        let hid = this.habit.id
        let val = !this.isChecked(hid)
        if (!this.firstKey(hid)) {
          this.add(hid)
        }
        let k = this.firstKey(hid)
        this.$store.dispatch(types.ACT_SAVE_RECORD, {hid: hid, key: k, value: val})
      }
    }
  }
</script>

<style lang="scss" scoped>

  .record {
    text-align: center;
  }

  .active {
    .fa-square-o {
      color: gray;
    }

    .fa-check-square-o {
      color: lightseagreen;
    }
  }

  .inactive {
    .fa-square-o {
      color: lightgrey;
    }

    .fa-check-square-o {
      color: lightgrey;
    }
  }

</style>
