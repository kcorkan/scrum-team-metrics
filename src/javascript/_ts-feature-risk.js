Ext.define('Rally.technicalservices.chart.FeatureRisk', {
    extend: 'Rally.ui.chart.Chart',
    alias: 'widget.tsfeatureriskpie',

    config: {
        featureSummaryCalculator: undefined,
        displayColorClassificationMapping: {
            '#107c1e': 'On Track',
            '#df1a7b': 'High Risk',
            '#fce205': 'Moderate Risk'
        },
        classificationChartColorMapping: {
            'On Track': 'green',
            'High Risk': 'red',
            'Moderate Risk': 'yellow',
            'Other': '#f6f6f6'
        },
        completedColor: '#8bbc21' ,
        currentColor: '#2f7ed8',

        loadMask: false,

        chartConfig: {
            colors: [ '#8bbc21', '#2f7ed8', '#910000',
                '#492970', '#f28f43', '#145499','#77a1e5', '#c42525', '#a6c96a',
                '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9','#aa1925',
                '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1','#1aadce',
                '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
                '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],

            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '',
                align: 'center',
                useHTML: true
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: 5,
                        style: {
                           // fontWeight: 'bold',
                            color: 'black',
                           // textShadow: '0px 1px 2px black',
                            fontSize: '12px'
                        },
                        format: '{point.name}: {point.y}'
                    },
                    center: ['50%', '50%'],
                    size: '75%'
                }
            }
        },
        chartData: {
            series: []
        }

    },
    constructor: function(config) {
        this.mergeConfig(config);
        this.chartConfig.title.text = this._getTitle();
        this.chartData.series = this._getSeries(config.featureSummaryCalculator.featureColorData);

        this.callParent([this.config]);
    },
    initComponent: function() {
        this.callParent(arguments);
        this.setWidth(300);
    },
    _getSeries: function(records){
        console.log('_getSeries', records);
        var color_data = {},
            data = [];

        _.each(records, function(r){
            var color = r.get('DisplayColor') || 'Other';
            var classification = this.displayColorClassificationMapping[color] || 'Other';
            color_data[classification] = color_data[classification] || 0;
            color_data[classification]++;
        }, this);

        _.each(this.classificationChartColorMapping, function(color, classification){
            data.push({
                name: classification,
                y: color_data[classification] || 0,
                color: this.classificationChartColorMapping[classification]
            });
        }, this);

        return [{
            name: 'Risk Color',
            data: data,
            size: '80%',
            dataLabels: {
                formatter: function(){
                    return this.point.name + ': ' + this.y + '%'
                }
            }
        }];
    },
    _getTitle: function(){
        return Ext.String.format('<div style="text-align:center"><span style="font-size:20px;color:black;"><b>{0}</b></span></div>', this.title);
    },
    //Overriding this function because we want to set colors ourselves.
    _setChartColorsOnSeries: function (series) {
        return null;
    }

});