export function formatTimestamp(timestamp: { nanoseconds: number; seconds: number }): string {
  if (timestamp) {
    const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  } else return '';
  }
  

  export function formatTimestampJS(dateString: Date): string {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
  
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }
  