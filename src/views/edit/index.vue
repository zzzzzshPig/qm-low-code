<template>
    <div class="component-list">
        <div
            v-for="item in componentList"
            :key="item.componentId"
            class="item"
        >
            <img
                :src="item.image"
                alt=""
            >

            <div class="label">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
    .component-list {
        .flex-align-start-wrap;
        width: 300px;
        height: 100%;
        padding: 16px;
        border-right: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-center-justify-center-column;
            width: 100px;
            height: 100px;
            border: 1px solid rgba(0, 0, 0, .1);
            cursor: pointer;
            user-select: none;
            border-radius: 4px;

            .image {
                width: 48px;
                height: 48px;
            }
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
