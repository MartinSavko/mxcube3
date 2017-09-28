// Constants that are unused within this file but defined here
// for ease of reuse. However eslint complains as soon as they
// are not used within the same file. So disable eslint for this
// section

/* eslint-disable no-unused-vars */

export const QUEUE_RUNNING = 'QueueStarted';
export const QUEUE_STOPPED = 'QueueStopped';
export const QUEUE_PAUSED = 'QueuePaused';
export const QUEUE_FAILED = 'QueueFailed';

export const SAMPLE_MOUNTED = 0x8;
export const TASK_COLLECTED = 0x4;
export const TASK_COLLECT_FAILED = 0x2;
export const TASK_COLLECT_WARNING = 0x3;
export const TASK_RUNNING = 0x1;
export const TASK_UNCOLLECTED = 0x0;

export const READY = 0;
export const RUNNING = 0x1;

export const AUTO_LOOP_CENTRING = 1;
export const CLICK_CENTRING = 0;


export function isCollected(task) {
  return task.state !== TASK_UNCOLLECTED;
}

export const XTAL_SPACEGROUPS =
    ['', 'P1', 'P2', 'P21', 'C2', 'P222', 'P2221', 'P21212',
     'P212121', 'C222 ', 'C2221', 'F222', 'I222', 'I212121',
     'P4', 'P41', 'P42', 'P43', 'P422', 'P4212', 'P4122',
     'P41212', 'P4222', 'P42212', 'P4322', 'P43212', 'I4',
     'I41', 'I422', 'I4122', 'P3', 'P31', 'P32', 'P312',
     'P321', 'P3112', 'P3121', 'P3212', 'P3221', 'P6', 'P61',
     'P65', 'P62', 'P64', 'P63', 'P622', 'P6122', 'P6522',
     'P6222', 'P6422', 'P6322', 'R3', 'R32', 'P23', 'P213',
     'P432', 'P4232', 'P4332', 'P4132', 'F23', 'F432',
     'F4132', 'I23', 'I213', 'I432', 'I4132'];


// These values have to correspond to the EDNA strategy complexity 1 for few
// and 2 for many
export const STRATEGY_COMPLEXITY = { 'Single wedge': 0,
                                     'Few subwedges': 1,
                                     'Many subwedges': 2 };

/* eslint-enable no-unused-vars */

