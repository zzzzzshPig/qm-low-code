<template>
    <div
        class="main"
    >
        <a-button
            type="primary"
            class="btn-save"
            @click.stop="save"
        >
            保存
        </a-button>

        <a-button
            class="btn-preview"
            @click.stop="preview"
        >
            预览
        </a-button>

        <a-button
            disabled
            class="btn-prepublish"
            @click.stop="prepublish"
        >
            预发布
        </a-button>

        <a-button
            disabled
            class="btn-publish"
            @click.stop="publish"
        >
            发布
        </a-button>

        <div class="component-list">
            <div
                v-for="item in componentList"
                :key="item.name"
                class="item"
                draggable="true"
                @dragstart="drag.start(item)"
                @dragend="drag.restore"
            >
                <img
                    class="image"
                    :src="item.image"
                    alt=""
                >

                <div class="label">
                    {{ item.label }}
                </div>
            </div>
        </div>

        <div
            class="canvas-box"
            @click="select.noSelect"
        >
            <div
                class="canvas"
                @drop="drag.end"
                @dragover.prevent
                @mousemove="drag.move"
            >
                <div
                    v-for="item in components"
                    :key="item.id"
                >
                    <component
                        :is="item.name"
                        v-bind="item.props"
                    />

                    <div
                        :style="select.selectStyle(item)"
                        class="cover"
                        @click.stop
                        @mousedown="select.select($event, item)"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="select.selectProps"
            class="prop-list"
            @keydown.stop="select.keydown"
            @click.stop
        >
            <div class="prop-block">
                <div class="box">
                    <div class="item">
                        <div class="label">
                            Left
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.left"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            Top
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.top"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            Width
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.width"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            Height
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.height"
                            class="input"
                        />
                    </div>
                </div>

                <div class="box">
                    <div class="item">
                        <div class="label">
                            旋转
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.rotate"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            不透明度
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.opacity"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            层级
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.zIndex"
                            class="input"
                        />
                    </div>
                </div>

                <div class="item-line">
                    <div class="label">
                        背景颜色
                    </div>

                    <color-picker
                        v-model:value="select.selectProps.backgroundColor"
                        class="input-color"
                    />
                </div>
            </div>

            <div class="prop-block">
                <div class="title">
                    边框
                </div>

                <div class="box">
                    <div class="item">
                        <div class="label">
                            圆角
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.borderRadius"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            粗细
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.borderWidth"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            颜色
                        </div>

                        <color-picker
                            v-model:value="select.selectProps.borderColor"
                        />
                    </div>
                </div>

                <div class="item-line">
                    <div class="label">
                        风格
                    </div>

                    <a-select
                        v-model:value="select.selectProps.borderStyle"
                        class="input"
                    >
                        <a-select-option
                            v-for="item in borderStyleOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>

            <div
                v-if="propPanel.showFont"
                class="prop-block"
            >
                <div class="title">
                    文本
                </div>

                <div class="box">
                    <div class="item">
                        <div class="label">
                            大小
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.fontSize"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            粗细
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.fontWeight"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            行间距
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.lineHeight"
                            class="input"
                        />
                    </div>

                    <div class="item">
                        <div class="label">
                            字间距
                        </div>

                        <MyInput
                            v-model:value="select.selectProps.letterSpacing"
                            class="input"
                        />
                    </div>
                </div>

                <div class="item-line">
                    <div class="label">
                        颜色
                    </div>

                    <color-picker
                        v-model:value="select.selectProps.color"
                        class="input-color"
                    />
                </div>

                <div class="item-line">
                    <div class="label">
                        内容
                    </div>

                    <a-textarea
                        v-model:value="select.selectProps.text"
                        class="input"
                        type="textarea"
                    />
                </div>
            </div>

            <div
                v-if="propPanel.showComponentProps"
                class="prop-block"
            >
                <div class="title">
                    组件属性
                </div>

                <!-- 图片相关 -->
                <div
                    v-if="propPanel.showImage"
                    class="item-line"
                >
                    <div class="label">
                        图片地址
                    </div>

                    <a-input
                        v-model:value="select.selectProps.src"
                        class="input"
                    />
                </div>

                <!-- 输入框相关 -->
                <div
                    v-if="propPanel.showInput"
                    class="item-line"
                >
                    <div class="label">
                        id
                    </div>

                    <a-input
                        v-model:value="select.selectProps.id"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showInput"
                    class="item-line"
                >
                    <div class="label">
                        提示文字
                    </div>

                    <a-input
                        v-model:value="select.selectProps.placeholder"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showInput"
                    class="item-line"
                >
                    <div class="label">
                        类型
                    </div>

                    <a-select
                        v-model:value="select.selectProps.inputType"
                        class="input"
                    >
                        <a-select-option
                            v-for="item in inputTypeOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>

                <!-- 按钮相关 -->
                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        输入框id
                    </div>

                    <a-input
                        v-model:value="select.selectProps.inputId"
                        class="input"
                        placeholder="输入框的id属性"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        楼盘id
                    </div>

                    <MyInput
                        v-model:value="select.selectProps.houseId"
                        placeholder="填单会算到此楼盘"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        短信验证
                    </div>

                    <a-checkbox
                        v-model:checked="select.selectProps.shouldMsgCode"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        弹窗标题
                    </div>

                    <a-input
                        v-model:value="select.selectProps.buttonTitle"
                        placeholder="点击后弹窗标题"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        弹窗正文
                    </div>

                    <a-input
                        v-model:value="select.selectProps.buttonTip"
                        placeholder="点击后弹窗正文"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showButton"
                    class="item-line"
                >
                    <div class="label">
                        弹窗按钮
                    </div>

                    <a-input
                        v-model:value="select.selectProps.buttonBtnText"
                        placeholder="点击后弹窗按钮文字"
                        class="input"
                    />
                </div>

                <!-- 超链接相关 -->
                <div
                    v-if="propPanel.showLink"
                    class="item-line"
                >
                    <div class="label">
                        链接地址
                    </div>

                    <a-input
                        v-model:value="select.selectProps.href"
                        class="input"
                    />
                </div>

                <div
                    v-if="propPanel.showLink"
                    class="item-line"
                >
                    <div class="label">
                        跳转方式
                    </div>

                    <a-select
                        v-model:value="select.selectProps.target"
                        class="input"
                    >
                        <a-select-option
                            v-for="item in linkTargetOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
    .btn-save, .btn-preview, .btn-publish, .btn-prepublish {
        position: absolute;
        top: 16px;

        &.btn-save {
            right: 288px;
        }

        &.btn-preview {
            right: 368px;
        }

        &.btn-prepublish {
            right: 448px;
        }

        &.btn-publish {
            right: 538px;
        }
    }

    .main {
        .relative;
        min-width: 1200px;
        height: 100%;
    }

    .canvas-box {
        width: 100%;
        height: 100%;

        .canvas {
            overflow-x: hidden;
            overflow-y: auto;
            position: absolute;
            top: 80px;
            left: 50%;
            width: 375px;
            height: 667px;
            border: 1px solid rgba(0, 0, 0, .1);
            transform: translateX(-50%);
            box-sizing: content-box;

            /*滚动条样式*/
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width:4px;/*高宽分别对应横竖滚动条的尺寸*/
                height:4px;
            }

            &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius:5px;
                -webkit-box-shadow: inset005pxrgba(0,0,0,0.2);
                background:rgba(0,0,0,0.2);
            }

            &::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset005pxrgba(0,0,0,0.2);
                border-radius:0;
                background:rgba(0,0,0,0.1);
            }

            .cover {
                margin-top: -2px;
                margin-left: -2px;
                border: 2px solid #1090ff;
                box-sizing: content-box;
                cursor: pointer;
            }
        }
    }

    .component-list {
        .flex-align-start-wrap-justify-between;
        align-content: flex-start;
        position: absolute;
        top: 0;
        left: 0;
        width: 228px;
        height: 100%;
        padding: 16px;
        border-right: 1px solid rgba(0, 0, 0, .1);

        .item {
            .flex-align-center-justify-center-column;
            width: 86px;
            height: 86px;
            margin-bottom: 24px;
            border: 1px solid rgba(0, 0, 0, .1);
            cursor: pointer;
            user-select: none;
            border-radius: 4px;

            .image {
                width: 48px;
                height: 48px;
                -webkit-user-drag: none;
            }
        }
    }

    .prop-list {
        position: absolute;
        top: 0;
        right: 0;
        width: 270px;
        height: 100%;
        padding: 8px 16px;
        border-left: 1px solid rgba(0, 0, 0, .1);

        .prop-block {
            padding: 8px 0;
            border-bottom: 1px solid rgba(0, 0, 0, .1);

            .title {
                .defaultText(16px, #000, 22px, bold);
                margin-bottom: 8px;
            }

            .box {
                .flex-align-center-justify-between;
                margin-bottom: 8px;

                ::v-deep {
                    .btn-show {
                        width: 50px;
                    }
                }
            }

            .item-line {
                .flex-align-center;
                margin-top: 16px;

                .label {
                    width: 60px;
                    flex-shrink: 0;
                    margin-top: 4px;
                    margin-right: 8px;
                    margin-bottom: 4px;
                }

                .input {
                    width: 100%;
                }

                ::v-deep {
                    .input-color {
                        width: 88px;
                    }
                }
            }

            .item {
                margin-right: 8px;

                &:last-child {
                    margin-right: 0;
                }

                .label {
                    text-align: center;
                    margin-bottom: 4px;
                }

                .input {
                    width: 50px;
                    height: 24px;
                    padding: 0;
                    text-align: center;
                }
            }
        }
    }
</style>

<script lang="ts" src="./index.ts"></script>
