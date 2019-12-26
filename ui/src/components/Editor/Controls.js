import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GRAPH_RUNNING_STATUS } from '../../constants';
import { makeControlButton, makeControlToggles } from '../Common/controlButton';
import { VIEW_MODE } from './index'

export default class Controls extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    graphRunningStatus: PropTypes.oneOf(Object.values(GRAPH_RUNNING_STATUS)),
    onApprove: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onGenerateCode: PropTypes.func.isRequired,
    onRearrange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onUpgradeNodes: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  render() {
    return (
      <div className={this.props.className + ' ' + (this.props.readonly ? 'readonly' : 'editable')}>
        { makeControlToggles ({
            items: [
                {
                  img: 'save.svg',
                  text: 'Graph',
                  value: VIEW_MODE.GRAPH,
              },
              {
                img: 'check-square.svg',
                text: 'Properties',
                value: VIEW_MODE.NODE,
              },
              {
                img: 'check-square.svg',
                text: 'Runs',
                value: VIEW_MODE.RUNS,
              },
            ],
          index: this.state.index,
          func: (view_mode) => this.props.onViewMode(view_mode),
          onIndexChange: (index) => this.setState({index: index}),
        })
        }
        {!this.props.readonly &&
          makeControlButton({
            img: 'save.svg',
            text: 'Save',
            func: () => {
              this.props.onSave();
            },
          })
        }
        {!this.props.readonly &&
          makeControlButton({
            img: 'check-square.svg',
            text: 'Validate',
            func: () => {
              this.props.onValidate();
            },
          })
        }
        {!this.props.readonly &&
          makeControlButton({
            img: 'play.svg',
            text: 'Run',
            func: () => {
              this.props.onApprove();
            },
          })
        }
        {!this.props.readonly &&
          makeControlButton({
            img: 'trending-up.svg',
            text: 'Upgrade Nodes',
            func: () => {
              this.props.onUpgradeNodes();
            },
          })
        }
        {makeControlButton({
          img: 'rearrange.svg',
          text: 'Rearrange nodes',
          func: () => {
            this.props.onRearrange();
          },
        })}
        {makeControlButton({
          img: 'preview.svg',
          text: 'API',
          func: () => {
            this.props.onGenerateCode();
          },
        })}
        {makeControlButton({
          img: 'copy.svg',
          text: 'Clone',
          func: () => {
            this.props.onClone();
          },
        })}
        {(this.props.graphRunningStatus === GRAPH_RUNNING_STATUS.RUNNING || this.props.graphRunningStatus === GRAPH_RUNNING_STATUS.FAILED_WAITING) &&
          makeControlButton({
            img: 'x.svg',
            text: 'Cancel',
            func: () => {
              this.props.onCancel();
            },
          })
        }
      </div>
    );
  }
}
