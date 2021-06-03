<template>
    <a-input
        class="input-component"
        :style="baseStyle"
        :value="text"
        :type="type"
    />
</template>

<style lang="less" scoped>
    .text-component {
        word-break: break-all;
    }
</style>

<script src="./index.ts" lang="ts"></script>
