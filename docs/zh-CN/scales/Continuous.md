# Continuous

Continuous 比例尺 的输入 x 和输出 y 满足：y = a * f(x) + b
对于该类比例尺，根据配置选项的不同会在映射过程中存在一系列分支，
在数据量大的情况下这是很影响性能的，
所以通过函数柯里化和复合函数可以在映射过程中去掉分支，
这样当配置选项更新的时候需要重新合成函数。
参考：https://github.com/d3/d3-scale/blob/master/src/continuous.js

## Usage
TODO

## Options
| Key | Description | Type | Default|
| ----| ----------- | -----| -------|
| unknown | /** 当需要映射的值不合法的时候，返回的值 */ | <code>any</code> | `[]` |
| range | /** 值域，默认为 [0, 1] */ | <code>number[]</code> | `[]` |
| domain | /** 定义域，默认为 [0, 1] */ | <code>number[]</code> | `[]` |
| formatter | /** tick 格式化函数，会影响数据在坐标轴 axis、legend、tooltip 上的显示 */ | <code>(x: number) => string</code> | `[]` |
| tickCount | /** tick 个数，默认值为 5 */ | <code>number</code> | `[]` |
| tickMethod | /** 计算 ticks 的算法 */ | <code>import("D:/projects/scale/src/types").TickMethod</code> | `[]` |
| nice | /** 是否需要对定义域的范围进行优化 */ | <code>boolean</code> | `[]` |
| clamp | /** 是否需要限制输入的范围在值域内 */ | <code>boolean</code> | `[]` |
| round | /** 是否需要对输出进行四舍五入 */ | <code>boolean</code> | `[]` |
| interpolate | /** 插值器的工厂函数，返回一个对归一化后的输入在值域指定范围内插值的函数 */ | <code>import("D:/projects/scale/src/types").Interpolate</code> | `[]` |