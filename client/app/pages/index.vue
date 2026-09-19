<template>
  <div>
    <div class="mt-10 flex justify-between max-[1290px]:flex-col">
      <div class="max-w-[500px]">
        <h4 class="uppercase text-primary mt-20 max-[1290px]:mt-5">
          More people better conversation
        </h4>
        <h2 class="text-4xl max-md:text-2xl font-bold mt-5">Talk about what</h2>
        <h2 class="text-4xl max-md:text-2xl font-bold text-primary">
          interests you
        </h2>
        <p class="font-bold text-xl mt-5 max-md:text-base">
          Find like-minded people, meet someone new, or join engaging
          discussions
        </p>
        <div class="mt-5">
          <p>Wanna talk is a space to connect through shared interests.</p>
          <p>
            Choose subject, find people, and start a discussion when it suits
            you.
          </p>
        </div>
        <ULink to="/signup">
          <button
            class="bg-blue-500 cursor-pointer pl-10 pr-10 pt-2 pb-2 text-white rounded-xl mt-5 flex items-center max-md:text-sm"
          >
            <div>Try now</div>
            <UIcon name="lucide:arrow-right" class="block ml-2" />
          </button>
        </ULink>
      </div>
      <div class="w-full">
        <div class="left-side-top-section w-full relative">
          <p
            class="absolute bottom-[30px] italic right-[75px] max-w-[400px] sub-globe-text max-md:text-base"
          >
            Wanna talk helps you find people with similar interests. Simply
            choose a topic, find a booking, or create your own subject
          </p>
          <p
            class="absolute bottom-[230px] right-[50px] rotate-[-25deg] italic text-blue-500 globe-text"
          >
            The world is closer than you think
          </p>
          <div class="globe-text-underline-block"></div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h2 class="text-4xl max-md:text-2xl font-bold">How it works ?</h2>
      <p class="mt-1">Just a few steps — and you´re in the conversation.</p>

      <div
        class="flex w-full justify-between mt-10 max-[1290px]:flex-col max-[1290px]:items-center max-[1290px]:gap-10"
      >
        <div>
          <div class="flex">
            <div
              class="bg-primary rounded-[200%] w-[38px] h-[38px] text-white flex justify-center items-center"
            >
              <div>1</div>
            </div>
            <div>
              <div
                class="bg-indigo-50 text-primary rounded-[200%] w-[80px] h-[80px] flex justify-center items-center m-auto"
              >
                <UIcon name="lucide:search" class="w-[30px] h-[30px]" />
              </div>
              <div class="w-[200px] text-center">
                <h2 class="font-bold mt-3">Choose a subject</h2>
                <p class="text-sm">to talk about</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-5 bg-gray-100 rounded-[200%] w-[40px] h-[40px] flex items-center justify-center text-primary bg-indigo-50 max-[1420px]:hidden"
        >
          <UIcon name="lucide:arrow-right" class="text-[25px]" />
        </div>
        <div>
          <div class="flex">
            <div
              class="bg-primary rounded-[200%] w-[38px] h-[38px] text-white flex justify-center items-center"
            >
              <div>2</div>
            </div>
            <div>
              <div
                class="bg-indigo-50 text-primary rounded-[200%] w-[80px] h-[80px] flex justify-center items-center m-auto"
              >
                <UIcon name="lucide:calendar" class="w-[30px] h-[30px]" />
              </div>
              <div class="w-[200px] text-center">
                <h2 class="font-bold mt-3">Select date and time</h2>
                <p class="text-sm">to make booking</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-5 bg-gray-100 rounded-[200%] w-[40px] h-[40px] flex items-center justify-center text-primary bg-indigo-50 max-[1420px]:hidden"
        >
          <UIcon name="lucide:arrow-right" class="text-[25px]" />
        </div>
        <div>
          <div class="flex">
            <div
              class="bg-primary rounded-[200%] w-[38px] h-[38px] text-white flex justify-center items-center"
            >
              <div>3</div>
            </div>
            <div>
              <div
                class="bg-indigo-50 text-primary rounded-[200%] w-[80px] h-[80px] flex justify-center items-center m-auto"
              >
                <UIcon name="lucide:clock" class="w-[30px] h-[30px]" />
              </div>
              <div class="w-[200px] text-center">
                <h2 class="font-bold mt-3">Wait</h2>
                <p class="text-sm">for session start time</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mt-5 bg-gray-100 rounded-[200%] w-[40px] h-[40px] flex items-center justify-center text-primary bg-indigo-50 max-[1420px]:hidden"
        >
          <UIcon name="lucide:arrow-right" class="text-[25px]" />
        </div>
        <div>
          <div class="flex">
            <div
              class="bg-primary rounded-[200%] w-[38px] h-[38px] text-white flex justify-center items-center"
            >
              <div>4</div>
            </div>
            <div>
              <div
                class="bg-indigo-50 text-primary rounded-[200%] w-[80px] h-[80px] flex justify-center items-center m-auto"
              >
                <UIcon name="lucide:smile" class="w-[30px] h-[30px]" />
              </div>
              <div class="w-[200px] text-center">
                <h2 class="font-bold mt-3">Enjoy the discussion</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10">
        <p class="italic">
          You can also create your own topic for discussion in the list of
          existing categories or select an existing topic and create slots in
          it.
        </p>
      </div>
      <div class="mt-10">
        <div v-if="isCategoriesLoading">
          <Loader />
        </div>
        <div v-if="categories.length && !isCategoriesLoading">
          <div
            class="flex justify-between items-center mt-10 max-[890px]:flex-col max-[890px]:items-start"
          >
            <h2 class="font-bold text-4xl max-md:text-2xl">
              Today's most popular categories
            </h2>
            <ULink
              to="/home"
              class="text-primary flex items-center max-[890px]:mt-5"
              >View all categories
              <UIcon name="lucide:arrow-right" class="ml-2"
            /></ULink>
          </div>
          <div class="flex justify-between mt-5 mb-10 max-[1200px]:flex-col">
            <ULink
              v-for="category in categories"
              :to="'/categories/' + category.id"
              class="max-[1200px]:mt-5 max-[1200px]:max-w-[100%] shadow rounded-2xl max-w-[300px] w-full h-[50px] mr-5 text-black hover:shadow-xl flex justify-center items-center bg-gray-50"
              style="transition: 0.2s all"
            >
              <div>
                <div>
                  <h2>{{ category.name }}</h2>
                </div>
              </div>
            </ULink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Loader from "~/components/Loader.vue";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";

