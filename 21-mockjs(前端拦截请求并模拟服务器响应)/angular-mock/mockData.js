/**
 * 使用 Mock,测试脚本
 * Created by mac on 17/11/16.
 */
Mock.mock('http://caiyichen.me', {
    'name': '@name()',
    'age|1-100': 100,
    'color': '@color'
});