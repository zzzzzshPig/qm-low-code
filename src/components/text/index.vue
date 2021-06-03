<template>
    <div
        class="text-component"
        :style="baseStyle"
    >
        {{ text }}
    </div>
</template>

<style lang="less" scoped>
    .text-component {
        word-break: break-all;
    }
</style>

<script src="./index.ts" lang="ts"></script>
