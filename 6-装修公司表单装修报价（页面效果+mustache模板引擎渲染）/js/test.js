$(document).ready(function () {
//   公式对应值和含义
//   房屋（建筑）面积为：B3 houseArea，
//   客厅面积为：B4 livingRoomArea，
//   卧室面积为：B5 BedroomArea，
//   卫生间面积为：B6 toiletArea，
//   厨房面积为：B7 kitchenArea，
//   卧室个数为：B8， roomNum
//   厨房个数为：E8， kitchenNum
//   卫生间个数为:G8   toiletNum
//   工程量那一列空白部分没有写公式

// 若需要修改人工部分列表项的价格，请修改manPartView对象中的items下的list下的price值。
// 若需要修改材料部分列表项的价格，请修改materialPartView对象中的items下的list下的price值。

    var roomNum = 0,
        kitchenNum = 0,
        toiletNum = 0,
        houseArea = 0,
        livingRoomArea = 0,
        BedroomArea = 0,
        kitchenArea = 0,
        toiletArea = 0;

    /**
     * 判断用户输入的内容是否有效
     * @return {boolean}
     */
    function invalidInput() {
        // 校验表单是否全部填写完成
        if (!houseArea) {
            alert('请填写房屋总面积');
            return false;
        } else if (!livingRoomArea) {
            alert('请填写客厅面积');
            return false;
        } else if (!BedroomArea) {
            alert('请填写卧室面积');
            return false;
        } else if (!kitchenArea) {
            alert('请填写厨房面积');
            return false;
        } else if (!toiletArea) {
            alert('请填写卫生间面积');
            return false;
        }
        return true;
    }

    // html模板
    var template = `
    <tbody>
    <tr>
        <td colspan="8" rowspan="2"
            style="background-color: rgb(239, 239, 239);">
            <strong><span style="font-size: 16px;">{{title}}</span></strong></td>
    </tr>
    <tr></tr>
    <tr>
        <td colspan="8"
            style="background-color: rgb(239, 239, 239);">
            <strong>{{desc}}</strong></td>
    </tr>
    <tr>
    {{#headTitle}}
        <td style="vertical-align: middle; text-align: center; color: rgb(51, 51, 51);">
            <strong>{{.}}<br></strong></td>
    {{/headTitle}}
    </tr>
    {{#items}}
        {{#list}}
     <tr>
         {{#rowspan}}
         <td rowspan="{{rowspan}}"><br>{{categoryName}}</td>
         {{/rowspan}}
          <td>{{name}}<br></td>
          <td style="text-align: center;">{{unit}}<br></td>
          <td style="text-align: center;">{{worker}}<br></td>
          <td style="text-align: center;">{{price}}<br></td>
          <td style="text-align: center;">{{count}}</td>
          <td style=" text-align: center;">{{total}}</td>
          <td>{{remark}}<br></td>
     </tr>
        {{/list}}
     {{/items}}
     <tr style="text-align: center;">
       <td><br></td>
       <td><br></td>
       <td style=""><br></td>
       <td style=""><br></td>
       <td style=""><br></td>
       <td style="font-weight: 700" class="decorate-color">{{totalPriceName}}：<br>
       </td>
       <td class="man-total-price decorate-color" style="width: 8.5%;font-weight: 700">{{totalPrice}}</td>
        <td style="width: 33%;"><br></td>
      </tr>
</tbody>`;


    /**
     * 计算每项（行）的合计、总合计,且渲染html
     * @param view 人工部分/材料部分的数据结构
     * @param isInit 是否是初始化操作
     * @return {*}
     */
    function calcRenderDetailTable(view, isInit) {
        view.items.forEach(function (item, key, thisItem) {
            item.list.forEach(function (val, k, thisVal) {
                // 计算每项（行）的合计
                thisVal[k].total = ((val.price * 100) * val.count / 100).toFixed(2);
                if (!isInit) {
                    // 总合计
                    view.totalPrice += parseFloat(thisVal[k].total);
                }
            });
        });

        // 模板渲染
        view.totalPrice = view.totalPrice.toFixed(2);
        var rendered = Mustache.render(template, view);
        $(view.el).html(rendered);

        return view;
    }

    /**
     * 计算、渲染详情表格
     * @param isInit 是否是初始化操作
     */
    function calcPrice(isInit) {
        // 人工部分数据结构
        var manPartView = {
                "el": ".decorate-man-table",
                "totalPrice": 0,
                "totalPriceName": '人工合计',
                "title": "一、人工部分",
                "desc": '1、铲墙拆墙、水电改造、吊顶、防水、贴砖、乳胶漆、保洁',
                "headTitle": ['', '名称', '单位', '工人', '单价', '工程量', '合计', '材料及施工说明'],
                "items": [
                    {
                        "categoryName": "铲墙拆墙",
                        "list": [
                            {
                                "rowspan": 4,
                                "name": "铲除原有乳胶漆",
                                "unit": "平方",
                                "worker": '',
                                "price": 3,
                                "count": houseArea * (2.5 * 10) / 10,
                                "total": 0,
                                "remark": "清工，施工中产生的建渣清运至楼下物业指定的地方"
                            },
                            {
                                "name": "拆除墙体",
                                "unit": "平方",
                                "worker": '',
                                "price": 58,
                                "count": 0,
                                "total": 0,
                                "remark": "砖结构，清工，施工中产生的建渣清运至楼下物业指定的地方"
                            },
                            {
                                "name": "拆除梁柱",
                                "unit": "根",
                                "worker": '',
                                "price": 120,
                                "count": 0,
                                "total": 0,
                                "remark": "地圈梁、门梁、门边立柱等钢筋混泥土结构，清工，施工中产生的建渣清运至楼下物业指定的地方"
                            },
                            {
                                "name": "拆除原有墙地砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 40,
                                "count": 0,
                                "total": 0,
                                "remark": "清工，施工中产生的建渣清运至楼下物业指定的地方"
                            }
                        ]
                    },
                    {
                        "categoryName": "水电改造",
                        "list": [
                            {
                                "rowspan": 8,
                                "name": "配电箱增加或移位",
                                "unit": "个",
                                "worker": '',
                                "price": 300,
                                "count": 0,
                                "total": 0,
                                "remark": "配电出线+配管+锁扣+（打墙、固定、抹灰）+人工费；不包括箱体、开关（此单价限1m范围内，超出部分按现场实际情况另计）。"
                            },
                            {
                                "name": "电路管线改造（含悬空布线）",
                                "unit": "米",
                                "worker": '',
                                "price": 13,
                                "count": houseArea * (1.5 * 10) / 10,
                                "total": 0,
                                "remark": "工艺流程：（墙地面开槽、封补）+pvc接线盒+pvc穿线管+pvc管件+局部软管+单芯铜芯线（或电话线、音箱线、CATV线、网络线）；规格：普通插座及灯具2.5；（注：主音响线墙外长度按预留1.5m计费，线盒内导线按预留0.1m计费，灯头预留按0.3-0.5m计费），米数按照线管长度计算，不含材料。"
                            },
                            {
                                "name": "线盒定位",
                                "unit": "个",
                                "worker": '',
                                "price": 5,
                                "count": houseArea * (0.5 * 10) / 10,
                                "total": 0,
                                "remark": "清工，不含线盒和辅料"
                            },
                            {
                                "name": "开关面板插座光纤安装",
                                "unit": "个",
                                "worker": '',
                                "price": 5,
                                "count": houseArea * (0.5 * 10) / 10,
                                "total": 0,
                                "remark": "清工，不含材料"
                            },
                            {
                                "name": "射灯筒灯安装",
                                "unit": "个",
                                "worker": '',
                                "price": 5,
                                "count": houseArea * (0.2 * 10) / 10,
                                "total": 0,
                                "remark": "清工，不含材料"
                            },
                            {
                                "name": "供水管改造",
                                "unit": "米",
                                "worker": '',
                                "price": 25,
                                "count": houseArea * (0.1 * 10) / 10,
                                "total": 0,
                                "remark": "墙地面开槽、封补+直径20-25mmPPR供水管+PPR连接件+热融合焊接（注：不足一米按一米计）。"
                            },
                            {
                                "name": "pvc下水改造",
                                "unit": "米",
                                "worker": '',
                                "price": 50,
                                "count": 0,
                                "total": 0,
                                "remark": "墙地面开槽、封补+直径32-50mmpvc下水管+pvc管件+不足pvc专用胶水，不包括地面开孔（注：不足一米按一米计）。"
                            },
                            {
                                "name": "pvc下水改造（主管）",
                                "unit": "米",
                                "worker": '',
                                "price": 80,
                                "count": 0,
                                "total": 0,
                                "remark": "墙地面开槽、封补+直径75-110mmpvc下水管+pvc管件+不足pvc专用胶水，不包括地面开孔（注：不足一米按一米计）。"
                            }
                        ]
                    },
                    {
                        "categoryName": "吊顶",
                        "list": [
                            {
                                "rowspan": 2,
                                "name": "石膏板吊平顶",
                                "unit": "张",
                                "worker": '',
                                "price": 140,
                                "count": houseArea * (0.3 * 10) / 10,
                                "total": 0,
                                "remark": "石膏板吊顶按石膏板张数算不足一张算一张，包括龙骨架，不含材料，有造型另外收费。"
                            },
                            {
                                "name": "生态木、桑拿板吊顶",
                                "unit": "平方",
                                "worker": '',
                                "price": 80,
                                "count": livingRoomArea * (0.1 * 10) / 10,
                                "total": 0,
                                "remark": "清工，不含材料"
                            }
                        ]
                    },
                    {
                        "categoryName": "防水",
                        "list": [
                            {
                                "rowspan": 2,
                                "name": "丙纶防水",
                                "unit": "平方",
                                "worker": '',
                                "price": 18,
                                "count": toiletArea * 4 + kitchenArea,
                                "total": 0,
                                "remark": "水泥和丙纶施工，包含丙纶不含水泥"
                            },
                            {
                                "name": "涂层防水",
                                "unit": "平方",
                                "worker": '',
                                "price": 12,
                                "count": 0,
                                "total": 0,
                                "remark": "不含涂层材料"
                            }
                        ]
                    },
                    {
                        "categoryName": "贴砖",
                        "list": [
                            {
                                "rowspan": 10,
                                "name": "找平",
                                "unit": "平方",
                                "worker": '',
                                "price": 17,
                                "count": BedroomArea,
                                "total": 0,
                                "remark": "清工，不含水泥河沙"
                            },
                            {
                                "name": "新建墙体",
                                "unit": "平方",
                                "worker": '',
                                "price": 80,
                                "count": 0,
                                "total": 0,
                                "remark": "清工，不含水泥河沙和砖"
                            },
                            {
                                "name": "厨房墙砖铺贴",
                                "unit": "平方",
                                "worker": '',
                                "price": 37,
                                "count": kitchenArea * (3.5 * 10) / 10,
                                "total": 0,
                                "remark": "清工平铺，不含砖和辅料，甲方要求勾缝前，由客户提供缝剂，不含原墙面铲除，最小尺寸300*600小于这个尺寸，有造型和波导线价格另算，包边不除门框和窗框。                                   工艺流程：清理基层，刷素水泥浆一遍，找水平，试排弹线，干贴工艺，勾缝，清理工艺标准：体积配合比为1:2.5水泥浆，平均粘贴层不低于20mm厚，采用干贴法"
                            },
                            {
                                "name": "厨房地砖铺贴",
                                "unit": "平方",
                                "worker": '',
                                "price": 37,
                                "count": kitchenArea,
                                "total": 0,
                                "remark": "清工平铺，不含砖和辅料，甲方要求勾缝前，由客户提供缝剂，不含原墙面铲除，最小尺寸300*600小于这个尺寸，有造型和波导线价格另算，包边不除门框和窗框。                                                                                        工艺流程：清理基层，刷素水泥浆一遍，找水平，试排弹线，干贴工艺，勾缝，清理                                                         工艺标准：体积配合比为1:2.5水泥浆，平均粘贴层不低于20mm厚，采用干贴法"
                            },
                            {
                                "name": "卫生间墙砖铺贴",
                                "unit": "平方",
                                "worker": '',
                                "price": 37,
                                "count": toiletArea * 4,
                                "total": 0,
                                "remark": "清工平铺，不含砖和辅料，甲方要求勾缝前，由客户提供缝剂，不含原墙面铲除，最小尺寸300*600小于这个尺寸，有造型和波导线价格另算，包边不除门框和窗框。                                                                                        工艺流程：清理基层，刷素水泥浆一遍，找水平，试排弹线，干贴工艺，勾缝，清理                                                         工艺标准：体积配合比为1:2.5水泥浆，平均粘贴层不低于20mm厚，采用干贴法"
                            },
                            {
                                "name": "卫生间地砖铺贴",
                                "unit": "平方",
                                "worker": '',
                                "price": 37,
                                "count": toiletArea,
                                "total": 0,
                                "remark": "清工平铺，不含砖和辅料，甲方要求勾缝前，由客户提供缝剂，不含原墙面铲除，最小尺寸300*600小于这个尺寸，有造型和波导线价格另算，包边不除门框和窗框。                                                                                        工艺流程：清理基层，刷素水泥浆一遍，找水平，试排弹线，干贴工艺，勾缝，清理                                                         工艺标准：体积配合比为1:2.5水泥浆，平均粘贴层不低于20mm厚，采用干贴法"
                            }, {
                                "name": "客厅地砖铺贴",
                                "unit": "平方",
                                "worker": '',
                                "price": 37,
                                "count": livingRoomArea,
                                "total": 0,
                                "remark": "清工平铺，不含砖和辅料，甲方要求勾缝前，由客户提供缝剂，不含原墙面铲除，最小尺寸800*800，小于这个尺寸有造型价格另算。                                                                                                   工艺流程：清理基层，刷素水泥浆一遍，找水平，试排弹线，干贴工艺，勾缝，清理                                                         工艺标准：体积配合比为1:2.5水泥浆，平均粘贴层不低于20mm厚，采用干贴法"
                            }, {
                                "name": "踢脚线",
                                "unit": "米",
                                "worker": '',
                                "price": 18,
                                "count": (livingRoomArea / 2).toFixed(2),
                                "total": 0,
                                "remark": "清工不含砖和辅料，甲方要求勾缝前，由客户提供缝剂，不含原墙面铲除。"
                            }, {
                                "name": "安蹲便",
                                "unit": "个",
                                "worker": '',
                                "price": 150,
                                "count": toiletNum,
                                "total": 0,
                                "remark": "清工，不含材料"
                            },
                            {
                                "name": "门槛石",
                                "unit": "个",
                                "worker": '',
                                "price": 30,
                                "count": parseInt(roomNum + kitchenNum * 3 + toiletNum),
                                "total": 0,
                                "remark": "清工，不含材料"
                            }
                        ]
                    },
                    {
                        "categoryName": "乳胶漆",
                        "list": [
                            {
                                "rowspan": 2,
                                "name": "乳胶漆",
                                "unit": "平方",
                                "worker": '',
                                "price": 16,
                                "count": houseArea * (2.5 * 10) / 10,
                                "total": 0,
                                "remark": "清工，不含石膏腻子和乳胶漆，  工艺流程：阳角塑形条，提直，刮石膏一遍，腻子两遍 ，打磨，刷底漆一遍，面漆两遍                                  备注：每户可刷两种颜色除开白色；多一色加收200元/色"
                            },
                            {
                                "name": "修补石膏线",
                                "unit": "米",
                                "worker": '',
                                "price": 3,
                                "count": houseArea * (0.4 * 10) / 10,
                                "total": 0,
                                "remark": "清工，不含石膏线"
                            }
                        ]
                    },
                    {
                        "categoryName": "保洁",
                        "list": [
                            {
                                "rowspan": 1,
                                "name": "完工保洁",
                                "unit": "平方",
                                "worker": '',
                                "price": 5,
                                "count": houseArea,
                                "total": 0,
                                "remark": "清完工保洁含玻璃，门窗等细节专业保洁"
                            }
                        ]
                    }
                ]
            },
            // 材料部分数据结构
            materialPartView = {
                "el": ".decorate-material-table",
                "totalPrice": 0,
                "totalPriceName": '材料合计',
                "title": "二、材料部分",
                "desc": '2、水电改造材料、吊顶材料、防水材料、贴砖材料、乳胶漆材料、门窗、衣柜、卫浴、橱柜',
                "headTitle": ['', '名称', '单位', '品牌', '单价', '工程量', '合计', '材料及施工说明'],
                "items": [
                    {
                        "categoryName": "水电材料",
                        "list": [
                            {
                                "rowspan": 21,
                                "name": "pvc16穿线管",
                                "unit": "根",
                                "worker": '',
                                "price": 2.5,
                                "count": Math.ceil(houseArea * 0.5),
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "黄腊管",
                                "unit": "根",
                                "worker": '',
                                "price": 1,
                                "count": Math.ceil(houseArea * 0.1),
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "pvc50排水管",
                                "unit": "根",
                                "worker": '康标蓝晨',
                                "price": 18,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "pvc110排水管",
                                "unit": "米",
                                "worker": '康标蓝晨',
                                "price": 18,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "ppr20水管",
                                "unit": "根",
                                "worker": '德国海德欧',
                                "price": 42,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "ppr25水管",
                                "unit": "根",
                                "worker": '德国海德欧',
                                "price": 57,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "ppr管弯头",
                                "unit": "个",
                                "worker": '德国海德欧',
                                "price": 4,
                                "count": 4,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "线管直接",
                                "unit": "个",
                                "worker": '',
                                "price": 0.5,
                                "count": Math.ceil(houseArea * 0.5 / 2),
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "50深线盒",
                                "unit": "个",
                                "worker": '',
                                "price": 2,
                                "count": Math.ceil(houseArea * 0.5),
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "38浅线盒",
                                "unit": "个",
                                "worker": '',
                                "price": 1.5,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "电线2.5平方",
                                "unit": "圈",
                                "worker": '美国金雕',
                                "price": 148,
                                "count": houseArea * (1.5 * 10) / 30 / 10,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "电线4平方",
                                "unit": "圈",
                                "worker": '美国金雕',
                                "price": 245,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "电线6平方",
                                "unit": "圈",
                                "worker": '美国金雕',
                                "price": 356,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "电线10平方",
                                "unit": "圈",
                                "worker": '美国金雕',
                                "price": 578,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "五孔插座",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 15,
                                "count": (houseArea * 0.5 - roomNum - roomNum * 2 - roomNum - kitchenNum - 4),
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "空调插座",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 20,
                                "count": roomNum + 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "单开双控",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 14,
                                "count": roomNum * 2,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "单开",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 13,
                                "count": kitchenNum + toiletNum,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "双开",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 17,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "三开",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 23,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "四开",
                                "unit": "个",
                                "worker": '西门子',
                                "price": 30,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "吊顶材料",
                        "list": [
                            {
                                "rowspan": 10,
                                "name": "木条",
                                "unit": "米",
                                "worker": '',
                                "price": 2.5,
                                "count": livingRoomArea * (0.4 * 10) * 9 / 10,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "元钉",
                                "unit": "斤",
                                "worker": '',
                                "price": 9,
                                "count": 2,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "直钉",
                                "unit": "盒",
                                "worker": '',
                                "price": 9,
                                "count": 4,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "钢钉",
                                "unit": "盒",
                                "worker": '',
                                "price": 8,
                                "count": 3,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "木螺丝",
                                "unit": "盒",
                                "worker": '',
                                "price": 19,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "膨胀螺丝",
                                "unit": "颗",
                                "worker": '',
                                "price": 0.5,
                                "count": 50,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "牛皮纸",
                                "unit": "圈",
                                "worker": '',
                                "price": 12,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "白乳胶",
                                "unit": "瓶",
                                "worker": '',
                                "price": 40,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "石膏板",
                                "unit": "张",
                                "worker": '龙牌',
                                "price": 28,
                                "count": livingRoomArea * (0.4 * 10) / 2 / 10,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "集成吊顶",
                                "unit": "平方",
                                "worker": '',
                                "price": 98,
                                "count": toiletArea + kitchenArea,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "防水材料",
                        "list": [
                            {
                                "rowspan": 1,
                                "name": "涂层防水",
                                "unit": "桶",
                                "worker": '德高',
                                "price": 360,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "贴砖材料",
                        "list": [
                            {
                                "rowspan": 11,
                                "name": "厨房墙砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 60,
                                "count": kitchenArea * 4,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "厨房地砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 60,
                                "count": kitchenArea,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "卫生间墙砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 60,
                                "count": toiletArea * 4,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "卫生间地砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 60,
                                "count": toiletArea,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "客厅墙砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 100,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "客厅地砖",
                                "unit": "平方",
                                "worker": '',
                                "price": 100,
                                "count": livingRoomArea,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "门槛石",
                                "unit": "块",
                                "worker": '',
                                "price": 90,
                                "count": roomNum + kitchenNum + toiletNum + 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "飘窗石材",
                                "unit": "米",
                                "worker": '',
                                "price": 300,
                                "count": roomNum * (1.6 * 10) / 10,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "踢脚线",
                                "unit": "米",
                                "worker": '龙牌',
                                "price": 10,
                                "count": livingRoomArea / 2,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "水泥",
                                "unit": "袋",
                                "worker": '',
                                "price": 33,
                                "count": (kitchenArea * 4 + kitchenArea + toiletArea * 4 + toiletArea + livingRoomArea) / 2.5,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "河沙",
                                "unit": "立方",
                                "worker": '',
                                "price": 220,
                                "count": (kitchenArea * 4 + kitchenArea + toiletArea * 4 + toiletArea + livingRoomArea) / 20,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "乳胶漆材料",
                        "list": [
                            {
                                "rowspan": 6,
                                "name": "界面剂",
                                "unit": "桶",
                                "worker": '',
                                "price": 160,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "石膏线",
                                "unit": "米",
                                "worker": '欧雅精艺',
                                "price": 11,
                                "count": houseArea,
                                "total": 0,
                                "remark": "素线条10公分以下"
                            },
                            {
                                "name": "石膏",
                                "unit": "袋",
                                "worker": '303',
                                "price": 16,
                                "count": houseArea / 4,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "腻子膏",
                                "unit": "件",
                                "worker": '303',
                                "price": 25,
                                "count": houseArea / 5,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "乳胶漆底漆",
                                "unit": "桶",
                                "worker": '多乐士',
                                "price": 260,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "乳胶漆面漆",
                                "unit": "桶",
                                "worker": '多乐士',
                                "price": 320,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "门窗材料",
                        "list": [
                            {
                                "rowspan": 4,
                                "name": "卧室实木门",
                                "unit": "扇",
                                "worker": '',
                                "price": 1000,
                                "count": roomNum,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "卫生间钛合金门",
                                "unit": "扇",
                                "worker": '',
                                "price": 500,
                                "count": 1,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "厨房钛合金推拉门",
                                "unit": "平方",
                                "worker": '',
                                "price": 420,
                                "count": kitchenNum * 3,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "铝合金窗",
                                "unit": "平方",
                                "worker": '',
                                "price": 240,
                                "count": livingRoomArea / 4,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "衣柜材料",
                        "list": [
                            {
                                "rowspan": 2,
                                "name": "衣柜柜体",
                                "unit": "平方",
                                "worker": '',
                                "price": 300,
                                "count": BedroomArea / 2,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "衣柜门",
                                "unit": "平方",
                                "worker": '',
                                "price": 300,
                                "count": BedroomArea / 4,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "卫浴材料",
                        "list": [
                            {
                                "rowspan": 4,
                                "name": "浴室柜",
                                "unit": "套",
                                "worker": '汉高',
                                "price": 1700,
                                "count": toiletNum,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "马桶",
                                "unit": "个",
                                "worker": '汉高',
                                "price": 700,
                                "count": 0,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "蹲便",
                                "unit": "个",
                                "worker": '汉高',
                                "price": 350,
                                "count": toiletNum,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "花洒",
                                "unit": "套",
                                "worker": '汉高',
                                "price": 600,
                                "count": toiletNum,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    },
                    {
                        "categoryName": "橱柜材料",
                        "list": [
                            {
                                "rowspan": 2,
                                "name": "橱柜柜体",
                                "unit": "米",
                                "worker": '',
                                "price": 800,
                                "count": kitchenNum * 3,
                                "total": 0,
                                "remark": ""
                            },
                            {
                                "name": "吊柜",
                                "unit": "米",
                                "worker": '',
                                "price": 350,
                                "count": kitchenNum * 2,
                                "total": 0,
                                "remark": ""
                            }
                        ]
                    }
                ]
            };

        // 计算并渲染人工部分table
        manPartView = calcRenderDetailTable(manPartView, isInit);
        // 计算并渲染材料部分table
        materialPartView = calcRenderDetailTable(materialPartView, isInit);

        if (!isInit) {
            $('.total-price-man').text(manPartView.totalPrice);
            $('.total-price-material').text(materialPartView.totalPrice);
        }
    }

    // 表单提交操作
    $("form[name='decorateCalFom']").on('submit', function (e) {
        // 获取页面表单项数据
        roomNum = parseFloat($("#roomNum").find("option:selected").val());
        kitchenNum = parseFloat($("#kitchenNum").find("option:selected").val());
        toiletNum = parseFloat($("#toiletNum").find("option:selected").val());
        houseArea = parseFloat($('#houseArea').val());
        livingRoomArea = parseFloat($('#livingRoomArea').val());
        BedroomArea = parseFloat($('#BedroomArea').val());
        kitchenArea = parseFloat($('#kitchenArea').val());
        toiletArea = parseFloat($('#toiletArea').val());

        // 判断用户输入的内容是否有效
        if (!invalidInput()) {
            return false;
        }
        // 计算、渲染详情表格
        calcPrice();

        return false;
    });

    /**
     * 初始化
     */
    function init() {
        Mustache.parse(template);   // 可选，加速模板渲染
        // true:表示是初始化操作，则预算总价格和合计都显示为0
        calcPrice(true);
    }

    init();
});