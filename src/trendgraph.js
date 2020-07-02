

import "./styles.css"
import bb from "billboard.js";
import "billboard.js/dist/billboard.css";

export function graph(options) {
    //the output object
    let out = {};
    out.data_ = {};
    out.grid_ = {};
    out.axis_ = {};
    out.bindto_ = ''

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

    out.build = function () {
        var chart = bb.generate({
            data: out.data_,
            grid: out.grid_,
            axis: out.axis_,
            bindto: out.bindto_
        });
    }

    return out;
}