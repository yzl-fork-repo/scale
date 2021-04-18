# Linear

Linear 比例尺

构造可创建一个在输入和输出之间具有线性关系的比例尺

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