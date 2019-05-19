<template>
  <v-container>
    <v-layout>
      <v-flex mx-auto xs12 sm8 md6 lg5>
        <v-autocomplete v-model="model" :items="items" :loading="isLoading" :search-input.sync="query" clearable
          hide-details item-text="text" return-object label="검색어를 입력해주세요." solo @click:item="vc">
          <!-- <template v-slot:no-data>
            <v-list-tile>
              <v-list-tile-title> 로딩즁 </v-list-tile-title>
            </v-list-tile>
          </template>-->
          <!-- <template v-slot:selection="{ item, selected }">
            <span v-text="item.title"></span>
          </template>-->
          <template v-slot:item="{ item }">
            <v-list-tile-avatar tile class="headline font-weight-light white--text">
              <v-img contain :src="item.thumbnail"></v-img>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
              <v-list-tile-sub-title class="ellipsis">{{item.author}} / {{item.publisher || "-"}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <!-- <v-list-tile-action> </v-list-tile-action> -->
          </template>
        </v-autocomplete>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import {
    debounce
  } from "lodash";
  export default {
    data() {
      return {
        query: "",
        model: "",
        isLoading: false,
        items: []
      };
    },
    watch: {
      query: debounce(function (val) {
        this.search(val);
      }, 500)
    },
    methods: {
      vc(a, b) {
        console.log(a, b);
      },
      input(item) {
        this.model = item.title;
      },
      goDetail(item) {
        // console.log(item);
        return item.title;
      },
      async search(val) {
        // Items have already been loaded
        if (!this.query) {
          this.items = [];
        } else {
          try {
            this.isLoading = true;
            // Lazily load input items
            const res = await this.$axios.get(`/api/book?q=${val}`);
            if (res.status === 200) {
              console.log(res.data.result);
              this.items = res.data.result.map(r => {
                return {
                  ...r,
                  text: `${r.title} : ${r.author}`
                };
              });
            } else {
              throw Error;
            }
          } catch (err) {
            console.log(err);
          } finally {
            this.isLoading = false;
          }
        }
      }
    }
  };

</script>
<style>
</style>
