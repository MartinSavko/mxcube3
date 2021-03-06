const everpolate = require('everpolate');

const validate = (values, props) => {
  const errors = {};
  if (!props.attributes) {
    // for some reason redux-form is loaded before the initial status
    return errors;
  }
  const currEnergy = parseFloat(values.energy);
  const currRes = parseFloat(values.resolution);
  const currTransmission = parseFloat(values.transmission);
  const energies = props.attributes.resolution.limits.map(value => value[0]);
  const limitsMin = props.attributes.resolution.limits.map(value => value[1]);
  const limitsMax = props.attributes.resolution.limits.map(value => value[2]);
  // here we update the resolution limits based on the energy the typed in the form,
  // the limits come from a table sent by the client
  const resMin = everpolate.linear(currEnergy, energies, limitsMin);
  const resMax = everpolate.linear(currEnergy, energies, limitsMax);

  if (values.num_images === '' ||
      parseInt(values.num_images, 10) > props.acqParametersLimits.number_of_images ||
      parseInt(values.num_images, 10) < 1) {
    errors.num_images = 'Number of images out of allowed range';
  }
  if (values.osc_range === '' ||
    parseInt(values.osc_range, 10) > props.acqParametersLimits.osc_range ||
    parseFloat(values.osc_range, 10) < 0) {
    errors.osc_range = 'wrong value';
  }
  if (values.osc_start === '') {
    errors.osc_start = 'field empty';
  }
  if (values.exp_time === '' || values.exp_time > props.acqParametersLimits.exposure_time ||
      parseFloat(values.exp_time, 10) < 0) {
    errors.exp_time = 'Exposure time out of allowed limit';
  }
  if (!(currRes > resMin && currRes < resMax)) {
    errors.resolution = 'Resolution outside working range';
  }
  if (!(currEnergy > props.attributes.energy.limits[0] &&
        currEnergy < props.attributes.energy.limits[1])) {
    errors.energy = 'Energy outside working range';
  }
  if (!(currTransmission >= 0 && currTransmission <= 100)) {
    errors.transmission = 'Transmission outside working range';
  }
  return errors;
};

export default validate;
