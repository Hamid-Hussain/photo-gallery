<script setup>
import { imgURLs } from "~/constants/appConsts.js";

const selectedImg = ref(0);
const zoomBox = ref(null);
const zoomedImage = ref(null);
const image = ref(null);
const imageContainer = ref(null);

const changeImg = (direction) => {
  if (direction === "next" && selectedImg.value < imgURLs.length - 1) {
    selectedImg.value++;
  } else if (direction === "prev" && selectedImg.value > 0) {
    selectedImg.value--;
  }
  return;
};

const handleZoom = (event) => {
  const container = imageContainer.value;
  const zoomBoxEl = zoomBox.value;
  const zoomedImgEl = zoomedImage.value;

  if (!container || !zoomBoxEl || !zoomedImgEl) return;

  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left; // Mouse X relative to the image
  const y = event.clientY - rect.top; // Mouse Y relative to the image

  const zoomBoxSize = 100; // Zoom box size (same as CSS)
  const zoomFactor = 4; // Matches zoomed image magnification

  // Constrain coordinates
  const halfZoomBox = zoomBoxSize / 2;
  const constrainedX = Math.max(
    halfZoomBox,
    Math.min(x, rect.width - halfZoomBox)
  );
  const constrainedY = Math.max(
    halfZoomBox,
    Math.min(y, rect.height - halfZoomBox)
  );

  // Position the zoom box
  zoomBoxEl.style.left = `${constrainedX - halfZoomBox}px`;
  zoomBoxEl.style.top = `${constrainedY - halfZoomBox}px`;
  zoomBoxEl.style.display = "block";

  // Calculate zoomed image background position
  const bgPosX =
    ((constrainedX / rect.width) * (rect.width * zoomFactor) - constrainedX) /
    rect.width;
  const bgPosY =
    ((constrainedY / rect.height) * (rect.height * zoomFactor) - constrainedY) /
    rect.height;

  // Set zoomed image styles
  zoomedImgEl.style.backgroundImage = `url(${imgURLs[selectedImg.value]})`;
  zoomedImgEl.style.backgroundSize = `${rect.width * zoomFactor}px ${
    rect.height * zoomFactor
  }px`;
  zoomedImgEl.style.backgroundPosition = `${-bgPosX * rect.width}px ${
    -bgPosY * rect.height
  }px`;
  zoomedImgEl.style.width = `${rect.width}px`; // Match main image width
  zoomedImgEl.style.height = `${rect.height}px`; // Match main image height
  zoomedImgEl.style.display = "block";
};

const resetZoom = () => {
  if (zoomBox.value) zoomBox.value.style.display = "none";
  if (zoomedImage.value) zoomedImage.value.style.display = "none";
};
onMounted(() => {
  if (!zoomBox.value || !zoomedImage.value) {
    console.error("ZoomBox or ZoomedImage refs are not initialized.");
  }
  console.log("ZoomBox or ZoomedImage refs are initialized.");
});
</script>
<template>
  <div class="main">
    <h3>Photo Gallery</h3>
    <div class="carousel-wrapper">
      <div
        id="carouselExampleControls"
        class="carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="image-container" ref="imageContainer">
              <NuxtImg
                :src="imgURLs[selectedImg]"
                class="d-block w-100 main-img"
                @mousemove="handleZoom"
                @mouseleave="resetZoom"
              ></NuxtImg>
              <div class="zoom-box" ref="zoomBox"></div>
              <div class="image-buttons">
                <button class="btn view-all" @click="viewAll">View All</button>
                <button class="btn download" @click="downloadImage">
                  Download
                </button>
                <a
                  :href="imgURLs[selectedImg]"
                  download
                  class="btn download"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
            <!-- <div class="zoomed-image" ref="zoomedImage"></div> -->
          </div>
        </div>
        <!-- Carousel Buttons -->
        <button
          class="carousel-control-prev"
          type="button"
          @click="changeImg('prev')"
        >
          <!-- <span class="carousel-control-prev-icon" aria-hidden="true"></span> -->
          <i class="fa fa-chevron-left"></i>

          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          @click="changeImg('next')"
        >
          <!-- <span class="carousel-control-next-icon" aria-hidden="true"></span> -->
          <i class="fa fa-chevron-right"></i>

          <span class="visually-hidden">Next</span>
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
<style scoped lang="scss">
.carousel-wrapper {
  //   display: flex;
  gap: 20px;
  position: relative;
}

.image-container {
  position: relative;
  grid-gap: 2;
}
.main-img {
  border-radius: 12px;
}
.zoom-box {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(81, 79, 79, 0.4);
  border: 1px solid lightgray;
  pointer-events: none;
  display: none;
  z-index: 5;
}

.zoomed-image {
  width: auto; /* Dynamically set by JavaScript */
  height: auto; /* Dynamically set by JavaScript */
  background-repeat: no-repeat;
  border: 1px solid #ddd;
  position: absolute;
  top: 0;
  left: calc(100% + 8px); /* Adjust as needed */
  display: none;
  z-index: 10;
}

.image-buttons {
  position: absolute;
  bottom: 10px; /* Adjust vertical spacing */
  left: 10px; /* Adjust horizontal spacing */
  display: flex;
  gap: 10px; /* Spacing between buttons */
}

.btn {
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
  color: #fff; /* White text */
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.selected-img {
  border: 1px solid #073473;

  width: 100%;
  max-height: 100%;
  padding: 3px;
  border-radius: 6px;
}
.img-wrapper {
  margin-top: 16px;
  max-height: 220px;
  overflow-y: scroll;
}
.grid-img {
  padding: 3px;
  border-radius: 6px;
}
</style>
