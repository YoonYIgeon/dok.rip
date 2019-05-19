<template>
  <v-flex class="text-xs-center pa-1">
    <div class="pa-2" style="background: #efefef;">
      <v-img contain width aspect-ratio="1" :src="item.thumbnail"></v-img>
    </div>
    <div class="mt-1 mb-2">
      <div class="body-1 ellipsis">{{item.title}}</div>
      <div class="caption ellipsis">{{item.author || "-"}} / {{item.publisher || "-"}}</div>
      <div class="caption accent--text">{{thousand(item.price)}} KRW</div>
    </div>
  </v-flex>
</template>
<script>
  export default {
    props: ["item"],
    methods: {
      thousand(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    },
    mounted() {
      console.log(this.item);
    }
  };

</script>
<style>
</style>
