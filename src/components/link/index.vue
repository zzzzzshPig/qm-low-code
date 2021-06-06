<template>
    <a
        class="link-component"
        :href="href"
        :target="target"
        :style="baseStyle"
    >
        {{ text }}
    </a>
</template>

<style lang="less" scoped>
    .link-component {
        text-decoration: none;
        word-break: break-all;
    }
</style>

<script src="./index.ts" lang="ts"></script>
