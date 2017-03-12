statsd-agent
============

Statsd client to monitor CPU, Memory, Disk and Network based on Node JS

## Installation
```
git clone https://github.com/eranbetzalel/statsd-agent-js.git
```
<!---
TODO:
npm install -g statsd-agent-js
npm config statsd-host [statsd-host]
npm start
-->

## Configuration
 * *monitorFilenames* - The monitor filenames relative to the monitors directory.
   * Default: `['cpu-monitor', 'memory-monitor', 'disk-monitor', 'network-monitor']`
 * *collectStatisticsInterval* - The time interval (ms) to collect statistics.
   * Default: `10000`
 * *sendStatisticsInterval* - The time interval (ms) to send statistics.
   * Default: `10000`
 * *statsdConfig* - The [`statsd-client`][statsd-client] package configuration
   * host (default: 'localhost') - Where to send the stats
   * prefix (default: 'system') - Prefix all stats with this value
   * debug (default: 'false') - Print what is being sent to stderr
 * *statisticBlackList* - Array of statistic names ([monitor].[statistic]) to ignore while sending data to statsd.
   * Example: `['memory.used']`

## Running/Stopping (Linux)
Use [forever service][forever-service] to install the agent as linux service.
```
sudo forever-service install statsd-agent-js -s src\app.js
```

Use the following commands to run/stop statsd-agent-js:
```
service statsd-agent-js start
service statsd-agent-js stop
service statsd-agent-js restart
service statsd-agent-js status
```

## Running/Stopping (Windows)
Working on it...

## Monitors
A monitor has 2 purposes collect and send statistics. The statsd name pattern is "hostname.monitor.statistic".


The package delivers with the following monitors:

  * **CPU** - Sends the usage percentage of the common CPU states.
    * *cpu.user* - running user space processes (%)
    * *cpu.nice* - running niced (priority) processes (%)
    * *cpu.sys* - running the kernel (%)
    * *cpu.idle* - processor was idle (%)
    * *cpu.irq* - idle while waiting for an I/O operation to complete (%).
  * **Memory** - Sends the memory usage and total
    * *memory.total* - total memory (bytes)
    * *memory.free* - free memory (bytes)
    * *memory.used* - used memory (bytes)
  * **Disk** - Sends the usage percentage for any available mount points.
    * *disk.[mount-point].total* - total memory (bytes)
    * *disk.[mount-point].free* - free memory (bytes)
    * *disk.[mount-point].used* - used memory (bytes)
  * **Network** - Sends a count of the current connection states.
    * *network.established* - The socket has an established connection
    * *network.syn_sent* - The socket is actively attempting to establish a connection
    * *network.syn_recv* - A connection request has been received from the network
    * *network.fin_wait1* - The socket is closed, and the connection is shutting down
    * *network.fin_wait2* - Connection is closed, and the socket is waiting for  a  shutdown from the remote end
    * *network.time_wait* - The socket is waiting after close to handle packets still in the network
    * *network.close* - The socket is not being used
    * *network.close_wait* - The remote end has shut down, waiting for the socket to close
    * *network.last_ack* - The remote end has shut down, and the socket is closed. Waiting for acknowledgement
    * *network.listen* - The  socket is listening for incoming connections
    * *network.closing* - Both  sockets are shut down but we still don't have all our data sent
    * *network.unknown* - The state of the socket is unknown

[statsd-client]: https://www.npmjs.com/package/statsd-client/
[forever-service]: https://github.com/zapty/forever-service