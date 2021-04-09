import { clone } from '@antv/util';
import { BandOptions } from '../types';
import { Category } from './category';
import { sequence } from '../utils/sequence';

interface BandStateOptions {
  /** step 的数目。一般是 domain 的长度 */
  stepAmount: number;
  /** 初始的值域，连续 */
  range: number[];
  /** 同时设置内部边距和两侧边距 */
  padding?: number;
  /** 内部边距 */
  paddingInner?: number;
  /** 两侧边距 */
  paddingOuter?: number;
  /** 是否取整 */
  round?: boolean;
  /** 对齐，取值为 0 - 1 的整数，例如 0.5 表示居中 */
  align?: number;
}

/**
 * 基于 band 基础配置获取 band 的状态
 *
 * @param opt 相关选项
 * @see BandStateOptions
 * @return {object} 一个新对象
 */
function getBandState(opt: BandStateOptions) {
  const DEFAULT_OPTIONS = {
    range: [0, 1],
    align: 0.5,
    round: false,
    paddingInner: 0,
    paddingOuter: 0,
    padding: 0,
  };

  const option = {
    ...DEFAULT_OPTIONS,
    ...opt,
  };

  const { range, padding, stepAmount } = option;

  let step: number;
  let bandWidth: number;

  let rangeStart = range[0];
  const rangeEnd = range[1];

  // 当用户配置了opt.padding 且非 0 时，我们覆盖已经设置的 paddingInner paddingOuter
  // 我们约定 padding 的优先级较 paddingInner 和 paddingOuter 高
  const paddingInner = padding > 0 ? padding : option.paddingInner;
  const paddingOuter = padding > 0 ? padding : option.paddingOuter;

  // range 的计算方式如下：
  // = stop - start
  // = (stepAmount * step(n 个 step) )
  // + (2 * step * paddingOuter(两边的 padding))
  // - (1 * step * paddingInner(多出的一个 inner))
  const deltaRange = rangeEnd - rangeStart;
  const outerTotal = paddingOuter * 2;
  const innerTotal = stepAmount - paddingInner;
  step = deltaRange / Math.max(1, outerTotal + innerTotal);

  // 优化成整数
  if (option.round) {
    step = Math.floor(step);
  }

  // 基于 align 实现偏移
  rangeStart += (deltaRange - step * (stepAmount - paddingInner)) * option.align;

  // 一个 step 的组成如下：
  // step = bandWidth + step * paddingInner，
  // 则 bandWidth = step - step * (paddingInner)
  bandWidth = step * (1 - paddingInner);

  if (option.round) {
    rangeStart = Math.round(rangeStart);
    bandWidth = Math.round(bandWidth);
  }

  // 转化后的 range
  const adjustedRange = sequence(rangeStart, rangeEnd, step);

  return {
    step,
    adjustedRange,
    bandWidth,
  };
}

/**
 * Band 比例尺
 *
 * 一种特殊的 category scale，区别在于值域的范围是连续的。
 * 使用的场景例如柱状图，可以用来定位各个柱子水平方向距离原点开始绘制的距离、各柱子之间的间距
 *
 * 由于部分选项较为抽象，见下图描述：
 *
 * PO = paddingOuter
 * PI = paddingInner
 *
 * domain = [A, B]
 *
 * |<------------------------------------------- range ------------------------------------------->|
 * |             |                   |             |                   |             |             |
 * |<--step*PO-->|<----bandWidth---->|<--step*PI-->|<----bandWidth---->|<--step*PI-->|<--step*PO-->|
 * |             | ***************** |             | ***************** |             |             |
 * |             | ******* A ******* |             | ******* B ******* |             |             |
 * |             | ***************** |             | ***************** |             |             |
 * |             |<--------------step------------->|                                               |
 * |-----------------------------------------------------------------------------------------------|
 *
 * 性能方便较 d3 快出 8 - 9 倍
 */
export class Band extends Category<BandOptions> {
  // 步长，见上图
  private step: number = 0;

  // band 宽度
  private bandWidth: number = 0;

  // band 的 range 属性，由于 band 是基于 category 的，range 会被转换
  // 当用户直接获取 option.range 时，获取的属性是转化后的 range
  // 如果你需要获取转换前的 range，那么必须调用 getBandRange 方法
  private bandRange: number[] = [];

  // 覆盖默认配置
  protected getOverrideDefaultOptions() {
    return {
      domain: [],
      range: [0, 1],
      align: 0.5,
      round: false,
      paddingInner: 0,
      paddingOuter: 0,
      padding: 0,
      unknown: undefined,
    };
  }

  constructor(options?: Partial<BandOptions>) {
    super(options);

    // 为 band 作初始化工作
    this.adjustBandState(this.options.range);
  }

  /**
   * 更新/调整 band 配置
   */
  private adjustBandState(range: number[]) {
    // 更新 bandRange
    if (range) {
      this.bandRange = range;
    }

    const { align, domain, padding, paddingOuter, paddingInner, round } = this.getOptions();

    const newState = getBandState({
      align,
      range,
      padding,
      paddingOuter,
      paddingInner,
      round,
      stepAmount: domain.length,
    });

    // 更新 range
    this.options.range = newState.adjustedRange;
    this.step = newState.step;
    this.bandWidth = newState.bandWidth;
  }

  public clone() {
    return new Band(clone(this.getOptions()));
  }

  public update(updateOptions: Partial<BandOptions>) {
    this.options = { ...this.options, ...updateOptions };

    // 更新 band 相关配置
    this.adjustBandState(updateOptions.range || this.bandRange);

    // 调用 category 的 update
    super.update(this.options);
  }

  public getStep() {
    return this.step;
  }

  public getBandRange() {
    return this.bandRange;
  }

  public getBandWidth() {
    return this.bandWidth;
  }

  public getOptions() {
    return {
      ...this.options,
      range: this.bandRange,
    };
  }
}