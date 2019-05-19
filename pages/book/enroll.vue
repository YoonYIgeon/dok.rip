<template>
  <v-container>
    <v-layout>
      <v-flex mx-auto xs12 sm8 md6 lg5>
        <v-card>
          <v-card-title>
            <h1>도서 등록하기</h1>
          </v-card-title>
          <v-card-text>
            <v-form v-model="vali" class='custom'>
              <template v-for="(item, i) in items">
                <!-- text -->
                <v-text-field v-if="item.type === `text`" v-model="input[item.model]" :label="item.label+` option`"
                  :required="item.required" :key="i" :suffix="item.suffix" :mask="item.mask" :rules="item.rules">
                  <template v-slot:label>
                    <span>{{item.label}}</span>
                    <i v-if="item.option" class="caption">option</i>
                  </template>
                </v-text-field>
                <!-- image -->
                <template v-else-if="item.type === 'image'">
                  <v-label>
                    <span>이미지</span><br>
                    <span class="caption">첫 번째 이미지가 표지로 등록되며, 내지 이미지는 3개까지 등록 가능합니다.</span>
                  </v-label>
                  <v-layout row wrap>
                    <v-flex xs3 :key="`${forceSolt}_${i}_${j}`" v-for="(img, j) in input[item.model]" class='c-img'>
                      <v-menu class="d-inline-block" offset-y>
                        <template v-slot:activator="{ on }">
                          <v-img aspect-ratio='1' :src="img.url" v-on="on" class='ma-1'></v-img>
                        </template>
                        <v-list>
                          <v-list-tile @click="changeFirst(input[item.model], j)">
                            <v-list-tile-title>표지로 설정</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="imageRemove(input[item.model], j)">
                            <v-list-tile-title>제거</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                    <v-flex xs3 class='c-img' v-if='input[item.model].length < 4'>
                      <!-- 이미지 추가 버튼 -->
                      <v-img aspect-ratio='1' @click="refClick(item.ref)" class="ma-1 d-flex align-center">
                        <v-icon>add</v-icon>
                      </v-img>
                      <input style="display: none" type="file" multiple :ref="item.ref"
                        @change="fileControl(item.ref, item.model)">
                    </v-flex>
                  </v-layout>
                </template>
                <!-- textarea -->
                <v-textarea v-if="item.type === `textarea`" auto-grow v-model="input[item.model]" :label="item.label"
                  :key="i" :required="item.required" :rules="item.rules">
                  <template v-slot:label>
                    <span>{{item.label}}</span>
                    <i v-if="item.option" class="caption">option</i>
                  </template>
                </v-textarea>
                <!-- date -->
                <v-menu v-else-if="item.type === `date`" v-model="item.menu" :close-on-content-click="false"
                  :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="input[item.model]" :label="item.label" readonly v-on="on" :rules="item.rules"
                      :required="item.required">
                      <template v-slot:label>
                        <span>{{item.label}}</span>
                        <i v-if="item.option" class="caption">option</i>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker v-model="input[item.model]" @input="item.menu = false" no-title scrollable />
                </v-menu>
              </template>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color='primary' @click='save'>저장</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  const rules = {
    required: v => (v && v.length > 0) || "필수 입력값입니다."
  };
  const items = [{
    label: "도서 표지",
    type: "image",
    model: "images",
    rules: [rules.required],
    ref: "photo"
  }, {
    label: "도서명",
    type: "text",
    model: "title",
    rules: [rules.required]
  }, {
    label: "저자",
    type: "text",
    model: "author",
    rules: [rules.required]
  }, {
    label: "출판사",
    type: "text",
    model: "publisher",
    option: true
  }, {
    label: "출간일",
    type: "date",
    model: "pubDate",
    option: true
  }, {
    label: "가로 사이즈",
    type: "text",
    model: "width",
    mask: "####",
    suffix: "mm",
    option: true
  }, {
    label: "세로 사이즈",
    type: "text",
    model: "height",
    mask: "####",
    suffix: "mm",
    option: true
  }, {
    label: "페이지",
    type: "text",
    model: "page",
    mask: "####",
    suffix: "p",
    option: true
  }, {
    label: "정가",
    type: "text",
    model: "price",
    mask: "#########",
    suffix: "KRW",
    rules: [rules.required]
  }, {
    label: "책 소개",
    type: "textarea",
    model: "description",
    suffix: "p",
    rules: [rules.required]
  }];
  const makeInit = obj => {
    const result = {};
    obj.forEach(item => {
      result[item.model] = "";
    });
    return result;
  };
  const init = makeInit(items)
  export default {
    methods: {
      refClick(ref) {
        this.$refs[ref][0].click();
      },
      changeFirst(list, index) {
        const current = list[index]
        list.splice(index, 1)
        list.unshift(current)
      },
      async save() {
        this.saveFiles().then(this.saveData)
      },
      async saveFiles() {
        try {
          const images = this.input.images
          const url = "/api/files/upload"
          const data = new FormData
          images.forEach(image => {
            data.append("images", image.file)
          })
          const config = {
            header: {
              "Content-Type": "multipart/form-data"
            }
          }
          const res = await this.$axios.post(url, data, config)
          if (res.status === 200) {
            const imgList = res.data.map(img => img.location)
            return imgList
          } else {
            throw Error
          }
          // }
        } catch (err) {
          console.error({
            ...err
          })
        }
      },
      async saveData(list) {
        console.log(list)
        const thumbnail = list.splice(0, 1)[0]
        const data = {
          ...this.input,
          authorId: this.user._id,
          thumbnail: thumbnail,
          images: list
        }
        const res = await this.$axios.post("/api/book/enroll", data)
        if (res.status === 200) {
          console.log("등록 완료")
          this.input = {
            ...init
          }
          this.$router.go(-1)
        } else {
          console.error({
            ...res
          })
        }
      },
      fileControl(ref, model) {
        const files = Array.from(this.$refs[ref][0].files);
        const addable = 4 - this.input[model].length
        if (files.length > addable) {
          this.$dialog.error({
            text: "파일은 4개까지만 등록 가능합니다.",
            title: "Error!"
          })
        } else {
          this.input[model] = this.input[model] || [];
          files.forEach(file => {
            const url = URL.createObjectURL(file);
            this.input[model].push({
              file,
              url
            });
          });
          this.forceSolt += 1;
        }
      },
      imageRemove(list, index) {
        // if (list[index].id) {
        // this.$dialog.confirm({
        //   text: "이미지를 삭제하시겠습니까?",
        //   title: "Warning"
        // }).then(bool => {
        //   console.log(bool)
        //   const data = {
        //     url: `/file/delete/${list[index].id}`
        //   };
        //   this.$store.dispatch("GET", data).then(r => {
        //     if (r.status === 200) {
        //       list.splice(index, 1);
        //     }
        //   });
        // });
        // } else {
        //   list.splice(index, 1);
        // }
        this.$dialog.confirm({
          text: "이미지를 삭제하시겠습니까?",
          title: "Warning"
        }).then(bool => {
          if (bool) {
            list.splice(index, 1);
          }
        })
      }
    },
    data() {
      return {
        forceSolt: 0,
        vali: null,
        input: {
          ...init
        },
        items
      };
    },
    computed: {
      user() {
        return this.$store.getters["account/user"]
      }
    }
  };

</script>
<style>
</style>
