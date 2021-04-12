思路参考：https://share.mubu.com/doc/5pkBH6HgDhD

建设一个公司落地页方向的低代码平台，市场部可以自由生成策略页面以应对市场需求

该方案技术向分为两个部分

1. 平台相关
2. 组件相关

### 平台相关

1. 顶部操作栏
2. 左侧顶部页面元素管理栏
3. 左侧底部组件选择栏
4. 右侧顶部操作记录栏
5. 右侧底部属性设置栏
6. 中间大面积页面布局栏
7. 底部信息栏（操作栏）
8. 插件机制，开放能力，插件引用
9. 账号机制
10. 项目管理机制
11. 发布机制

### 组件相关

#### 组件

1. swiper
2. input - 输入手机号
3. div
4. img
5. button - 填单按钮
6. a
7. nav

#### 内容

* 业务组件，具备具体行为，填单按钮会调用接口，发送统计事件
* 动画效果

#### 问题

1. 自适应
2. 事件处理
3. 组件更新是否会和之前页面冲突

