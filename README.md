# MXCuBE 3 (web)

MXCuBE stands for Macromolecular Xtallography Customized Beamline Environment.
The project started in 2005 at [ESRF](http://www.esrf.eu), since then it has
been adopted by other institutes in Europe. In 2010, a collaboration
agreement has been signed for the development of mxCuBE with the following
partners:

* ESRF
* [Soleil](http://www.synchrotron-soleil.fr/)
* [Max lab](https://www.maxlab.lu.se/)
* [HZB](http://www.helmholtz-berlin.de/)
* [EMBL](http://www.embl.org/)
* [Global Phasing Ltd.](http://www.globalphasing.com/)
* [ALBA](https://www.cells.es/en)
* [DESY](https://www.desy.de)

This version corresponds to the web-based interface (aka MXCuBE 3), currently under development. Although it shares the code that talks to equipment with the original version. The original project is based on Qt (Qt3 initially but moving to Qt4), see the [main repository](https://github.com/mxcube/mxcube). 

Latest information about the MXCuBE project can be found in the
[project webpage](http://mxcube.github.io/mxcube/).

### Technologies in use

For the backend we are using Python-flask as the microwebframework, with the SocketIO library for handling internal messages of the Hardware Objects (see below). 
The web server tries to provide to the client a Rest like api. See [here](http://mxcube.github.io/mxcube3/) for the documentation.

And for the client interface a react based development, configured through webpack for an easy developemnt. Among others, we are also using socket-io and  bootstrap.

### HardwareObjects

As the Qt version, the Hardware objects are self-contained pieces of software code with links to the underlying instrumentation control software. Their purpose is to provide a way for an application to interact with an instrument (e.g. sample changer) or motor (e.g. monochromator rotation axis). It is common for one hardware object to interact with more than one piece of underlying control software in order to implement a workflow which uses multiple hardware components or procedures. There are methods for creating hardware objects which are configured using eXtensible Markup Language (XML) files loaded through a server. Only one instance of a hardware object runs for a given piece of instrumentation and this instance is available to handle requests made by other hardware objects or bricks. A hardware object provides a Python application programming interface (API) and handles asynchronous communication between other hardware objects by emitting signals.

For the web development we are using the branch 2.1, as well as a set of HardwareObject mockups so no real hardware is needed, [repository](https://github.com/mxcube/HardwareObjects).

### Installation and testing

Follow the instructions [here](https://github.com/mxcube/mxcube/blob/master/docs/source/installation_instructions_web.rst)



