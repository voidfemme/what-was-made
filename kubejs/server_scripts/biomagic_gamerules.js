ServerEvents.loaded((event) => {
  event.server.runCommandSilent("gamerule playersSleepingPercentage 30");
});