const categoriesStore = useCategoriesStore();

const categories = ref<CategoryItem[]>([]);
const isCategoriesLoading = ref<boolean>(false);

async function getTheMostPopularCategories() {
  isCategoriesLoading.value = true;
  const response = await categoriesStore.getTheMostPopularCategories();

  if (response) {
    categories.value = response;
  }
  isCategoriesLoading.value = false;
}

onMounted(() => {
  getTheMostPopularCategories();
});
</script>
<style scoped>
.left-side-top-section {
  background-image: url("/img/globe.png");
  background-position: center;
  background-size: 800px;
  background-repeat: no-repeat;
  height: 500px;
}

.globe-text {
  font-family: "Caveat";
  font-weight: 400;
  font-size: 24px;
}

.globe-text-underline-block {
  border-top: 5px solid oklch(62.3% 0.214 259.815);
  border-radius: 20%;
  height: 43px;
  width: 240px;
  rotate: -25deg;
  position: absolute;
  bottom: 185px;
  right: 50px;
}

@media screen and (max-width: 1290px) {
  .left-side-top-section {
    background-size: 700px;
  }
  .globe-text {
    right: 25px !important;
  }
}

@media screen and (max-width: 960px) {
  .left-side-top-section {
    background-size: 600px;
  }
  .globe-text {
    right: 25px !important;
    bottom: 150px;
  }
  .globe-text-underline-block {
    bottom: 90px;
  }
  .sub-globe-text {
    display: block;
    bottom: 0px !important;
    right: 0;
    left: 0;
  }
  .globe-text-underline-block {
    rotate: 0deg !important;
    bottom: 70px;
    opacity: 0;
  }
  .globe-text {
    rotate: 0deg !important;
    bottom: 120px;
  }
}

@media screen and (max-width: 600px) {
  .left-side-top-section {
    background-position: top;
    background-size: 500px;
    height: 450px;
    margin-top: 50px;
  }
}

@media screen and (max-width: 490px) {
}
</style>
