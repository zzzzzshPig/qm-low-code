<template>
    <a-button
        class="button-component"
        :style="baseStyle"
    >
        {{ text }}
    </a-button>
</template>

<style lang="less" scoped>
    .button-component {
        transition: none;
    }
</style>

<script src="./index.ts" lang="ts"></script>
