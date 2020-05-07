$(function () {

    function setData(attrName, data) {
        $("#test").attr(attrName, data);
    }

    DevExpress.localization.locale(navigator.language);
    DevExpress.localization.locale("ru");

    $("#analytQueryName").dxTextBox({
        value: "",
        onValueChanged: function (e) {
            setData("analyt-query-name", e.value);
        },
    });


    $.getJSON(IP_TO_INDICATOR_CORE + "list", function (indicatorList) {
        console.log(indicatorList);
        var prepearedList = [];
        indicatorList.forEach(element => {
            if (element.code !== "") {
                prepearedList.push(element);
            }
        });
        $("#indicator-select").dxSelectBox({
            items: prepearedList,
            valueExpr: "code",
            displayExpr: "code",
            onValueChanged: function (indicatorName) {
                setData("indicator-name", indicatorName.value);
                console.log(indicatorName);
                initIndicatorData(indicatorName.value);
            }
        });
    });

    var getSelectedItemsKeys = function (items) {
        var result = [];
        items.forEach(function (item) {
            if (item.selected) {
                result.push(item.key);
            }
            if (item.items.length) {
                result = result.concat(getSelectedItemsKeys(item.items));
            }
        });
        return result;
    };

    function initIndicatorData(indicatorName) {
        $.getJSON(IP_TO_INDICATOR_CORE + indicatorName + "/meta", function (data) {
            console.log(data);


            var dataSource = function (jsonFile, key) {
                return new DevExpress.data.CustomStore({
                    loadMode: "raw",
                    key: key,
                    load: function () {
                        return jsonFile;
                    },
                    update: function (key, values) {
                        console.log(key);
                        console.log(values);
                    },
                });
            };

            $("#measures").dxDropDownBox({
                valueExpr: "code",
                placeholder: 'Выберите факты',
                displayExpr: "code",
                showClearButton: true,
                dataSource: dataSource(data.measureList, "code"),
                onValueChanged: function (e) {
                    setData("measure-data", e.value);
                },
                contentTemplate: function (e) {
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["code", "ru"],
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            });

            $("#dimensions").dxDropDownBox({
                valueExpr: "code",
                placeholder: 'Выберите измерения',
                displayExpr: "code",
                showClearButton: true,
                dataSource: dataSource(data.dimensionList, "code"),
                onValueChanged: function (e) {
                    setData("dimension-data", e.value);
                },
                contentTemplate: function (e) {
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["code", "ru"],
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            });

            var now = new Date();

            $("#select-timeStart").dxDateBox({
                type: "datetime",
                displayFormat: "yyyy-MM-ddTHH:mm:ssx",
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssx",
                onValueChanged: function (e) {
                    setData("time-start", e.value);
                },
                value: now
            });

            $("#select-timeFinish").dxDateBox({
                type: "datetime",
                displayFormat: "yyyy-MM-ddTHH:mm:ssx",
                dateSerializationFormat: "yyyy-MM-ddTHH:mm:ssx",
                onValueChanged: function (e) {
                    setData("time-finish", e.value);
                },
                value: now
            });

            var granularityList = [
                "day", "month", "year"
            ]
            $("#select-granularity").dxSelectBox({
                items: granularityList,
                onValueChanged: function (e) {
                    setData("granularity-data", e.value);
                },
            });

            $("#preFilters").dxDropDownBox({
                valueExpr: "alias",
                placeholder: 'Выберите предварительные фильтры',
                displayExpr: "alias",
                showClearButton: true,
                dataSource: dataSource(data.preFilterList, "alias"),
                onValueChanged: function (e) {
                    setData("pre-filter-data", e.value);
                },
                contentTemplate: function (e) {
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["alias"],
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            });

            var filterDataSource = function (jsonFile, key) {
                return new DevExpress.data.CustomStore({
                    loadMode: "raw",
                    key: key,
                    load: function () {
                        return jsonFile;
                    },
                    update: function (key, values) {
                        console.log(key);
                        console.log(values);
                        console.log(filterList);
                        filterList = filterList.concat(data.dimensionList);
                        console.log(filterList);
                    },
                });
            };

            var filterList = data.measureList.concat(data.dimensionList);
            console.log(filterList);

            var formData;

            $("#filters").dxDropDownBox({
                valueExpr: "code",
                placeholder: 'Выберите фильтр',
                displayExpr: "code",
                showClearButton: true,
                dataSource: filterDataSource(filterList, "code"),
                onValueChanged: function (e) {
                    setData("filter-data", e.value);
                },
                contentTemplate: function (e) {
                    console.log(e.component.option("dataSource"));
                    var value = e.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            dataSource: e.component.option("dataSource"),
                            columns: ["code", "ru", "operand", "values"],
                            editing: {
                                mode: "row",
                                allowUpdating: true
                            },
                            onRowUpdated: function (e) {

                                console.log(e);
                            },
                            hoverStateEnabled: true,
                            paging: {enabled: true, pageSize: 10},
                            filterRow: {visible: true},
                            scrolling: {mode: "infinite"},
                            height: 345,
                            selection: {mode: "multiple"},
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                e.component.option("value", keys);
                            }
                        });

                    dataGrid = $dataGrid.dxDataGrid("instance");

                    e.component.on("valueChanged", function (args) {
                        var value = args.value;
                        dataGrid.selectRows(value, false);
                    });
                    return $dataGrid;
                }
            });

            $("#filter-1").dxSelectBox({
                valueExpr: "code",
                placeholder: 'Фильтр',
                displayExpr: "code",
                dataSource: filterDataSource(filterList, "code"),
                onValueChanged: function (e) {
                    $("#operand-1").dxTextBox({
                        value: "",
                        placeholder: 'Операнд',
                        onValueChanged: function (e) {
                            setData("operand-1-name", e.value);
                            $("#values-1").dxTextBox({
                                value: "",
                                placeholder: "Значения",
                                onValueChanged: function (e) {
                                    setData("filter-value-1-name", e.value);
                                },
                            });
                        },
                    });
                    setData("filter-1-data", e.value);
                },
            });


        });
    }

    var getQuery = function () {
        var dataContainer = $("#test");
        var analytQuery = {
            analytQueryName: dataContainer.attr("analyt-query-name"),
            indicatorName: dataContainer.attr("indicator-name"),
            measures: dataContainer.attr("measure-data"),
            dimensions: dataContainer.attr("dimension-data"),
            timeStart: dataContainer.attr("time-start"),
            timeFinish: dataContainer.attr("time-finish"),
            granularity: dataContainer.attr("granularity-data"),
            preFilters: dataContainer.attr("pre-filter-data"),
            filter: dataContainer.attr("filter-1-data"),
            operand: dataContainer.attr("operand-1-name"),
            filterValue: dataContainer.attr("filter-value-1-name")
        };
        var query =
            {
                "code": dataContainer.attr("analyt-query-name"),
                "indicatorCode": dataContainer.attr("indicator-name"),
                "measures": dataContainer.attr("measure-data").split(","),
                "dimensions": dataContainer.attr("dimension-data").split(","),
                "timeDimensions": {
                    "dimension": "test",
                    "dateRange": [dataContainer.attr("time-start"), dataContainer.attr("time-finish")],
                    "granularity": dataContainer.attr("granularity-data"),
                },
                "preFiltered": dataContainer.attr("pre-filter-data"),
                "filters": [
                    {
                        "field": dataContainer.attr("filter-1-data"),
                        "func": dataContainer.attr("operand-1-name"),
                        "values": [
                            dataContainer.attr("filter-value-1-name")
                        ]
                    }
                ],
                "order": [
                    {
                        "key": "dsdf",
                        "sort": "desc"
                    }
                ],
                "limit": 123,
                "offset": 3434,
                "refreshQuery": true,
                "noGroup": true,
                "groupIndicators": [
                    {
                        "code": "fdasfasfadsf",
                        "indicators": [
                            "dasfdasf24342",
                            "dsafdsafdasfds321321"
                        ]
                    }
                ]
            }

        console.log(JSON.stringify(query));
        return query;
    }

    /*$("#button").dxButton({
        text: "Preview",
        type: "success",
        onClick: function (e) {
            getQuery();
        },
        useSubmitBehavior: true
    });*/

    function formatTableData(jsonUrl) {

        return $.getJSON(jsonUrl).then(function (data) {

            console.log(data.series);

            return data.series
        });
    }

    var showInfo = function (query) {

        $.post(IP_TO_ANALYT_QUERY_CORE, JSON.stringify(query), function (analitQuery) {
            console.log(analitQuery);

            popup = $("#popup").dxPopup({
                title: "Аналитический запрос и SQL",
                visible: true,
                contentTemplate: function (contentElement) {
                    contentElement.append(
                        $("<p />").text("Аналитический запрос..."),
                        $("<p />").text(JSON.stringify(analitQuery)),
                        $("<div />").attr("id", "buttonContainer").dxButton({
                            text: "Сгенерировать SQL",
                            onClick: function () {
                                $.post(IP_GENERATE_SQL + analitQuery.id + '/generate-sql', function (sqlQuery) {
                                    console.log(sqlQuery);
                                    contentElement.append($("<p />").text("Generate sql result:"),
                                        $("<p />").text(JSON.stringify(sqlQuery)),
                                        $("<div />").attr("id", "buttonContainer").dxButton({
                                            text: "Выполнить SQL",
                                            onClick: function () {
                                                $.post(IP_EXECUTE_SQL + sqlQuery.id + '/execute', function (resultSql) {
                                                    console.log(resultSql);
                                                    contentElement.append($("<p />").text("SQL result:"),
                                                        $("<p />").text(JSON.stringify(resultSql)),
                                                    );
                                                });
                                            }
                                        }))
                                })
                            }
                        }))
                }

            });

            popup.show();
        });
    };


    $("#get-analyt-query").dxButton({

        text: "Сформировать аналитический запрос ",
        onClick: function () {
            var query = getQuery();

            showInfo(query);
        }
    })

    var getSqlResult = function (analytQueryCode) {
        $.post(IP_TO_ANALYT_QUERY_CORE, function (data) {
            console.log(data);
        });
    }

});
