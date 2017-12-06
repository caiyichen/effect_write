/**
 * Created by caiyichen on 17/8/30.
 *
 * 发布站点前检测：
 * 1、用户是否填写了网站名，若未填写，给出填写
 * 2、用户是否已经完善了SEO信息，若未完善，给出提示和填写框。
 * 3、若1和2均完成，则直接到发布站点
 */
this.publishSite = () => {
    let isShare = false;
    let openDialog = (siteData)=> {
        ngDialog.open({
            template: templatePublish,
            controller: ['$rootScope', '$scope', '$http', 'siteid', '$timeout', '$cs', '$doResource',
                function ($rootScope, $scope, $http, siteid, $timeout, $cs, $rs) {
                    // $scope.siteData = $rootScope.siteData.$$state.value;

                    $scope.siteData = siteData;
                    let copySiteData = angular.copy($scope.siteData);

                    /**
                     * 站点信息是否有效
                     */
                    let isValidSiteInfo = ()=> {
                        // 网站SEO信息
                        if ($scope.siteData.seo_name == '' || $scope.siteData.seo_desc == '' || $scope.siteData.seo_keyword == '') {
                            $scope.lineArr.push({step: 2, name: 'siteSeo'});
                        }

                        // 发布站点的
                        $scope.lineArr.push({step: 3, name: 'publish'});

                        // 还有信息需要完善
                        if ($scope.lineArr.length > 1) {
                            $scope.lineArr.unshift({step: 1, name: 'infoDesc'});
                        }
                    };

                    /**
                     * 设置分享
                     */
                    let setShare = ()=> {
                        if (!isShare) {
                            $window._bd_share_config = {
                                common: {
                                    bdText: $scope.siteData.site_name,
                                    bdDesc: $scope.siteData.seo_desc,
                                    bdUrl: 'http://' + $scope.siteData.free_domainname + '.' + $scope.siteData.ext_domain,
                                    bdPic: $scope.siteData.logo
                                },
                                share: [{
                                    "bdSize": 16
                                }]
                            };

                            jQuery.getScript('http://bdimg.share.baidu.com/static/api/js/share.js');
                            isShare = true;
                        }
                    };

                    /**
                     * 设置剪贴板数据
                     */
                    let setClipboard = ()=> {
                        let clipboard = new Clipboard('.copybtn');
                        clipboard.on('success', function (e) {
                            $(e.trigger).text("复制成功");
                            e.clearSelection();
                        });

                        clipboard.on('error', function (e) {
                            $(e.trigger).text("复制失败")
                        });
                    };

                    /**
                     * 开始发布站点
                     */
                    let publishing = ()=> {
                        $scope.state = "process";
                        $timeout(() => {
                            const unsubscribe = $cs.on(LAYOUT_SAVED, function () {
                                $http.post(rsPath(`/sites/${siteid}/push`)).success(() => {
                                    $scope.state = "success";
                                $timeout(() => {
                                    $scope.stateEnd = true;
                                // 重置分享
                                if (isShare) {
                                    $window._bd_share_main.init();
                                }
                            }, 2000);
                            }).error(() => {
                                    $scope.state = "error";
                            });
                            });

                        $scope.stateEnd = false;
                        $scope.publish = () => {
                            $scope.state = "process";
                            $cs.post('SAVE_LAYOUT');
                        };
                        $scope.publish();

                        $scope.$on('$destroy', unsubscribe);
                    }, 3000);
                    };

                    /**
                     * 准备发布站点
                     */
                    let toPublish = ()=> {
                        // 设置分享
                        setShare();
                        // 设置剪贴板数据
                        setClipboard();

                        // 保存站点SEO
                        $rs.saveSite($scope.siteData);

                        // 开始发布站点
                        publishing();
                    };


                    $scope.publishInit = ()=> {
                        // 用户操作步骤路线
                        $scope.lineArr = [];

                        // 当前步骤的下标
                        $scope.stepIndex = 0;

                        // 当前步骤名
                        $scope.nowStepName = '';

                        // 站点信息是否有效,获取线路
                        isValidSiteInfo();
                        $scope.nowStepName = $scope.lineArr[$scope.stepIndex].name;

                        // 无完善的站点信息，则直接发布站点
                        if ($scope.lineArr.length == 1) {
                            toPublish();
                        }
                    };

                    /**
                     * 下一步
                     */
                    $scope.nextStep = ()=> {
                        $scope.stepIndex++;
                        $scope.nowStepName = $scope.lineArr[$scope.stepIndex].name;
                        if ($scope.nowStepName == 'publish') {
                            toPublish();
                        }
                    };

                    /**
                     * SEO跳过操作：
                     */
                    $scope.seoSkipAction = ()=> {
                        $scope.siteData.seo_name = copySiteData.seo_name;
                        $scope.siteData.seo_desc = copySiteData.seo_desc;
                        $scope.siteData.seo_keyword = copySiteData.seo_keyword;
                    }
                }]
        })
    };

    $http.get(rsPath(`/sites/${siteid}`)).then((data) => {
        openDialog(data.data);
}, ()=> {
        swal();
        SweetAlert.swal('error', '发布失败，请稍后再试', 'error');
    });
};
