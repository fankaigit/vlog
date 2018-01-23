<template lang="pug">
  div
    section#header.hero.is-info.is-small
      p.title 日程

    section#templates
      .mine.notification 我发布的日程
      .txt(v-if="!published")
        p 还没有发布过日程~
      .template(v-for="template in templates", v-if="user !== null && template.uid === user.uid")
        .name {{template.content.name}}
        .del(@click="delTemplate(template)")
          .button.is-danger.is-fullwidth  删除

      .notification 所有日程
      .template(v-for="template in templates")
        .name {{template.content.name}}
        .use(@click="useTemplate(template)")
          .button.is-warning.is-fullwidth  应用

      .txt
        i 应用一个日程会把所有活动添加到你的日程里
    section#actions
      router-link.button.is-primary(:to="'/habits'") 回到我的日程

</template>

<style lang="scss" scoped>

  #templates {
    .template {
      margin: 0.5rem 1rem 0;
      border-bottom: 1px solid lightblue;
      display: flex;
      height: 2.5rem;
      line-height: 2.5rem;

      .del {
        text-align: center;
        flex: 0 0 4rem;
        color: tomato;
      }

      .name {
        flex: 1;
      }

      .use {
        flex: 0 0 4rem;
      }
    }

    .notification {
      margin: 1rem 1rem 0;
      padding: 0.4rem;
      font-size: 1.5rem;
    }

    span.button {
      margin: 0;
      padding: 0;
    }
  }

  #actions .button {
    display: block;
    margin: 2rem auto;
    padding-top: 0.3rem;
    width: 90%;
  }

  .txt {
    margin: 1rem 1rem 0;
    font-size: 0.9rem;
  }

</style>

<script>
  import log from '../utils/log'
  import { mapGetters } from 'vuex'
  import axios from 'axios'
  import appConfig from '../../conf'
  import Vue from 'vue'
  import types from '../store/types'

  export default {
    name: 'Habits',
    data: function () {
      return {
        templates: {}
      }
    },
    methods: {
      useTemplate (template) {
        for (let h of template.content.habits) {
          log.info(template)
          this.$store.dispatch(types.ACT_SAVE_HABIT, h)
        }
        this.$router.push('/habits')
      },
      delTemplate (template) {
        let self = this
        const url = `${appConfig.urls.template}/${template.id}`
        axios.delete(url).then(
          (res) => {
            log.info('deleted template')
            Vue.delete(self.templates, template.id)
          },
          (err) => {
            log.error('fail to delete template', err)
          }
        )
      }
    },
    created: function () {
      let that = this
      const url = `${appConfig.urls.template}`
      axios.get(url).then(
        (res) => {
          that.templates = res.data
          log.info('got templates', Object.keys(that.templates))
        },
        (err) => {
          log.error('fail to get templates', err)
        }
      )
    },
    computed: {
      ...mapGetters([
        'user'
      ]),
      published: function () {
        if (this.user === null || Object.keys(this.templates).length === 0) {
          return false
        }
        log.info(typeof this.templates)
        for (let k in this.templates) {
          if (this.templates[k].uid === this.user.uid) {
            return true
          }
        }
        return false
      }
    }
  }
</script>

