

import "./styles.css"
import bb from "billboard.js";
import "billboard.js/dist/billboard.css";
import * as d3 from "d3";



export function graph(options) {
    //the output object
    let out = {};
    out.datasetCode_ = null;
    out.data_ = {
        x: "x",
        columns: [
            ["x", "2012-01-01", "2013-01-03", "2014-01-04", "2015-01-05", "2016-01-06", "2017-01-06"],
            ["Brussels (Belgium)", [150, 140, 110],
                [155, 130, 115],
                [160, 135, 120],
                [135, 120, 110],
                [180, 150, 130],
                [200, 160, 125]
            ],
            ["EU", 130, 140, 200, 100, 250, 250]
        ],
        types: {
            'Brussels (Belgium)': "area-line-range"
        }
    };
    out.grid_ = {
        x: {
            show: false
        },
        y: {
            show: false,
            lines: [{
                value: '200',
                text: "200 (Prov.Antwerpen, 2017)",
                position: "end"
            },
            {
                value: '110',
                text: "110 ()",
                position: 'start'
            },
            ]
        }
    };
    out.axis_ = {
        x: {
            type: "timeseries",
            tick: {
                format: "%Y"
            }
        }
    };
    out.bindto_ = "#areaRangeChart";
    out.region_ = null;
    out.eurostatRESTBaseURL = "http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/"
    out.urlParams_ = null;

    //definition of generic accessors based on the name of each parameter name
    for (let p in out)
        (function () {
            let p_ = p;
            out[p_.substring(0, p_.length - 1)] = function (v) {
                if (!arguments.length) return out[p_];
                out[p_] = v;
                return out;
            };
        })();

    // 1) get last 5 years of data at given NUTS level
    // 2) for the country of the specified region, find the highest / lowest values for the last 5 years
    // 3) also find the region's values for the 5 years
    // 4) draw the chart as per the example

    // single line for the region and a "range" for the country.

    out.build = function () {

        if (out.region_ && out.urlParams_) {
            let data = getData();
        }

        var chart = bb.generate({
            data: out.data_,
            grid: out.grid_,
            axis: out.axis_,
            bindto: out.bindto_
        });
    }

    function getData() {
        let promises = [];
        let country = out.region_[0] + out.region_[1];

        d3.json(
            `${out.eurostatRESTBaseURL}${out.urlParams_}`
        ).then((data) => {
            let dataIndex = indexStat(data);
            console.log(dataIndex)
        });

    }

    function indexStat(data) {
        const arr = Object.entries(
            data.dimension.geo.category.index
        ).map(([key, val]) => ({ id: key, val: data.value[val] || null }));
        const ind = {};
        for (var i = 0; i < arr.length; i++) ind[arr[i].id] = arr[i].val;
        return ind;
    }

    function getTotals(data) {
        //get total for each country
        let arr = Object.entries(data);
        let dataByCountry = Array.from(d3Array.group(arr, (d) => d[0][0] + d[0][1]));

        let result = {};
        dataByCountry.forEach((country) => {
            let countryTotal = 0;
            for (let i = 0; i < country[1].length; i++) {
                countryTotal = countryTotal + country[1][i][1];
            }
            result[country[0]] = countryTotal;
        });
        return result;
    }


    return out;
}