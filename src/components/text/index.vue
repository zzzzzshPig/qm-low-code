<template>
    <div class="text-component">
        {{ text.value }}
    </div>
</template>

<style lang="less" scoped>
    .text-component {
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: initial;
    }
</style>

<script src="./index.ts" lang="ts"></script>
