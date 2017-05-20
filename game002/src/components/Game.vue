<template>
  <div id="game" class="screen-app app-fullscreen"  data-title="老虎机抽奖">

      <!--老虎机抽奖-->
      <div class="pop-lottery" id="js_lhjLayer" style="height: 768px; background-size: cover; width: 100%; left: 0px; margin-left: 0px;">
        <div class="lhj-loading js_lhjLoading" style="height: 768px; display: none;"><img src="../assets/logo/logo_qu_white_shadow_189.png"></div>
        <div class="ele-spring" style="width: 100%; background-size: 100%;"></div>
        <div class="colorful js_lhjColorRibbon hidden"><img src="../assets/lottery/colorful.png" alt=""></div>
        <div class="inner-lottery" style="top: 1px;">
          <h2 class="tit-lott">今日最幸运</h2>
          <!--抽奖-->
          <div class="lottery-box2">
            <a href="javascript:void(0);" class="logo2"><img src="../assets/logo/lzg_logo.jpg" alt=""></a>
            <div class="btn-lottery-start" :class="(this.pulling === 1 ? 'rotate' : '' )" v-on:click="start" id="js_lhjStartBtn">
              <img src="../assets/lottery/btn-switch.png" alt=""></div>
            <div class="btn-lottery-bg"></div>
            <div class="point-box" id="js_lhjLightBox">
              <ul class="point-list pl1 clearfix">
                <li v-for="top_light in 18" :class="getLightOnIndex(top_light)?'light':''"></li>
              </ul>
              <ul class="point-list pl2">
                <li v-for="right_light in 9" :class="getLightOnIndex(right_light+18)?'light':''"></li>
              </ul>
              <ul class="point-list pl3 clearfix">
                <li v-for="bl_light in 7" :class="getLightOnIndex(bl_light+27)?'light':''"></li>
                <li class="place-li"></li>
                <li v-for="br_light in 7" :class="getLightOnIndex(br_light+34)?'light':''"></li>
              </ul>
              <ul class="point-list pl4">
                <li v-for="left_light in 9" :class="getLightOnIndex(left_light+41)?'light':''"></li>

              </ul>
            </div>
            <div   class="inner-this js_lhjBoxAll">
              <div class="center-block clearfix" :class="'lhj-box-'+parseInt(current_winners_num)">
              <div v-for="random in totalRandomPerson" class="box lhj-box"  >
                <ul class="avatar-list clearfix" >
                  <li >
                    <div :class="(scroll === 1 ?'scroll':(scroll === 2?'scroll-stop':''))" class="s-box clearfix">
                      <div class="clearfix person" v-for="person in random"  :data-person-id="person.uid">
                        <img :src="person.head" :alt="person.nickname"/>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>


              </div>

            </div>
          </div>
          <!--end 抽奖-->

          <!-- start 中奖信息以及抽奖设置-->

          <div class="prize-box2">
            <div class="winners-cont" :class="(winners.length == 0?'hidden':'3'+winners.length)">
              <div class="loops tabs">
                <div :class="(selected_loop === lp ? 'active':'')" class="loop-index" @click="changeLoop(lp)" v-for="lp in loop">第{{ lp }}轮 </div>
              </div>
              <div class="tab-content">
                <div  :class="(selected_loop === lp ? '':'hidden')" class="winners" v-for="lp in loop">
                  <ul >
                    <li v-for="person in winners[lp-1]">
                      <img class="avatar" :src="person.head" :alt="person.nickname" />
                      <div>{{ person.nickname }}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="" style="text-align: right;">
              <span style="color: #ffffff;">抽取人数</span>
              <select v-model="current_winners_num" style="width: 55px;font-size: 22px;display: inline-block;" >
                <option v-for="num in winners_numbers" >{{ num }}</option>
              </select>
            </div>

          </div>

          <!-- end 中奖信息以及抽奖设置-->

        </div>
      </div>


  </div>
</template>

<style src="../css/v1_common.css"></style>

<!-- 网络获取  1. 进入该页面初始化时的 persons数据获取  activity/persons 2. 点击抽奖时候的中奖信息获取  activity/special -->


