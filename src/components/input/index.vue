<template>
    <a-input
        :id="id"
        v-model:value="modelValue"
        class="input-component"
        :style="baseStyle"
        :type="inputType"
        :placeholder="placeholder"
        @change="change"
    />
</template>

<style lang="less" scoped>
    .input-component {
        transition: none;
    }
</style>

<script src="./index.ts" lang="ts"></script>
