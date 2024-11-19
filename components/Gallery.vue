<script setup>
import { imgURLs, hdImgURLS } from "~/constants/appConsts.js";

const selectedImg = ref(0);
const zoomBox = ref(null);
const zoomedImage = ref(null);
const image = ref(null);
const imageContainer = ref(null);
const isZoomcEnabled = ref(false);
const isHDImage = ref(false);

const changeImg = (direction) => {
  isHDImage.value = false;
  if (direction === "next" && selectedImg.value < imgURLs.length - 1) {
    selectedImg.value++;
  } else if (direction === "prev" && selectedImg.value > 0) {
    selectedImg.value--;
  }
  return;
};
const imageURL = computed(() =>
  isHDImage.value ? hdImgURLS[selectedImg.value] : imgURLs[selectedImg.value]
);

const handleZoom = (event) => {
  if (!isZoomcEnabled.value) return;
  const container = imageContainer.value;
  const zoomBoxEl = zoomBox.value;
  const zoomedImgEl = zoomedImage.value;

  if (!container || !zoomBoxEl || !zoomedImgEl) return;

  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const zoomBoxSize = 100;
  const zoomFactor = 4;

  const halfZoomBox = zoomBoxSize / 2;
  const constrainedX = Math.max(
    halfZoomBox,
    Math.min(x, rect.width - halfZoomBox)
  );
  const constrainedY = Math.max(
    halfZoomBox,
    Math.min(y, rect.height - halfZoomBox)
  );

  zoomBoxEl.style.left = `${constrainedX - halfZoomBox}px`;
  zoomBoxEl.style.top = `${constrainedY - halfZoomBox}px`;
  zoomBoxEl.style.display = "block";

  const bgPosX =
    ((constrainedX / rect.width) * (rect.width * zoomFactor) - constrainedX) /
    rect.width;
  const bgPosY =
    ((constrainedY / rect.height) * (rect.height * zoomFactor) - constrainedY) /
    rect.height;

  zoomedImgEl.style.backgroundImage = `url(${imgURLs[selectedImg.value]})`;
  zoomedImgEl.style.backgroundSize = `${rect.width * zoomFactor}px ${
    rect.height * zoomFactor
  }px`;
  zoomedImgEl.style.backgroundPosition = `${-bgPosX * rect.width}px ${
    -bgPosY * rect.height
  }px`;
  zoomedImgEl.style.width = `${rect.width}px`;
  zoomedImgEl.style.height = `${rect.height}px`;
  zoomedImgEl.style.display = "block";
};

const resetZoom = () => {
  isZoomcEnabled.value = false;
  if (zoomBox.value) zoomBox.value.style.display = "none";
  if (zoomedImage.value) zoomedImage.value.style.display = "none";
};
onMounted(() => {
  if (!zoomBox.value || !zoomedImage.value) {
    console.error("ZoomBox or ZoomedImage refs are not initialized.");
  }
});
</script>
<template>
  <div class="main mt-4 p-md-4">
    <div class="carousel-wrapper">
      <div
        id="carouselExampleControls"
        class="carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="image-container" ref="imageContainer">
              <span class="zoom-btn">
                <i class="fa-regular fa-magnifying-glass-plus"></i>
                Click Image to Zoom
              </span>
              <NuxtImg
                :src="imageURL"
                class="d-block w-100 main-img"
                @mousemove="handleZoom"
                @mouseleave="resetZoom"
                @click="() => (isZoomcEnabled = true)"
              ></NuxtImg>
              <div class="zoom-box" ref="zoomBox"></div>
              <div class="image-buttons">
                <NuxtLink class="view-all view-all-btn" @click="viewAll">
                  VIEW ALL
                </NuxtLink>
                <div
                  v-if="!isHDImage"
                  class="pg-btn"
                  @click="() => (isHDImage = true)"
                >
                  <i class="fa-regular fa-high-definition"></i>
                </div>
                <a
                  :href="imgURLs[selectedImg]"
                  download
                  class="px-4 btn-download"
                  target="_blank"
                >
                  <i class="fas fa-cloud-download fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          @click="changeImg('prev')"
        >
          <i class="fa fa-chevron-left"></i>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          @click="changeImg('next')"
        >
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
      <div class="zoomed-image" ref="zoomedImage"></div>
    </div>
    <div class="flex-container img-wrapper">
      <div
        v-for="(url, index) in imgURLs"
        :key="index"
        class="flex-item grid-img"
      >
        <NuxtImg
          :src="url"
          :class="{ 'selected-img': index === selectedImg }"
        ></NuxtImg>
      </div>
      <div
        v-if="imgURLs.length % 5 !== 0"
        v-for="i in 5 - (imgURLs.length % 5)"
        :key="'empty-' + i"
        class="flex-item empty"
      ></div>
    </div>
  </div>
</template>
