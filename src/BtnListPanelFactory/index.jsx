'use strict';

import React from 'react';

import FunctionButtons from '../FunctionButtons/';

import './index.css';

const create = (options) => React.createClass({
    displayName: options.displayName,

    componentWillMount() {
        options.btnList = options.btnList || [];
        options.btnList.map(val => {
            if (val.other)
                val.others = this.props
        })
    },
    render: function () {
        return (
            <div className="panel-box">
                <FunctionButtons multi={options.multi}
                                 functions={ options.btnList }
                />
                <div className="panel-box-body">
                    {this.props.children}
                </div>
            </div>
        )
    }
});

export default {create}
