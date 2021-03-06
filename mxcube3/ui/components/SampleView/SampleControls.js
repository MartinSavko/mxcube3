import './SampleView.css';
import React from 'react';
import { OverlayTrigger, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import 'fabric';
const fabric = window.fabric;

export default class SampleControls extends React.Component {


  constructor(props) {
    super(props);

    this.takeSnapShot = this.takeSnapShot.bind(this);
    this.doTakeSnapshot = this.doTakeSnapshot.bind(this);
    this.setZoom = this.setZoom.bind(this);
    this.toggleFrontLight = this.toggleLight.bind(this, 'FrontLight');
    this.toggleBackLight = this.toggleLight.bind(this, 'BackLight');
    this.toggleCentring = this.toggleCentring.bind(this);
    this.toggleDrawGrid = this.toggleDrawGrid.bind(this);
    this.availableVideoSizes = this.availableVideoSizes.bind(this);
  }

  componentDidMount() {
    window.takeSnapshot = this.doTakeSnapshot;
  }


  setZoom(option) {
    this.props.sampleActions.sendZoomPos(option.target.value);
  }

  toggleDrawGrid() {
    this.props.sampleActions.toggleDrawGrid();
  }

  doTakeSnapshot() {
    const img = document.getElementById('sample-img');
    const fimg = new fabric.Image(img);
    let imgDataURI = '';
    this.props.canvas.setBackgroundImage(fimg);
    this.props.canvas.renderAll();
    imgDataURI = this.props.canvas.toDataURL({ format: 'jpeg' });
    this.props.canvas.setBackgroundImage(0);
    this.props.canvas.renderAll();
    return imgDataURI;
  }

  takeSnapShot() {
    document.getElementById('downloadLink').href = this.doTakeSnapshot();
    const sampleName = this.props.sampleList[this.props.current.sampleID].sampleName;
    const filename = `${this.props.proposal}-${sampleName}.jpeg`;
    document.getElementById('downloadLink').download = filename;
  }

  toggleCentring() {
    const { sendStartClickCentring, sendAbortCentring } = this.props.sampleActions;
    const { clickCentring } = this.props;
    if (clickCentring) {
      sendAbortCentring();
    } else {
      sendStartClickCentring();
    }
  }

  toggleLight(name) {
    const lighstate = this.props.motors[`${name}Switch`].position;

    if (lighstate) {
      this.props.sampleActions.sendLightOff(name);
    } else {
      this.props.sampleActions.sendLightOn(name);
    }
  }


  availableVideoSizes() {
    const items = this.props.videoSizes.map((size) => {
      const sizeGClass = this.props.width === String(size[0]) ? 'fa-dot-circle-o' : 'fa-circle-o';

      return (
        <MenuItem
          key={`${size[0]} x ${size[1]}`}
          eventKey="1"
          onClick={() => this.props.sampleActions.setVideoSize(size[0], size[1])}
        >
          <span className={`fa ${sizeGClass}`} /> {`${size[0]} x ${size[1]}`}
        </MenuItem>
      );
    });

    const autoScaleGClass = this.props.autoScale ? ' fa-check-square-o' : 'fa-square-o';

    items.push((
      <MenuItem
        eventKey="3"
        key="auto scale"
        onClick={() => {
          const clientWidth = document.getElementById('outsideWrapper').clientWidth;
          this.props.sampleActions.toggleAutoScale(clientWidth);
        }}
      >
        <span className={`fa ${autoScaleGClass}`} /> Auto Scale
      </MenuItem>));

    return items;
  }

  render() {
    const motors = this.props.motors;
    return (
      <div style={ { display: 'flex', position: 'absolute', width: '100%' } } >
        <div className="sample-controlls text-center" >
          <ul className="bs-glyphicons-list">
          <li>
          <a style={{ marginTop: '0.3em' }}
            href="#"
            id="downloadLink"
            data-toggle="tooltip"
            title="Take snapshot"
            className="fa fa-camera sample-controll"
            onClick={this.takeSnapShot}
            download
          />
          <span className="sample-controll-label">Snapshot</span>
          </li>
          <li>
          <Button
            type="button"
            data-toggle="tooltip"
            title="Draw grid"
            className="fa fa-th sample-controll"
            onClick={this.toggleDrawGrid}
            active={this.props.drawGrid}
          />
          <span className="sample-controll-label">Draw grid</span>
          </li>
          <li>
          <Button
            type="button"
            data-toggle="tooltip"
            title="Start 3-click Centring"
            className="fa fa-circle-o-notch sample-controll"
            onClick={this.toggleCentring}
            active={this.props.clickCentring}
          />
          <span className="sample-controll-label">3-click Centring</span>
          </li>
          <OverlayTrigger trigger="click" rootClose placement="bottom"
            overlay={(
              <span className="slider-overlay">
                1
                <input
                  style={{ top: '20px' }}
                  className="bar"
                  type="range"
                  id="zoom-control"
                  min="1" max="10"
                  step="1"
                  defaultValue={motors.zoom.position}
                  disabled={motors.zoom.state !== 2}
                  onMouseUp={this.setZoom}
                  list="volsettings"
                  name="zoomSlider"
                />
                10
              </span>)}
          >

          <li>
            <Button
              type="button"
              data-toggle="tooltip"
              title="Zoom in/out"
              className="fa fa-search sample-controll"
              name="zoomOut"
            />
            <datalist id="volsettings">
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </datalist>
            <span className="sample-controll-label">Zoom</span>
           </li>
           </OverlayTrigger>
           <li>
            <Button
              style={{ paddingRight: '0px' }}
              type="button"
              data-toggle="tooltip"
              title="Backlight On/Off"
              className="fa fa-lightbulb-o sample-controll"
              onClick={this.toggleBackLight}
              active={motors.BackLightSwitch.position === 1}
            />
            <OverlayTrigger trigger="click" rootClose placement="bottom"
              overlay={(
                <span className="slider-overlay" style={{ marginTop: '20px' }}>
                  <input
                    style={{ top: '20px' }}
                    className="bar"
                    type="range"
                    step="0.1"
                    min="0" max="1"
                    defaultValue={motors.BackLight.position}
                    disabled={motors.BackLight.state !== 2}
                    onMouseUp={(e) =>
                      this.props.sampleActions.sendMotorPosition('BackLight', e.target.value)}
                    name="backlightSlider"
                  />
                </span>)}
            >
            <Button
              type="button"
              style={{ paddingLeft: '0px' }}
              className="fa fa-sort-desc sample-controll sample-controll-small"
            />
            </OverlayTrigger>
            <span className="sample-controll-label">Backlight</span>
            </li>
           <li>
            <Button
              style={{ paddingRight: '0px' }}
              type="button"
              data-toggle="tooltip"
              title="Front On/Off"
              className="fa fa-lightbulb-o sample-controll"
              onClick={this.toggleFrontLight}
              active={motors.FrontLightSwitch.position === 1}
            />
            <OverlayTrigger trigger="click" rootClose placement="bottom"
              overlay={(
                <span className="slider-overlay" style={{ marginTop: '20px' }}>
                  <input
                    className="bar"
                    type="range"
                    step="0.1"
                    min="0" max="1"
                    defaultValue={motors.FrontLight.position}
                    disabled={motors.FrontLight.state !== 2}
                    onMouseUp={(e) =>
                      this.props.sampleActions.sendMotorPosition('FrontLight', e.target.value)}
                    name="frontLightSlider"
                  />
                </span>)}
            >
            <Button
              type="button"
              style={{ paddingLeft: '0px', fontSize: '1.5em' }}
              className="fa fa-sort-desc sample-controll sample-controll-small"
            />
            </OverlayTrigger>
            <span className="sample-controll-label">Frontlight</span>
            </li>
            <li>
              <DropdownButton
                style = {{ lineHeight: '1.3', padding: '0px' }}
                className="sample-controll"
                bsStyle="default"
                title={(<i className="fa fa-1x fa-video-camera" />)}
                id={'video-size-dropdown'}
              >
                {this.availableVideoSizes()}
              </DropdownButton>
              <span className="sample-controll-label">Video size</span>
            </li>
            </ul>
          </div>
        </div>
        );
  }
}
