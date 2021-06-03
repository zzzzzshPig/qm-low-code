<template>
    <a-input
        v-model:value="modelValue"
        @keydown.stop="keydown"
        @change="change"
    />
</template>

<script lang="ts" src="./index.ts"></script>