<script>
  import axios from 'axios'

  export default {
    name: 'game',
    computed: {
      isReady: function () {
        return this.persons.length > 0
      },
      totalRandomPerson: function () {
        var limits = 5
        var total = this.persons.length
        var totalRandom = []
        for (var i = 0; i < this.current_winners_num; i++) {
          var startRandIndex = parseInt(total * Math.random())
          var random = this.persons.slice(startRandIndex)
          var need = limits - random.length
          if (need > 0) {
            random = random.concat(this.persons.slice(0, need))
          }

          // console.log('随机数组', random)
          totalRandom[i] = random
        }

        if (this.scroll === 2) {
          // 设置中奖人
        }
        return totalRandom
      }
    },
    created: function () {
      console.log('已初始化应用，开始读取数据...')
      this.fetchData()
    },
    watch: {
      // 如果 question 发生改变，这个函数就会运行
      winners: function (newWinners, oldValue) {
        console.log('准备同步中奖人信息到本地cookies...', newWinners)
        this.syncCookies()
        this.loop = this.winners.length
      }
    },
    methods: {
      isArray: function (o) {
        return Object.prototype.toString.call(o) === '[object Array]'
      },
      changeLoop: function (lp) {
        this.selected_loop = lp
        console.log('当前查看的轮次', this.selected_loop)
      },
      fetchData: function () {
        // 获取数据
        console.log('读取数据中...', this.$route.query)
        this.activity_id = parseInt(this.$route.query['act_id'])
        this.selected_loop = 1
        this.winners = [
//          [
//            {
//              'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//              'nickname': '王大国',
//              'uid': 1188
//            }],
//          [ {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }],
//          [{
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          }, {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          } ]
        ]

        if (this.activity_id > 0) {
          axios({
            method: 'post',
            url: '/webview/query_people?aid=22',
            data: {
              aid: this.activity_id,
              count: 200
            }
          }).then(function (res) {
            console.log(this, res.data)
            var prizes = res.data.prizes

            if (!this.isArray(prizes)) {
              alert('返回数据非法')
              prizes = []
              this.persons = []
            } else {
              this.winners = prizes
              this.persons = res.data.signs
            }
          }.bind(this)).catch(function (err) {
            console.log(this, err)
            this.winners = []
            alert('请求出错,请刷新页面')
          }.bind(this))
        }
      },
      syncCookies: function () {
        // 同步数据到cookies
        this.$cookie.set('old_winners', this.$cookie.get('winners'))
        this.$cookie.set('winners', JSON.stringify(this.winners))
        console.log('已缓存数据', JSON.parse(this.$cookie.get('winners')))
      },
      getLightOnIndex: function (curLight) {
        return (this.lightOnIndex === 999999 || (parseInt(curLight) === (this.lightOnIndex % 50)))
      },
      twinkle: function () {
        console.log('滚动结束、缓慢滚动')
        this.scroll = 2
        this.twinkleCnt ++
        if (this.lightOnIndex === 999999) {
          this.lightOnIndex = -999999
        } else {
          this.lightOnIndex = 999999
        }
        if (this.twinkleCnt < 8) {
          setTimeout(this.twinkle, 500)
        } else {
          this.stop()
        }
      },
      scrollLight: function () {
        console.log('开始滚动')
        this.pulling = 0
        this.lightOnIndex++
        this.scrollItemIndex = (this.scrollItemIndex + 1) % 5
        // 5秒= 5000 / 800 = 6轮
        // 一圈 50
        if (this.lightOnIndex > 2 * 50) {
          this.lightOnIndex = 999999
          this.twinkle()
        } else {
          this.scroll = 1
          setTimeout(this.scrollLight, 100)
        }
      },
      // 开始抽奖,转动
      start: function () {
        if (!this.isReady) {
          alert('抽奖尚未准备好')
          console.log('抽奖尚未准备好')
          return
        }
        if (this.state === 0) {
          console.log('第' + this.loop + '轮抽奖开始')
          // 初始化
          this.pulling = 1
          this.lightOnIndex = 1
          this.twinkleCnt = 0
          // 开始抽奖
          this.state = 1
          setTimeout(this.scrollLight, 1600)
        }
      },
      stop: function () {
        console.log('抽奖结束')
        this.state = 0
        this.scroll = 0
        this.loop++
        this.selected_loop = this.loop
      },
      getWinners: function () {
        // 获取中奖人
        // 参数 轮次: loop, 活动id: id
      }
    },
    data () {
      return {
        iseady: false, // 是否准备好了，用于标记是否可以启动start
        selected_loop: 0, // 当前查看的抽奖轮次
        activity_id: 0, // 活动id
        loop: 0, // 抽奖轮次
        scroll: 0, // 标记滚动 0：无操作 1: 滚动 2：停止
        pulling: 0, // 拉下转动
        scrollItemIndex: 0,
        state: 0, // 0： 未开始抽奖 1: 抽奖中
        lightOnIndex: 1,
        twinkleCnt: 0, // 最后闪烁的次数
        current_winners_num: 10,
        winners_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        winners: [  // 中奖人信息，数组，下标0表示为第一次抽，1表示为第二次抽

        ],
        persons: [
//          {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': 'Test',
//            'uid': -1
//          }
//          {
//            'head': 'http://wx.qlogo.cn/mmopen/Q3auHgzwzM4icTnDlrDAzxDoZK6EF4hDh5D7NVdhyeRCz6xzWodWeO5kFRNrXPB9nSrN53sA8oAsOmhaCJWtf2DxfC8aib1j29cpHAib3JdWOI/0',
//            'nickname': '王大国',
//            'uid': 1188
//          },
//          {
//            'head': 'http://wx.qlogo.cn/mmopen/WKbQiaNVg489D2n65kicRvcngdlDeggO2icC5Bx7sBzOcicBBbxFLAYACJibGB3mGIzRiaQXSBR3fdR0uVjCmykCV909oictlQbTpOic/0',
//            'nickname': '李四',
//            'uid': 1187
//          },
//          {
//            'head': 'http://wx.qlogo.cn/mmopen/ajNVdqHZLLClShRialF0ickXCoxCcf2icR3woMdgtGYib9y0pvibzxwibAyOUkkLkugMyMMtn5N8H2fwU9kSZJD2tRHQ/0',
//            'nickname': '张三',
//            'uid': 1186
//          },
//          {
//            'head': 'http://cdnssl.hddpm.com/images/lottery/head.jpg',
//            'nickname': '张三',
//            'uid': 1186
//          },
//          {'head': 'http://pic55.nipic.com/file/20141208/19462408_171130083000_2.jpg', 'nickname': '王美', 'uid': 1188},
//          {'head': 'http://pic128.nipic.com/file/20170430/23122089_113942837038_2.jpg', 'nickname': '吴天', 'uid': 1186}
        ]
      }
    }
  }

</script>
