#!/bin/bash

APP="node dist/index.js"
LOGFILE="chain-explorer.log"

function get_pid() {
  ps aux | grep "$APP" | grep -v grep | awk '{print $2}'
}

function start() {
  PID=$(get_pid)
  if [ -n "$PID" ]; then
    echo "Process already running with PID $PID"
  else
    echo "Starting Chain Explorer..."
    nohup node dist/index.js > "$LOGFILE" 2>&1 &
    echo "Started with PID $!"
  fi
}

function stop() {
  PID=$(get_pid)
  if [ -z "$PID" ]; then
    echo "No process running."
  else
    echo "Stopping process $PID..."
    kill "$PID"
    sleep 2
    if kill -0 "$PID" 2>/dev/null; then
      echo "Process did not stop, killing forcefully."
      kill -9 "$PID"
    fi
    echo "Stopped."
  fi
}

function status() {
  PID=$(get_pid)
  if [ -n "$PID" ]; then
    echo "Process is running with PID $PID"
  else
    echo "Process is not running"
  fi
}

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  status)
    status
    ;;
  restart)
    stop
    start
    ;;
  *)
    echo "Usage: $0 {start|stop|status|restart}"
    exit 1
esac
