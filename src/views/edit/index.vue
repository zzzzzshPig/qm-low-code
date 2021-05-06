<template>
    <div class="component-list">
        <div
            v-for="item in componentList"
            :key="item.name"
            class="item"
            @click="addComponent(item)"
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

    <div
        class="canvas"
        @click="noSelectComponent"
    >
        <component
            :is="item.name"
            v-for="item in components"
            :key="item.id"
            :class="{
                select: item.select
            }"
            :style="initComponentStyle(item.props)"
            v-bind="item.props"
            @click.stop="selectComponent(item)"
        />
    </div>

    <div
        v-if="propList"
        class="prop-list"
    >
        <div
            v-for="(item, key) in propList"
            :key="key"
            class="item"
        >
            <div class="label">
                {{ item.label }}：
            </div>

            <a-input
                v-if="item.type === inputType.string"
                v-model:value="item.value"
                class="input"
                type="text"
                @keydown="disableKeydownEventDefaultWithdrawal"
            />

            <a-input
                v-if="item.type === inputType.number"
                v-model:value="item.value"
                type="number"
                class="input"
                @keydown="disableKeydownEventDefaultWithdrawal"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
    .canvas {
        overflow: hidden;
        position: absolute;
        top: 80px;
        left: 50%;
        width: 375px;
        height: 667px;
        border: 1px solid rgba(0, 0, 0, .1);
        transform: translateX(-50%);

        .select {
            box-shadow: 0 0 4px 0 #00b7ff;
            border-radius: 10%;
        }
    }

    .component-list {
        .flex-align-start-wrap;
        position: absolute;
        top: 0;
        left: 0;
        width: 228px;
        height: 100%;
        padding: 16px;
        border-right: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-center-justify-center-column;
            width: 90px;
            height: 90px;
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

    .prop-list {
        position: absolute;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        padding: 16px;
        border-left: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-start;
            padding: 8px 0;

            .label {
                flex-shrink: 0;
                width: 90px;
                margin: 5px 8px 0 0;
                word-break: break-all;
            }

            .input {
                flex: 1;
                height: 32px;
            }
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
