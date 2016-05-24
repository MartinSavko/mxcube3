# -*- coding: utf-8 -*-
from mxcube3 import socketio


class MOTOR_STATE:
     NOTINITIALIZED = "NOTINITIALIZED"
     UNUSABLE = "UNUSABLE"
     READY = "READY"
     MOVESTARTED = "MOVESTARTED"
     MOVING = "MOVING"
     ONLIMIT = "ONLIMIT"

     VALUE_TO_STR = {0: "NOTINITIALIZED",
                     1: "UNUSABLE",
                     2: "READY",
                     3: "MOVESTARTED",
                     4: "MOVING",
                     5: "ONLIMIT"}


class INOUT_STATE:
    IN = "in"
    OUT = "out"
    UNDEFINED = "undefined"

    VALUE_TO_STR = {0: IN,
                    1: OUT,
                    2: UNDEFINED}

    STR_TO_VALUE = {IN: 0,
                    OUT: 1,
                    UNDEFINED: 2}


BEAMLINE_SETUP = None

# Sinlgeton like interface is needed to keep the same referance to the 
# mediator object and its corresponding hardware objects, so that signal
# system wont cleanup signal handlers. (PyDispatcher removes signal handlers
# when a object is garabge collected)
def BeamlineSetupMediator(*args):
    global BEAMLINE_SETUP

    if BEAMLINE_SETUP is None:
        BEAMLINE_SETUP = _BeamlineSetupMediator(*args)

    return BEAMLINE_SETUP


class _BeamlineSetupMediator(object):
    """
    Mediator between Beamline route and BeamlineSetup hardware object. Providing
    missing functionality while the HardwareObjects are frozen. The
    functionality should eventually be included in the hardware objects or other
    suitable places once the UI part have stabilized.
    """
    def __init__(self, beamline_setup):
        self._bl = beamline_setup
        self._ho_dict = {}


    def getObjectByRole(self, name):
        ho = self._bl.getObjectByRole(name.lower())

        if name == "energy":
            return self._ho_dict.setdefault(name, EnergyHOMediator(ho, "energy"))
        elif name == "resolution":
            return self._ho_dict.setdefault(name, ResolutionHOMediator(ho, "resolution"))
        elif name == "transmission":
            return self._ho_dict.setdefault(name, TransmissionHOMediator(ho, "transmission"))
        elif name == "fast_shutter":
            return self._ho_dict.setdefault(name, InOutHOMediator(ho, "fastShutter"))
        else:
            return ho


    def dict_repr(self):
        """
        :returns: Dictionary value-representation for each beamline attribute
        """
        energy =  self.getObjectByRole("energy")
        transmission = self.getObjectByRole("transmission")
        resolution = self.getObjectByRole("resolution")    
        fast_shutter = self.getObjectByRole("fast_shutter")
        
        data = {"energy": energy.dict_repr(),
                "transmission": transmission.dict_repr(),
                "resolution": resolution.dict_repr(),
                "fastShutter": fast_shutter.dict_repr()}

        return data


class HOMediatorBase(object):
    def __init__(self, ho, name=''):
        """
        :param HardwareObject ho: Hardware object to mediate for.
        :returns: None
        """
        self._ho = ho
        self._name = name


    def __getattr__(self, attr):
        if attr.startswith("__"):
            raise AttributeError(attr)
        return getattr(self._ho, attr)

    def set(self, value):
        pass


    def get(self):
        pass


    def state(self):
        pass


    def stop(self):
        pass


    def limits(self):
        return (0, 1, 1)


    def dict_repr(self):
        data = {"name": self._name,
                "value": self.get(),
                "limits":self.limits(),
                "state": self.state(),
                "msg": ""}

        return data



class EnergyHOMediator(HOMediatorBase):
    """
    Mediator for Energy Hardware Object, a web socket is used communicate
    information on longer running processes.
    """
    def __init__(self, ho, name=''):
        super(EnergyHOMediator, self).__init__(ho, name)
        ho.connect("energyChanged", self.value_change)


    def __getattr__(self, attr):
        return getattr(self._ho, attr)


    def set(self, value):
        """
        :param value: Value (castable to float) to set

        :raises ValueError: When value for any reason can't be retrieved
        :raises StopItteration: When a value change was interrupted
                                (aborted or cancelled)

        :returns: The actual value set
        :rtype: float
        """
        try:
            self._ho.start_move_energy(float(value))
            res = self.get()
        except:
            raise

        return res       


    def get(self):
        """
        :returns: The value
        :rtype: float
        :raises ValueError: When value for any reason can't be retrieved
        """
        try:
            energy = self._ho.getCurrentEnergy()
            energy = round(float(energy), 4)
        except (AttributeError, TypeError):
            raise ValueError("Could not get value")

        return energy


    def state(self):
        state = MOTOR_STATE.READY

        try:
            state = self._ho.energy_motor.getState()
        except Exception as ex:
            pass

        return state


    def stop(self):
        self._ho.stop()


    def value_change(self, energy, wavelength):
        data = {"name": "energy", "value": energy, "state": self.state(), "msg": ""}
        socketio.emit("beamline_value_change", data, namespace="/hwr")


class InOutHOMediator(HOMediatorBase):
    def __init__(self, ho, name=''):
        super(InOutHOMediator, self).__init__(ho, name)
        ho.connect("actuatorStateChanged", self.value_change)


    def __getattr__(self, attr):
        return getattr(self._ho, attr)


    def set(self, state):
        if state == INOUT_STATE.IN:
            self._ho.actuatorIn()
        elif state == INOUT_STATE.OUT:
            self._ho.actuatorOut()


    def get(self):
        return self._ho.getActuatorState()


    def stop(self):
        self._ho.stop()


    def state(self):
        return self._ho.getActuatorState()


    def value_change(self):
        pass


    def dict_repr(self):
        data = {"name": self._name,
                "value": self.get(),
                "limits": (0, 1, 1),
                "state": self.state()}

        return data



class TransmissionHOMediator(HOMediatorBase):
    def __init__(self, ho, name=''):
        super(TransmissionHOMediator, self).__init__(ho, name)
        ho.connect("attFactorChanged", self.value_change)


    def __getattr__(self, attr):
        return getattr(self._ho, attr)


    def set(self, value):
        try:
            self._ho.set_value(round(float(value), 2))
        except Exception as ex:
            raise ValueError("Can't set transmission: %s" % str(ex))

        return self.get()


    def get(self):
        try:
            transmission = self._ho.getAttFactor()
            transmission = round(float(transmission), 2)
        except (AttributeError, TypeError):
            transmission = 0

        return transmission


    def stop(self):
        self._ho.stop()


    def state(self):
        return MOTOR_STATE.READY if self._ho.isReady() else MOTOR_STATE.MOVING


    def value_change(self, value):
        socketio.emit("beamline_value_change", self.dict_repr(), namespace="/hwr")


class ResolutionHOMediator(HOMediatorBase):
    def __init__(self, ho, name=''):
        super(ResolutionHOMediator, self).__init__(ho, name)
        ho.connect("valueChanged", self.value_change)


    def set(self, value):
        self._ho.move(round(float(value), 3))
        return self.get()


    def get(self):
        try:
            resolution = self._ho.getPosition()
            resolution = round(float(resolution), 3)
        except (TypeError, AttributeError):
            resolution = 0

        return resolution


    def stop(self):
        self._ho.stop()


    def state(self):
        return MOTOR_STATE.VALUE_TO_STR.get(self._ho.getState(), 0)


    def value_change(self, value):
        socketio.emit("beamline_value_change", self.dict_repr(), namespace="/hwr")
        

