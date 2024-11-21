<script setup>
import { imgURLs } from "~/constants/appConsts.js";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};
</script>
<template>
  <div class="main">
    <div class="col-md-9 mx-auto mt-5">
      <div class="panel-box">
        <div class="panel-header">
          <h3 class="fw-bold f-14">Photos for Lot #82745763</h3>
        </div>
        <div class="col-sm-100 text-center">
          <div v-for="url in imgURLs">
            <img :src="url" class="mt-2 view-all-img"></img>
            <div class="p-10 top-btn fw-bold py-1">
              <i class="fa fa-chevron-circle-up"></i>
              <span class="dir-btn" @click="scrollToTop"> Back to Top </span>
              <span>|</span>

              <span class="dir-btn" @click="scrollToBottom"> Lot Details </span>
              <i class="fa fa-chevron-circle-down"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
