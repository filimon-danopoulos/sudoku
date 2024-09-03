export function queueTask(task: () => void) {
  const messageChannel = new MessageChannel();
  messageChannel.port1.onmessage = task;
  messageChannel.port2.postMessage('');
}
